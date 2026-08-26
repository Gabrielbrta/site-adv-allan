import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextDateId = 0;

@Component({
  selector: 'app-input-date',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true,
    },
  ],
  templateUrl: './input-date.component.html',
  styleUrl: './input-date.component.scss',
  host: {
    class: 'calc-field',
  },
})
export class InputDateComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly hint = input('');
  readonly min = input<string | null>(null);
  readonly max = input<string | null>(null);
  readonly disabled = signal(false);
  readonly value = signal('');
  readonly invalid = input(false);
  readonly errorText = input('');
  readonly required = input<boolean>(false);
  private readonly fallbackId = `calc-date-${nextDateId++}`;
  readonly dateId = computed(() => this.fallbackId);
  readonly describedById = computed(() => {
    const ids: string[] = [];

    if (this.hint()) {
      ids.push(`${this.dateId()}-hint`);
    }

    if (this.invalid() && this.errorText()) {
      ids.push(`${this.dateId()}-error`);
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