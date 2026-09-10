import { Injectable } from '@angular/core';
import {
  FeriasCalculationParams,
  FeriasCalculationResult,
  FgtsCalculationParams,
  FgtsCalculationResult,
  RescisaoCalculationParams,
  RescisaoCalculationResult,
} from '../../features/calculadora-trabalhista/calculadora-trabalhista.models';

@Injectable({ providedIn: 'root' })
export class CalculadoraTrabalhistaService {
   
  fgts(params: FgtsCalculationParams): FgtsCalculationResult {
    const referenceMonths = this.countReferenceMonths(params.contractStart, params.contractEnd);
    
    const monthlyDeposit = params.salaryBase * 0.08;
    const depositAmount = roundCurrency(monthlyDeposit * referenceMonths);
    
    const fgts13 = roundCurrency(monthlyDeposit * (referenceMonths / 12));
    const totalDeposits = roundCurrency(depositAmount + fgts13);
    
    let penaltyRate = 0;
    switch (params.rescisaoType) {
      case 'sem_justa_causa':
      case 'rescisao_indireta':
        penaltyRate = 0.40;
        break;
      case 'acordo':
        penaltyRate = 0.20;
        break;
      case 'justa_causa':
      case 'pedido_demissao':
      default:
        penaltyRate = 0;
    }
    
    const penaltyAmount = roundCurrency(totalDeposits * penaltyRate);
    
    return {
      referenceMonths,
      depositAmount: totalDeposits,
      penaltyAmount,
      totalAmount: roundCurrency(totalDeposits + penaltyAmount),
      penaltyRate,
    };

    
  }

   ferias(params: FeriasCalculationParams): FeriasCalculationResult {
    const entitledDays = this.getEntitledDays(Number(params.absences));
    
    const requestedVacationDays = this.calculateDaysBetween(params.vacationStart, params.vacationEnd);
    
    const vacationDays = Math.min(requestedVacationDays, entitledDays);
    
    const validSoldDays = Math.min(Number(params.soldDays), 10);
    
    const baseSalary = params.monthlySalary + 
                       Number(params.overtimeAverage || 0) + 
                       Number(params.nightShiftAverage || 0) + 
                       Number(params.commissionAverage || 0);
    
    const dailyRate = baseSalary / 30;
    
    const vacationValue = entitledDays > 0 ? roundCurrency(dailyRate * vacationDays) : 0;
    const oneThirdVacation = entitledDays > 0 ? roundCurrency(vacationValue / 3) : 0;
    
    const abonoValue = entitledDays > 0 ? roundCurrency(dailyRate * validSoldDays) : 0;
    const oneThirdAbono = entitledDays > 0 ? roundCurrency(abonoValue / 3) : 0;
    
    const totalGross = roundCurrency(vacationValue + oneThirdVacation + abonoValue + oneThirdAbono);
    
    const inssDiscount = this.calculateProgressiveINSS(vacationValue);
    
    const totalNet = roundCurrency(totalGross - inssDiscount);
    
    return {
      entitledDays,
      vacationDays,
      soldDays: validSoldDays,
      baseSalary: roundCurrency(baseSalary),
      dailyRate: roundCurrency(dailyRate),
      vacationValue,
      oneThirdVacation,
      abonoValue,
      oneThirdAbono,
      totalGross,
      inssDiscount,
      totalNet,
    };
  }

  private getEntitledDays(absences: number): number {
    if (absences <= 5) return 30;
    if (absences <= 14) return 24;
    if (absences <= 23) return 18;
    if (absences <= 32) return 12;
    return 0; // Perde o direito a férias
  }


  private calculateDaysBetween(startDate: Date, endDate: Date): number {
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir o dia final
    return diffDays;
  }

  private calculateProgressiveINSS(baseValue: number): number {
    let inss = 0;
    let remaining = baseValue;
    const faixas = [
      { limite: 1412.00, aliquota: 0.075 },
      { limite: 2666.68, aliquota: 0.09 },
      { limite: 4000.03, aliquota: 0.12 },
      { limite: 7786.02, aliquota: 0.14 },
    ];

    let faixaAnterior = 0;

    for (const faixa of faixas) {
      if (remaining <= 0) break;
      
      const baseDeCalculo = Math.min(remaining, faixa.limite - faixaAnterior);
      inss += baseDeCalculo * faixa.aliquota;
      
      remaining -= baseDeCalculo;
      faixaAnterior = faixa.limite;
    }

    return roundCurrency(inss);
  }


  private countReferenceMonths(startDate: Date, endDate: Date): number {
    let count = 0;
    let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    
    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      let startDay = 1;
      let endDay = daysInMonth;
      
      if (current.getTime() === new Date(startDate.getFullYear(), startDate.getMonth(), 1).getTime()) {
        startDay = startDate.getDate();
      }
      
      if (current.getTime() === end.getTime()) {
        endDay = endDate.getDate();
      }
      
      const workedDays = endDay - startDay + 1;
      
      if (workedDays >= 15) {
        count++;
      }
      
      current.setMonth(current.getMonth() + 1);
    }
    
    return count;
  }

  rescisao(params: RescisaoCalculationParams): RescisaoCalculationResult {
    const workedDays = params.lastServiceDate.getDate();
    const dailyRate = params.lastSalary / 30;
    const salaryBalance = roundCurrency(dailyRate * workedDays);

    let noticePeriodDays = 0;
    let noticePeriodValue = 0;
    
    if (params.noticeType === 'indenizado') {
      const yearsWorked = this.calculateYearsWorked(params.admissionDate, params.lastServiceDate);
      noticePeriodDays = 30 + (yearsWorked * 3);
      noticePeriodDays = Math.min(noticePeriodDays, 90);
      noticePeriodValue = roundCurrency((params.lastSalary / 30) * noticePeriodDays);
    } else if (params.noticeType === 'trabalhado') {
      noticePeriodDays = 30;
      noticePeriodValue = 0;
    }

    const noticeEndDate = this.addDays(params.lastServiceDate, noticePeriodDays);

    let vacationExpired = 0;
    let vacationExpiredThird = 0;
    
    if (params.vacationDue) {
      vacationExpired = params.lastSalary;
      vacationExpiredThird = roundCurrency(vacationExpired / 3);
    }

    const monthsWorked = this.countReferenceMonths(params.admissionDate, params.lastServiceDate);
    const proportionalMonths = monthsWorked % 12;
    
    let vacationProportional = 0;
    let vacationProportionalThird = 0;
    
    if (proportionalMonths > 0 && params.dismissalReason !== 'com_justa_causa') {
      vacationProportional = roundCurrency((params.lastSalary / 12) * proportionalMonths);
      vacationProportionalThird = roundCurrency(vacationProportional / 3);
    }

    const thirteenthReferenceMonths = params.dismissalReason === 'com_justa_causa'
      ? 0
      : this.countThirteenthMonths(
        params.admissionDate,
        params.lastServiceDate,
        noticeEndDate,
      );
    const thirteenthProportional = roundCurrency(
      (params.lastSalary / 12) * thirteenthReferenceMonths,
    );
    const thirteenthINSS = this.calculateProgressiveINSS(thirteenthProportional);
    const thirteenthIRRFBase = Math.max(0, thirteenthProportional - thirteenthINSS);
    const thirteenthIRRF = this.calculateProgressiveIRRF(thirteenthIRRFBase);
    const thirteenthNet = roundCurrency(
      thirteenthProportional - thirteenthINSS - thirteenthIRRF,
    );
    const thirteenthFirstInstallment = roundCurrency(thirteenthProportional / 2);
    const thirteenthSecondInstallment = roundCurrency(
      Math.max(0, thirteenthProportional - thirteenthFirstInstallment - thirteenthINSS),
    );

    let fgtsFine = 0;
    const estimatedFGTS = params.lastSalary * 0.08 * monthsWorked;
    
    if (params.dismissalReason === 'sem_justa_causa' || params.dismissalReason === 'resc_indireta') {
      fgtsFine = roundCurrency(estimatedFGTS * 0.40);
    } 

    const totalGross = roundCurrency(
      salaryBalance + 
      noticePeriodValue + 
      vacationExpired + 
      vacationExpiredThird + 
      vacationProportional + 
      vacationProportionalThird + 
      thirteenthProportional + 
      fgtsFine
    );

    const inssBase = salaryBalance + noticePeriodValue;
    const inssDiscount = this.calculateProgressiveINSS(inssBase);
    const totalINSS = roundCurrency(inssDiscount + thirteenthINSS);

    const totalNet = roundCurrency(totalGross - totalINSS - thirteenthIRRF);

    const dismissalReasonLabel = this.getDismissalReasonLabel(params.dismissalReason);

    return {
      workedDays,
      salaryBalance,
      noticePeriodDays,
      noticePeriodValue,
      vacationExpired,
      vacationExpiredThird,
      vacationProportional,
      vacationProportionalThird,
      thirteenthReferenceMonths,
      thirteenthProportional,
      thirteenthINSS,
      thirteenthIRRF,
      thirteenthNet,
      thirteenthFirstInstallment,
      thirteenthSecondInstallment,
      fgtsFine,
      totalGross,
      inssDiscount: totalINSS,
      totalNet,
      dismissalReason: dismissalReasonLabel,
    };
  }

  private countThirteenthMonths(
    admissionDate: Date,
    lastServiceDate: Date,
    noticeEndDate: Date,
  ): number {
    const referenceYear = lastServiceDate.getFullYear();
    const yearStart = new Date(referenceYear, 0, 1);
    const yearEnd = new Date(referenceYear, 11, 31);
    const startDate = admissionDate > yearStart ? admissionDate : yearStart;
    const endDate = noticeEndDate < yearEnd ? noticeEndDate : yearEnd;

    if (startDate > endDate) {
      return 0;
    }

    return this.countReferenceMonths(startDate, endDate);
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private calculateProgressiveIRRF(baseValue: number): number {
    const brackets = [
      { limit: 2259.20, rate: 0, deduction: 0 },
      { limit: 2826.65, rate: 0.075, deduction: 169.44 },
      { limit: 3751.05, rate: 0.15, deduction: 381.44 },
      { limit: 4664.68, rate: 0.225, deduction: 662.77 },
      { limit: Number.POSITIVE_INFINITY, rate: 0.275, deduction: 896.00 },
    ];

    const bracket = brackets.find(({ limit }) => baseValue <= limit);
    return bracket ? roundCurrency(Math.max(0, baseValue * bracket.rate - bracket.deduction)) : 0;
  }

  private getDismissalReasonLabel(reason: string): string {
    switch (reason) {
      case 'sem_justa_causa': return 'Dispensa sem justa causa';
      case 'com_justa_causa': return 'Dispensa com justa causa';
      case 'pedido_demissao': return 'Pedido de demissão';
      case 'resc_indireta': return 'Rescisão indireta';
      default: return reason;
    }
  }

  private calculateYearsWorked(startDate: Date, endDate: Date): number {
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 365);
  }
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

