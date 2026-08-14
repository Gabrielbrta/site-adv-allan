import { Component, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CalculadoraTabDefinition,
  CalculadoraTabId,
  FeriasControls,
  FgtsControls,
  RescisaoControls,
} from './calculadora-trabalhista.models';
import { FeriasSectionComponent } from './sections/ferias/ferias-section.component';
import { FgtsSectionComponent } from './sections/fgts/fgts-section.component';
import { RescisaoSectionComponent } from './sections/rescisao/rescisao-section.component';

@Component({
  selector: 'app-calculadora-trabalhista',
  imports: [ReactiveFormsModule, FgtsSectionComponent, FeriasSectionComponent, RescisaoSectionComponent],
  templateUrl: './calculadora-trabalhista.component.html',
  styleUrl: './calculadora-trabalhista.component.scss',
})
export class CalculadoraTrabalhistaComponent {
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

  readonly formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  readonly completion = computed(() => {
    const progress = countProgress(this.formValue());

    return {
      filled: progress.filled,
      total: progress.total,
      percent: progress.total === 0 ? 0 : Math.round((progress.filled / progress.total) * 100),
    };
  });

  readonly currentTab = computed(() => this.tabs.find((tab) => tab.id === this.activeTab()) ?? this.tabs[0]);

  setTab(tab: CalculadoraTabId): void {
    this.activeTab.set(tab);
    this.form.reset();
    this.syncActiveGroup(tab);
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.activeTab.set(findFirstInvalidTab(this.fgtsForm, this.feriasForm, this.rescisaoForm));
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
