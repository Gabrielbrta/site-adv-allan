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
  FeriasCalculationResult,
  FeriasCalculationParams,
  RescisaoCalculationResult,
  RescisaoCalculationParams,
} from './calculadora-trabalhista.models';
import { CalculationResultComponent } from './components/calculation-result/calculation-result.component';
import { FeriasSectionComponent } from './sections/ferias/ferias-section.component';
import { FgtsSectionComponent } from './sections/fgts/fgts-section.component';
import { RescisaoSectionComponent } from './sections/rescisao/rescisao-section.component';
import { Meta, Title } from '@angular/platform-browser';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-calculadora-trabalhista',
  imports: [
    ReactiveFormsModule,
    FgtsSectionComponent,
    FeriasSectionComponent,
    RescisaoSectionComponent,
    CalculationResultComponent,
    ButtonComponent
  ],
  templateUrl: './calculadora-trabalhista.component.html',
  styleUrl: './calculadora-trabalhista.component.scss',
})
export class CalculadoraTrabalhistaComponent {

  private readonly calculadoraService = inject(CalculadoraTrabalhistaService);

  readonly tabs: readonly CalculadoraTabDefinition[] = [
    {
      id: 'rescisao',
      title: 'Rescisão',
    },
    {
      id: 'ferias',
      title: 'Férias',
    },
    {
      id: 'fgts',
      title: 'FGTS'
    },
  ];

  readonly activeTab = signal<CalculadoraTabId>('rescisao');

  readonly fgtsForm = new FormGroup<FgtsControls>({
    salaryBase: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contractStart: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contractEnd: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rescisaoType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly feriasForm = new FormGroup<FeriasControls>({
  employeeName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  acquisitionPeriodStart: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  acquisitionPeriodEnd: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  
  vacationStart: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  vacationEnd: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  
  monthlySalary: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  overtimeAverage: new FormControl('', { nonNullable: true }),
  nightShiftAverage: new FormControl('', { nonNullable: true }),
  commissionAverage: new FormControl('', { nonNullable: true }),
  
  absences: new FormControl(0, { nonNullable: true, validators: [Validators.min(0), Validators.max(60)] }),
  soldDays: new FormControl(0, { nonNullable: true, validators: [Validators.min(0), Validators.max(10)] }),
  dependents: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)]})

  });

  readonly rescisaoForm = new FormGroup<RescisaoControls>({
    employeeName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    admissionDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastServiceDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dismissalReason: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastSalary: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    noticeType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    vacationDue: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly form = new FormGroup({
    fgts: this.fgtsForm,
    ferias: this.feriasForm,
    rescisao: this.rescisaoForm,
  });

  constructor(private title: Title, private meta: Meta) {
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

  readonly feriasResult = signal<CalculationResultSection | null>(null);
  readonly feriasRawResult = signal<FeriasCalculationResult | null>(null);

  readonly rescisaoResult = signal<CalculationResultSection | null>(null);
  readonly rescisaoRawResult = signal<RescisaoCalculationResult | null>(null);

  setTab(tab: CalculadoraTabId): void {
    this.activeTab.set(tab);
    this.form.reset();
    this.fgtsResult.set(null);
    this.fgtsRawResult.set(null);
    this.feriasResult.set(null);
    this.feriasRawResult.set(null);
    this.rescisaoResult.set(null);
    this.rescisaoRawResult.set(null);
    this.syncActiveGroup(tab);
  }

  

      submit(): void {
    this.form.markAllAsTouched();

    if (this.activeTab() === 'fgts') {
      this.fgtsForm.controls.contractEnd.setErrors(null);
    }

    const currentForm = this.activeTab() === 'fgts' 
      ? this.fgtsForm 
      : this.activeTab() === 'ferias' 
        ? this.feriasForm 
        : this.rescisaoForm;


    if (this.activeTab() === 'fgts') {
      const fgtsParams = buildFgtsParams(this.fgtsForm);
      if (fgtsParams === null) {
        this.fgtsForm.controls.contractEnd.setErrors({ dateRange: true });
        this.fgtsForm.controls.contractEnd.markAsTouched();
        return;
      }
      const fgtsResult = this.calculadoraService.fgts(fgtsParams);
      this.fgtsResult.set(toFgtsResultSection(fgtsResult));
      this.fgtsRawResult.set(fgtsResult);
    } 
    
    else if (this.activeTab() === 'ferias') {
      const feriasParams = buildFeriasParams(this.feriasForm);

      if (feriasParams === null) {
        console.error('FALHA NA CONVERSÃO DOS DADOS DE FÉRIAS. Verifique o console.');
        return;
      }

      const feriasResult = this.calculadoraService.ferias(feriasParams);

      this.feriasResult.set(toFeriasResultSection(feriasResult));
      this.feriasRawResult.set(feriasResult);
    }

    else if (this.activeTab() === 'rescisao') {
      const rescisaoParams = buildRescisaoParams(this.rescisaoForm);
      if (rescisaoParams === null) {return;}

      const rescisaoResult = this.calculadoraService.rescisao(rescisaoParams);
      this.rescisaoResult.set(toRescisaoResultSection(rescisaoResult));
      this.rescisaoRawResult.set(rescisaoResult);
    }
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

function buildFeriasParams(form: FormGroup<FeriasControls>): FeriasCalculationParams | null {

  const monthlySalary = parseBRLCurrency(form.controls.monthlySalary.value);
  const acquisitionPeriodStart = parseInputDate(form.controls.acquisitionPeriodStart.value);
  const acquisitionPeriodEnd = parseInputDate(form.controls.acquisitionPeriodEnd.value);
  const vacationStart = parseInputDate(form.controls.vacationStart.value);
  const vacationEnd = parseInputDate(form.controls.vacationEnd.value);
  

  if (!monthlySalary || !acquisitionPeriodStart || !acquisitionPeriodEnd || !vacationStart || !vacationEnd) {
    return null;
  }

  return {
    acquisitionPeriodStart,
    acquisitionPeriodEnd,
    vacationStart,
    vacationEnd,
    monthlySalary,
    absences: form.controls.absences.value,
    overtimeAverage: parseBRLCurrency(form.controls.overtimeAverage.value || '0'),
    nightShiftAverage: parseBRLCurrency(form.controls.nightShiftAverage.value || '0'),
    commissionAverage: parseBRLCurrency(form.controls.commissionAverage.value || '0'),
    dependents: form.controls.dependents.value,
    soldDays: form.controls.soldDays.value,
  };
}

function parseBRLCurrency(value: string | number): number {
  // Se já for número, retorna ele mesmo
  if (typeof value === 'number') return value;
  if (!value) return 0;
  
  const normalizedValue = String(value)
    .replace(/\s/g, '')
    .replace('R$', '')
    .replace(/\./g, '')
    .replace(',', '.');
    
  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function parseInputDate(value: string | Date | null): Date | null {
  if (!value) return null;
  
  // Se o componente já retornou um objeto Date, apenas valida
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  // Se for string, tenta parsear (suporta YYYY-MM-DD ou DD/MM/YYYY)
  if (typeof value === 'string') {
    if (value.includes('-')) {
      const [yearText, monthText, dayText] = value.split('-');
      const parsed = new Date(Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText)));
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    if (value.includes('/')) {
      const [dayText, monthText, yearText] = value.split('/');
      const parsed = new Date(Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText)));
      return isNaN(parsed.getTime()) ? null : parsed;
    }
  }
  
  return null;
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

function toFeriasResultSection(result: FeriasCalculationResult): CalculationResultSection {
  let note = 'Este é um cálculo estimado. Descontos de IRRF não foram considerados por dependerem da média dos últimos 12 meses e outras variáveis específicas.';
  
  if (result.entitledDays === 0) {
    note = '⚠️ Atenção: O colaborador perdeu o direito às férias devido ao excesso de faltas injustificadas (mais de 32 dias no período aquisitivo).';
  } else if (result.entitledDays < 30) {
    note = `⚠️ Atenção: Devido ao número de faltas injustificadas, o período de férias foi reduzido para ${result.entitledDays} dias conforme Art. 130 da CLT.`;
  }

  return {
    title: 'Resultado Férias',
    rows: [
      { label: 'Dias de férias solicitados', value: `${result.vacationDays} dias` },
      { label: 'Dias vendidos (Abono Pecuniário)', value: `${result.soldDays} dias` },
      { label: 'Salário-base para cálculo', value: formatCurrencyBRL(result.baseSalary) },
      { label: 'Valor bruto das férias', value: formatCurrencyBRL(result.vacationValue) },
      { label: '1/3 Constitucional (Férias)', value: formatCurrencyBRL(result.oneThirdVacation) },
      { label: 'Valor bruto do Abono', value: formatCurrencyBRL(result.abonoValue) },
      { label: '1/3 Constitucional (Abono)', value: formatCurrencyBRL(result.oneThirdAbono) },
      { label: 'Desconto INSS (sobre férias)', value: `- ${formatCurrencyBRL(result.inssDiscount)}` },
      { label: 'Total Líquido Estimado', value: formatCurrencyBRL(result.totalNet), emphasize: true },
    ],
    note,
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

function buildRescisaoParams(form: FormGroup<RescisaoControls>): RescisaoCalculationParams | null {
  const raw = form.getRawValue();

  const lastSalary = parseBRLCurrency(raw.lastSalary);
  const admissionDate = parseInputDate(raw.admissionDate);
  const lastServiceDate = parseInputDate(raw.lastServiceDate);

  if (!lastSalary || lastSalary <= 0 || !admissionDate || !lastServiceDate) {
    return null;
  }

  return {
    admissionDate,
    lastServiceDate,
    dismissalReason: raw.dismissalReason as any,
    lastSalary,
    noticeType: raw.noticeType as any,
    vacationDue: raw.vacationDue === 'sim',
  };
}

function toRescisaoResultSection(result: RescisaoCalculationResult): CalculationResultSection {
  return {
    title: 'Resultado da Rescisão',
    rows: [
      { label: 'Dias trabalhados no último mês', value: `${result.workedDays} dias` },
      { label: 'Saldo de salário', value: formatCurrencyBRL(result.salaryBalance) },
      { label: 'Aviso prévio', value: `${result.noticePeriodDays} dias - ${formatCurrencyBRL(result.noticePeriodValue)}` },
      { label: 'Férias vencidas', value: formatCurrencyBRL(result.vacationExpired) },
      { label: '1/3 Férias vencidas', value: formatCurrencyBRL(result.vacationExpiredThird) },
      { label: 'Férias proporcionais', value: formatCurrencyBRL(result.vacationProportional) },
      { label: '1/3 Férias proporcionais', value: formatCurrencyBRL(result.vacationProportionalThird) },
      { label: '13º proporcional bruto', value: `${formatCurrencyBRL(result.thirteenthProportional)} (${result.thirteenthReferenceMonths}/12 avos)` },
      { label: 'INSS sobre o 13º', value: `- ${formatCurrencyBRL(result.thirteenthINSS)}` },
      { label: 'IRRF sobre o 13º', value: `- ${formatCurrencyBRL(result.thirteenthIRRF)}` },
      { label: '13º líquido na rescisão', value: formatCurrencyBRL(result.thirteenthNet) },
      { label: 'Referência da 1ª parcela do 13º', value: formatCurrencyBRL(result.thirteenthFirstInstallment) },
      { label: 'Referência da 2ª parcela do 13º', value: formatCurrencyBRL(result.thirteenthSecondInstallment) },
      { label: 'Multa FGTS (40%)', value: formatCurrencyBRL(result.fgtsFine) },
      { label: 'Desconto INSS', value: `- ${formatCurrencyBRL(result.inssDiscount)}` },
      { label: 'Total líquido estimado', value: formatCurrencyBRL(result.totalNet), emphasize: true },
    ],
    note: `Motivo: ${result.dismissalReason}. A 1ª e a 2ª parcela são referências da composição anual; o 13º líquido acima representa a quitação na rescisão, já com os descontos de INSS e IRRF estimados. Este é um cálculo aproximado. Para uma análise mais detalhada, fale com nossos especialistas.`,
  };
}


