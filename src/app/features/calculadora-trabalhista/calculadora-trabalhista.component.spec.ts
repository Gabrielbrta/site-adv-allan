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

  it('should calculate FGTS result when the active tab is valid', () => {
    component.fgtsForm.setValue({
      salaryBase: 'R$ 4.500,00',
      contractStart: '2024-01-01',
      contractEnd: '2024-12-31',
      rescisaoType: 'sem_justa_causa',
    });

    component.submit();

    expect(component.fgtsResult()).not.toBeNull();
    expect(component.fgtsResult()?.title).toBe('Resultado FGTS');
    expect(component.fgtsResult()?.rows.length).toBe(3);
  });

  it('should not calculate FGTS when contract end is before contract start', () => {
    component.fgtsForm.setValue({
      salaryBase: 'R$ 4.500,00',
      contractStart: '2024-12-31',
      contractEnd: '2024-01-01',
      rescisaoType: 'sem_justa_causa',
    });

    component.submit();

    expect(component.fgtsResult()).toBeNull();
    expect(component.fgtsForm.controls.contractEnd.hasError('dateRange')).toBe(true);
  });
});
