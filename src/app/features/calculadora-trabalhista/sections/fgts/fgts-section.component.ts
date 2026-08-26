import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputDateComponent } from '../../controls/input-date/input-date.component';
import { InputComponent } from '../../controls/input/input.component';
import { FgtsControls } from '../../calculadora-trabalhista.models';
import { InputSelectComponent } from '../../controls/input-select/input-select.component';

@Component({
  selector: 'app-fgts-section',
  imports: [ReactiveFormsModule, InputComponent, InputDateComponent, InputSelectComponent],
  templateUrl: './fgts-section.component.html',
  styleUrl: './fgts-section.component.scss',
})
export class FgtsSectionComponent {
  readonly form = input.required<FormGroup<FgtsControls>>();
  readonly rescisaoTypeOptions = [
  { value: 'sem_justa_causa', label: 'Dispensa sem justa causa (40%)' },
  { value: 'justa_causa', label: 'Justa causa (0%)' },
  { value: 'pedido_demissao', label: 'Pedido de demissão (0%)' },
  { value: 'acordo', label: 'Acordo trabalhista (20%)' },
  { value: 'rescisao_indireta', label: 'Rescisão indireta (40%)' },
];
}