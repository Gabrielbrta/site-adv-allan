import { Component, input } from '@angular/core';

@Component({
  selector: 'app-diferentials-card',
  imports: [],
  templateUrl: './diferentials-card.component.html',
  styleUrl: './diferentials-card.component.scss',
})
export class DiferentialsCardComponent {
  icon = input.required<string>();
  alt = input<string>();
  title = input.required<string>();
  description = input.required<string>();

}
