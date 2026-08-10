import { Component } from '@angular/core';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { HeroComponent } from "./hero/hero.component";
import { AboutComponent } from "./about/about.component";
import { DiferentialsComponent } from "./diferentials/diferentials.component";
import { CtaCalculoComponent } from "./cta-calculo/cta-calculo.component";
import { CtaWhatsappComponent } from "./cta-whatsapp/cta-whatsapp.component";

@Component({
  selector: 'app-main-content',
  imports: [HeroComponent, AboutComponent, DiferentialsComponent, CtaCalculoComponent, CtaWhatsappComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {}
