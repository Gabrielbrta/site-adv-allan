import { Component } from '@angular/core';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { HeroComponent } from "./hero/hero.component";
import { AboutComponent } from "./about/about.component";

@Component({
  selector: 'app-main-content',
  imports: [HeroComponent, AboutComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {}
