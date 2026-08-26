import { TestBed } from '@angular/core/testing';

import { CalculadoraTrabalhistaService } from './calculadora-trabalhista.service';

describe('CalculadoraTrabalhistaService', () => {
  let service: CalculadoraTrabalhistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculadoraTrabalhistaService);
  });

  it('should calculate FGTS deposit, penalty and total', () => {
    const result = service.fgts({
      salaryBase: 4000,
      contractStart: new Date(Date.UTC(2026, 0, 1)),
      contractEnd: new Date(Date.UTC(2026, 0, 30)),
    });

    expect(result.referenceMonths).toBe(1);
    expect(result.depositAmount).toBe(320);
    expect(result.penaltyAmount).toBe(128);
    expect(result.totalAmount).toBe(448);
  });

  it('should keep two decimal places for proportional periods', () => {
    const result = service.fgts({
      salaryBase: 3500,
      contractStart: new Date(Date.UTC(2026, 0, 1)),
      contractEnd: new Date(Date.UTC(2026, 0, 15)),
    });

    expect(result.referenceMonths).toBe(0.5);
    expect(result.depositAmount).toBe(140);
    expect(result.penaltyAmount).toBe(56);
    expect(result.totalAmount).toBe(196);
  });
});
