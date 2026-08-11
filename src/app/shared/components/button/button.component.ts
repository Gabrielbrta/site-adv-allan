import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-button',
  imports: [RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {

  routerLink = input<string>('');
  icon = input<string>('');
  alt = input<string>('');
  text = input.required<string>();
  href = input<string>('');
  style = input<'white' | 'green' | 'black' | 'yellow'>('white');
}
