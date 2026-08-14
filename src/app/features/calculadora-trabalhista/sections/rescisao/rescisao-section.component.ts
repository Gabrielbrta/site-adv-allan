import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputDateComponent } from '../../controls/input-date/input-date.component';
import { InputComponent } from '../../controls/input/input.component';
import { InputSelectComponent } from '../../controls/input-select/input-select.component';
import { RescisaoControls } from '../../calculadora-trabalhista.models';

@Component({
  selector: 'app-rescisao-section',
  imports: [ReactiveFormsModule, InputComponent, InputSelectComponent, InputDateComponent],
  templateUrl: './rescisao-section.component.html',
  styleUrl: './rescisao-section.component.scss',
})
export class RescisaoSectionComponent {
  readonly form = input.required<FormGroup<RescisaoControls>>();

  readonly situationOptions = [
    { label: 'Não, já saiu', value: 'nao_ja_saiu' },
    { label: 'Ainda está ativo', value: 'ativo' },
  ] as const;

  readonly dismissalReasonOptions = [
    { label: 'Sem justa causa', value: 'sem_justa_causa' },
    { label: 'Com justa causa', value: 'com_justa_causa' },
    { label: 'Pedido de demissão', value: 'pedido_demissao' },
    { label: 'Rescisão indireta', value: 'resc_indireta' },
  ] as const;

  readonly noticeOptions = [
    { label: 'Indenizado', value: 'indenizado' },
    { label: 'Trabalhado', value: 'trabalhado' },
    { label: 'Dispensado', value: 'dispensado' },
  ] as const;

  readonly vacationDueOptions = [
    { label: 'Sim', value: 'sim' },
    { label: 'Não', value: 'nao' },
  ] as const;
}