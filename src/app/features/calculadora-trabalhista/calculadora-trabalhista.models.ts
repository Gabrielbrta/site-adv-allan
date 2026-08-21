import { FormControl } from '@angular/forms';

export type CalculadoraTabId = 'fgts' | 'ferias' | 'rescisao';

export interface CalculadoraTabDefinition {
  id: CalculadoraTabId;
  title: string;
  description?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}
export type RescisaoType = 
  | 'sem_justa_causa' 
  | 'justa_causa' 
  | 'pedido_demissao' 
  | 'acordo' 
  | 'rescisao_indireta';

export interface FgtsControls {
  salaryBase: FormControl<string>;
  contractStart: FormControl<string>;
  contractEnd: FormControl<string>;
  rescisaoType: FormControl<RescisaoType | ''>;
}


export interface FgtsCalculationParams {
  salaryBase: number;
  contractStart: Date;
  contractEnd: Date;
  rescisaoType: RescisaoType;
}

export interface FgtsCalculationResult {
  referenceMonths: number;
  depositAmount: number;
  penaltyAmount: number;
  totalAmount: number;
  penaltyRate: number;
}

export interface CalculationResultRow {
  label: string;
  value: string;
  emphasize?: boolean;
}

export interface CalculationResultSection {
  title: string;
  rows: readonly CalculationResultRow[];
  note?: string;
}

export interface FeriasControls {
  employeeName: FormControl<string>;
  acquisitionPeriodStart: FormControl<string>;
  acquisitionPeriodEnd: FormControl<string>;
  vacationStart: FormControl<string>;
  vacationEnd: FormControl<string>;
  monthlySalary: FormControl<string>;
  overtimeAverage: FormControl<string>;
  nightShiftAverage: FormControl<string>;
  commissionAverage: FormControl<string>;
  absences: FormControl<number>;
  soldDays: FormControl<number>;
  dependents: FormControl<number>;
}

export interface FeriasCalculationParams {
  acquisitionPeriodStart: Date;
  acquisitionPeriodEnd: Date;
  vacationStart: Date;
  vacationEnd: Date;
  monthlySalary: number;
  absences: number;
  overtimeAverage: number;
  nightShiftAverage: number;
  commissionAverage: number;
  dependents: number;
  soldDays: number;
}

export interface FeriasCalculationResult {
  entitledDays: number;         
  vacationDays: number;         
  soldDays: number;             
  baseSalary: number;           
  dailyRate: number;            
  vacationValue: number;        
  oneThirdVacation: number;     
  abonoValue: number;           
  oneThirdAbono: number;        
  totalGross: number;           
  inssDiscount: number;         
  totalNet: number;             
}

export interface RescisaoControls {
  employeeName: FormControl<string>;
  situation: FormControl<string>;
  admissionDate: FormControl<string>;
  lastServiceDate: FormControl<string>;
  dismissalReason: FormControl<string>;
  lastSalary: FormControl<string>;
  noticeType: FormControl<string>;
  vacationDue: FormControl<string>;
  dependentsUnder14: FormControl<number>;
}