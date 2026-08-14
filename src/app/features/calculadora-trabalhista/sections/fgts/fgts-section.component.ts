import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputDateComponent } from '../../controls/input-date/input-date.component';
import { InputComponent } from '../../controls/input/input.component';
import { FgtsControls } from '../../calculadora-trabalhista.models';

@Component({
  selector: 'app-fgts-section',
  imports: [ReactiveFormsModule, InputComponent, InputDateComponent],
  templateUrl: './fgts-section.component.html',
  styleUrl: './fgts-section.component.scss',
})
export class FgtsSectionComponent {
  readonly form = input.required<FormGroup<FgtsControls>>();
}