import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputDateComponent } from '../../controls/input-date/input-date.component';
import { InputComponent } from '../../controls/input/input.component';
import { InputSelectComponent } from '../../controls/input-select/input-select.component';
import { FeriasControls } from '../../calculadora-trabalhista.models';

@Component({
  selector: 'app-ferias-section',
  imports: [ReactiveFormsModule, InputComponent, InputSelectComponent, InputDateComponent],
  templateUrl: './ferias-section.component.html',
  styleUrl: './ferias-section.component.scss',
})
export class FeriasSectionComponent {
  readonly form = input.required<FormGroup<FeriasControls>>();

}