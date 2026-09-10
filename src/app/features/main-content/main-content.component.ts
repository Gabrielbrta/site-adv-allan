import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { HeroComponent } from "./hero/hero.component";
import { AboutComponent } from "./about/about.component";
import { DiferentialsComponent } from "./diferentials/diferentials.component";
import { CtaCalculoComponent } from "./cta-calculo/cta-calculo.component";
import { CtaWhatsappComponent } from "./cta-whatsapp/cta-whatsapp.component";
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-main-content',
  imports: [HeroComponent, AboutComponent, DiferentialsComponent, CtaCalculoComponent, CtaWhatsappComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent implements AfterViewInit, OnDestroy {
  private scrollTimeout?: ReturnType<typeof setTimeout>;
  private removeScrollListener?: () => void;
  private removeTouchStartListener?: () => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const handleScroll = () => {
      this.handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleScroll, { passive: true });

    this.removeScrollListener = () => {
      window.removeEventListener('scroll', handleScroll);
    };
    this.removeTouchStartListener = () => {
      window.removeEventListener('touchstart', handleScroll);
    };

    this.handleScroll();
  }

  ngOnDestroy(): void {
    clearTimeout(this.scrollTimeout);
    this.removeScrollListener?.();
    this.removeTouchStartListener?.();
  }

  private handleScroll(): void {
    clearTimeout(this.scrollTimeout);

    this.scrollTimeout = setTimeout(() => {

      const triggerPosition = window.innerHeight * 0.7;

      const sections = document.querySelectorAll<HTMLElement>('[data-slide="true"]');

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const visibleBefore70Percent =
          rect.top < triggerPosition && rect.bottom > 0;

        if (visibleBefore70Percent) {
          section.classList.add('slide');
        }
      });

      if (sections.length > 0 && Array.from(sections).every((section) =>
        section.classList.contains('slide')
      )) {
        this.removeScrollListener?.();
        this.removeScrollListener = undefined;
        this.removeTouchStartListener?.();
        this.removeTouchStartListener = undefined;
      }
    }, 250);
  }
}
