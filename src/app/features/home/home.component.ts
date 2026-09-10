import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { WhatsappFixedButton } from "../../shared/components/whatsapp-fixed-button/whatsapp-fixed-button";

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, RouterOutlet, WhatsappFixedButton],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
