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
  weeklyRest: FormControl<string>;
  vacationStart: FormControl<string>;
  vacationEnd: FormControl<string>;
  monthlySalary: FormControl<string>;
  soldDays: FormControl<number>;
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