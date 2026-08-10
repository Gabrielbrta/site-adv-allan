import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaCalculoComponent } from './cta-calculo.component';

describe('CtaCalculoComponent', () => {
  let component: CtaCalculoComponent;
  let fixture: ComponentFixture<CtaCalculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtaCalculoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CtaCalculoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
