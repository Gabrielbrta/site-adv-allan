import { Component, input } from '@angular/core';
import {
  CalculationResultRow,
  CalculationResultSection,
} from '../../calculadora-trabalhista.models';

@Component({
  selector: 'app-calculation-result',
  imports: [],
  templateUrl: './calculation-result.component.html',
  styleUrl: './calculation-result.component.scss',
})
export class CalculationResultComponent {
  readonly section = input.required<CalculationResultSection>();
  readonly rowTrack = (_index: number, row: CalculationResultRow) => row.label;
}
