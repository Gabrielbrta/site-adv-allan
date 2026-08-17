import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadoraTrabalhistaComponent } from './calculadora-trabalhista.component';

describe('CalculadoraTrabalhistaComponent', () => {
  let component: CalculadoraTrabalhistaComponent;
  let fixture: ComponentFixture<CalculadoraTrabalhistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculadoraTrabalhistaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculadoraTrabalhistaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
