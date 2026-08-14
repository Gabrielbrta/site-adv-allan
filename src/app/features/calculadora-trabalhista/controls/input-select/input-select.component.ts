import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from '../../calculadora-trabalhista.models';

let nextSelectId = 0;

@Component({
  selector: 'app-input-select',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectComponent),
      multi: true,
    },
  ],
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.scss',
  host: {
    class: 'calc-field',
  },
})
export class InputSelectComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly placeholder = input('Selecione');
  readonly options = input<readonly SelectOption[]>([]);
  readonly hint = input('');
  readonly disabled = signal(false);
  readonly value = signal('');
  readonly invalid = input(false);
  readonly errorText = input('');

  private readonly fallbackId = `calc-select-${nextSelectId++}`;
  readonly selectId = computed(() => this.fallbackId);
  readonly describedById = computed(() => {
    const ids: string[] = [];

    if (this.hint()) {
      ids.push(`${this.selectId()}-hint`);
    }

    if (this.invalid() && this.errorText()) {
      ids.push(`${this.selectId()}-error`);
    }

    return ids.length > 0 ? ids.join(' ') : null;
  });

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | number | null): void {
    this.value.set(value === null || value === undefined ? '' : String(value));
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleChange(event: Event): void {
    const nextValue = (event.target as HTMLSelectElement).value;
    this.value.set(nextValue);
    this.onChange(nextValue);
  }

  handleBlur(): void {
    this.onTouched();
  }
}