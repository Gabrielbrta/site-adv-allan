import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalculadoraTrabalhistaService } from '../../core/services/calculadora-trabalhista.service';
import {
  CalculationResultSection,
  CalculadoraTabDefinition,
  CalculadoraTabId,
  FeriasControls,
  FgtsCalculationResult,
  FgtsControls,
  RescisaoControls,
} from './calculadora-trabalhista.models';
import { CalculationResultComponent } from './components/calculation-result/calculation-result.component';
import { FeriasSectionComponent } from './sections/ferias/ferias-section.component';
import { FgtsSectionComponent } from './sections/fgts/fgts-section.component';
import { RescisaoSectionComponent } from './sections/rescisao/rescisao-section.component';

@Component({
  selector: 'app-calculadora-trabalhista',
  imports: [
    ReactiveFormsModule,
    FgtsSectionComponent,
    FeriasSectionComponent,
    RescisaoSectionComponent,
    CalculationResultComponent,
  ],
  templateUrl: './calculadora-trabalhista.component.html',
  styleUrl: './calculadora-trabalhista.component.scss',
})
export class CalculadoraTrabalhistaComponent {
  private readonly calculadoraService = inject(CalculadoraTrabalhistaService);

  readonly tabs: readonly CalculadoraTabDefinition[] = [
    {
      id: 'fgts',
      title: 'FGTS'
    },
    {
      id: 'ferias',
      title: 'Férias',
    },
    {
      id: 'rescisao',
      title: 'Rescisão',
    },
  ];

  readonly activeTab = signal<CalculadoraTabId>('fgts');

  readonly fgtsForm = new FormGroup<FgtsControls>({
    salaryBase: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contractStart: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contractEnd: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rescisaoType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly feriasForm = new FormGroup<FeriasControls>({
    employeeName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    weeklyRest: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    vacationStart: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    vacationEnd: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    monthlySalary: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    soldDays: new FormControl(0, { nonNullable: true, validators: [Validators.min(0), Validators.max(10)] }),
  });

  readonly rescisaoForm = new FormGroup<RescisaoControls>({
    employeeName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    situation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    admissionDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastServiceDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dismissalReason: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastSalary: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    noticeType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    vacationDue: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dependentsUnder14: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
  });

  readonly form = new FormGroup({
    fgts: this.fgtsForm,
    ferias: this.feriasForm,
    rescisao: this.rescisaoForm,
  });

  constructor() {
    this.syncActiveGroup(this.activeTab());
  }

  private readonly fgtsValue = toSignal(this.fgtsForm.valueChanges, { 
    initialValue: this.fgtsForm.getRawValue() 
  });
  private readonly feriasValue = toSignal(this.feriasForm.valueChanges, { 
    initialValue: this.feriasForm.getRawValue() 
  });
  private readonly rescisaoValue = toSignal(this.rescisaoForm.valueChanges, { 
    initialValue: this.rescisaoForm.getRawValue() 
  });

  readonly completion = computed(() => {
    const tab = this.activeTab();
    
    const value = tab === 'fgts' 
      ? this.fgtsValue() 
      : tab === 'ferias' 
        ? this.feriasValue() 
        : this.rescisaoValue();

    const progress = countProgress(value);

    return {
      filled: progress.filled,
      total: progress.total,
      percent: progress.total === 0 ? 0 : Math.round((progress.filled / progress.total) * 100),
    };
  });

  readonly currentTab = computed(() => this.tabs.find((tab) => tab.id === this.activeTab()) ?? this.tabs[0]);

  readonly fgtsResult = signal<CalculationResultSection | null>(null);
  readonly fgtsRawResult = signal<FgtsCalculationResult | null>(null);

  setTab(tab: CalculadoraTabId): void {
    this.activeTab.set(tab);
    this.form.reset();
    this.fgtsResult.set(null);
    this.fgtsRawResult.set(null);
    this.syncActiveGroup(tab);
  }

  

  submit(): void {
    this.form.markAllAsTouched();

    if (this.activeTab() === 'fgts') {
      this.fgtsForm.controls.contractEnd.setErrors(null);
    }

    if (this.form.invalid) {
      this.fgtsResult.set(null);
      this.activeTab.set(findFirstInvalidTab(this.fgtsForm, this.feriasForm, this.rescisaoForm));
      return;
    }

    if (this.activeTab() !== 'fgts') {
      return;
    }

    const fgtsParams = buildFgtsParams(this.fgtsForm);

    if (fgtsParams === null) {
      this.fgtsForm.controls.contractEnd.setErrors({ dateRange: true });
      this.fgtsForm.controls.contractEnd.markAsTouched();
      this.fgtsResult.set(null);
      return;
    }

    const fgtsResult = this.calculadoraService.fgts(fgtsParams);
    this.fgtsResult.set(toFgtsResultSection(fgtsResult));
    this.fgtsRawResult.set(fgtsResult);
  }

  readonly trackTab = (_index: number, tab: CalculadoraTabDefinition) => tab.id;

  private syncActiveGroup(activeTab: CalculadoraTabId): void {
    if (activeTab === 'fgts') {
      this.fgtsForm.enable({ emitEvent: false });
      this.feriasForm.disable({ emitEvent: false });
      this.rescisaoForm.disable({ emitEvent: false });
      return;
    }

    if (activeTab === 'ferias') {
      this.fgtsForm.disable({ emitEvent: false });
      this.feriasForm.enable({ emitEvent: false });
      this.rescisaoForm.disable({ emitEvent: false });
      return;
    }

    this.fgtsForm.disable({ emitEvent: false });
    this.feriasForm.disable({ emitEvent: false });
    this.rescisaoForm.enable({ emitEvent: false });
  }
}

function countProgress(value: unknown): { filled: number; total: number } {
  if (value === null || value === undefined) {
    return { filled: 0, total: 0 };
  }

  if (Array.isArray(value)) {
    return value.reduce(
      (accumulator: { filled: number; total: number }, item) => {
        const progress = countProgress(item);

        return {
          filled: accumulator.filled + progress.filled,
          total: accumulator.total + progress.total,
        };
      },
      { filled: 0, total: 0 },
    );
  }

  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).reduce(
      (accumulator: { filled: number; total: number }, item) => {
        const progress = countProgress(item);

        return {
          filled: accumulator.filled + progress.filled,
          total: accumulator.total + progress.total,
        };
      },
      { filled: 0, total: 0 },
    );
  }

  return {
    filled: isMeaningfulValue(value) ? 1 : 0,
    total: 1,
  };
}

function isMeaningfulValue(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (typeof value === 'number') {
    return !Number.isNaN(value);
  }

  return value !== null && value !== undefined;
}

function findFirstInvalidTab(
  fgtsForm: FormGroup<FgtsControls>,
  feriasForm: FormGroup<FeriasControls>,
  rescisaoForm: FormGroup<RescisaoControls>,
): CalculadoraTabId {
  if (fgtsForm.invalid) {
    return 'fgts';
  }

  if (feriasForm.invalid) {
    return 'ferias';
  }

  if (rescisaoForm.invalid) {
    return 'rescisao';
  }

  return 'fgts';
}

function buildFgtsParams(form: FormGroup<FgtsControls>) {
  const salaryBase = parseBRLCurrency(form.controls.salaryBase.value);
  const contractStart = parseInputDate(form.controls.contractStart.value);
  const contractEnd = parseInputDate(form.controls.contractEnd.value);
  const rescisaoType = form.controls.rescisaoType.value;

  if (
    salaryBase <= 0 || 
    contractStart === null || 
    contractEnd === null || 
    contractEnd < contractStart ||
    !rescisaoType 
  ) {
    return null;
  }

  return {
    salaryBase,
    contractStart,
    contractEnd,
    rescisaoType
  };
}

function parseBRLCurrency(value: string): number {
  const normalizedValue = value.replace(/\s/g, '').replace('R$', '').replace(/\./g, '').replace(',', '.');
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : NaN;
}

function parseInputDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const [yearText, monthText, dayText] = value.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

function toFgtsResultSection(result: FgtsCalculationResult): CalculationResultSection {
  const penaltyLabel = getPenaltyLabel(result.penaltyRate);
  
  return {
    title: 'Resultado FGTS',
    rows: [
      {
        label: 'Depósitos estimados (8% + 13º)',
        value: formatCurrencyBRL(result.depositAmount),
      },
      {
        label: penaltyLabel,
        value: formatCurrencyBRL(result.penaltyAmount),
      },
      {
        label: 'Total estimado',
        value: formatCurrencyBRL(result.totalAmount),
        emphasize: true,
      },
    ],
    note: `${formatDecimal(result.referenceMonths)} meses de referência. Este é um cálculo aproximado. Consulte o extrato da Caixa para o valor exato.`,
  };
}

function getPenaltyLabel(rate: number): string {
  switch (rate) {
    case 0.40: return 'Multa rescisória (40%)';
    case 0.20: return 'Multa rescisória (20%)';
    default: return 'Multa rescisória (0%)';
  }
}

function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDecimal(value: number): string {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}


