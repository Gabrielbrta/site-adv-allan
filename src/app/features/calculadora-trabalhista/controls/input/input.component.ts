import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextInputId = 0;

@Component({
  selector: 'app-input',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  host: {
    class: 'calc-field',
  },
})
export class InputComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly placeholder = input('');
  readonly type = input<'text' | 'number' | 'email' | 'tel' | 'search'>('text');
  readonly hint = input('');
  readonly inputMode = input<'text' | 'decimal' | 'numeric' | 'tel' | 'email' | 'search'>('text');
  readonly min = input<string | number | null>(null);
  readonly max = input<string | number | null>(null);
  readonly step = input<string | number | null>(null);
  readonly autocomplete = input('off');
  readonly disabled = signal(false);
  readonly value = signal('');
  readonly invalid = input(false);
  readonly errorText = input('');
  readonly required = input<boolean>(false);

  private readonly fallbackId = `calc-input-${nextInputId++}`;
  readonly inputId = computed(() => this.fallbackId);
  readonly describedById = computed(() => {
    const ids: string[] = [];

    if (this.hint()) {
      ids.push(`${this.inputId()}-hint`);
    }

    if (this.invalid() && this.errorText()) {
      ids.push(`${this.inputId()}-error`);
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

  handleInput(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).value;
    this.value.set(nextValue);
    this.onChange(nextValue);
  }

  handleBlur(): void {
    this.onTouched();
  }
}