import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaWhatsappComponent } from './cta-whatsapp.component';

describe('CtaWhatsappComponent', () => {
  let component: CtaWhatsappComponent;
  let fixture: ComponentFixture<CtaWhatsappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtaWhatsappComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CtaWhatsappComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
