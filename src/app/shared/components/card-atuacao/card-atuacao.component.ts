import { Component, input } from '@angular/core';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-card-atuacao',
  imports: [ButtonComponent],
  templateUrl: './card-atuacao.component.html',
  styleUrl: './card-atuacao.component.scss',
})
export class CardAtuacaoComponent {
  side = input.required<'left' | 'right'>();
  img = input.required<string>();
  alt = input.required<string>();
  link = input.required<string>();
}
