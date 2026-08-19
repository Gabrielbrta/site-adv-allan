import { Injectable } from '@angular/core';
import {
  FgtsCalculationParams,
  FgtsCalculationResult,
} from '../../features/calculadora-trabalhista/calculadora-trabalhista.models';

@Injectable({ providedIn: 'root' })
export class CalculadoraTrabalhistaService {
   
  fgts(params: FgtsCalculationParams): FgtsCalculationResult {
    const referenceMonths = this.countReferenceMonths(params.contractStart, params.contractEnd);
    
    // Depósitos mensais (8%)
    const monthlyDeposit = params.salaryBase * 0.08;
    const depositAmount = roundCurrency(monthlyDeposit * referenceMonths);
    
    // FGTS sobre 13º salário (estimativa: 1/12 por mês trabalhado)
    const fgts13 = roundCurrency(monthlyDeposit * (referenceMonths / 12));
    const totalDeposits = roundCurrency(depositAmount + fgts13);
    
    // Define a taxa de multa conforme o tipo de rescisão
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

  /**
   * Conta meses pela regra trabalhista:
   * - 15 dias ou mais no mês = conta como mês inteiro
   * - menos de 15 dias = não conta
   */
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
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}