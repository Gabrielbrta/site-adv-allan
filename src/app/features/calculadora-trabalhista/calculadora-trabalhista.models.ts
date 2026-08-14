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

export interface FgtsControls {
  salaryBase: FormControl<string>;
  contractStart: FormControl<string>;
  contractEnd: FormControl<string>;
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