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

  it('should calculate 13th salary avos only for the termination year', () => {
    const result = service.rescisao({
      admissionDate: new Date(Date.UTC(2024, 5, 1)),
      lastServiceDate: new Date(Date.UTC(2026, 4, 15)),
      dismissalReason: 'sem_justa_causa',
      lastSalary: 3000,
      noticeType: 'dispensado',
      vacationDue: false,
    });

    expect(result.thirteenthReferenceMonths).toBe(5);
    expect(result.thirteenthProportional).toBe(1250);
    expect(result.thirteenthFirstInstallment).toBe(625);
    expect(result.thirteenthINSS).toBe(93.75);
    expect(result.thirteenthSecondInstallment).toBe(531.25);
    expect(result.thirteenthNet).toBe(1156.25);
  });

  it('should not count the month when fewer than 15 days were worked', () => {
    const result = service.rescisao({
      admissionDate: new Date(Date.UTC(2026, 0, 1)),
      lastServiceDate: new Date(Date.UTC(2026, 0, 14)),
      dismissalReason: 'sem_justa_causa',
      lastSalary: 3000,
      noticeType: 'dispensado',
      vacationDue: false,
    });

    expect(result.thirteenthReferenceMonths).toBe(0);
    expect(result.thirteenthProportional).toBe(0);
  });

  it('should count the month when 15 days were worked', () => {
    const result = service.rescisao({
      admissionDate: new Date(Date.UTC(2026, 0, 1)),
      lastServiceDate: new Date(Date.UTC(2026, 0, 15)),
      dismissalReason: 'sem_justa_causa',
      lastSalary: 3000,
      noticeType: 'dispensado',
      vacationDue: false,
    });

    expect(result.thirteenthReferenceMonths).toBe(1);
    expect(result.thirteenthProportional).toBe(250);
  });

  it('should include a projected month from an indemnified notice', () => {
    const result = service.rescisao({
      admissionDate: new Date(Date.UTC(2026, 0, 1)),
      lastServiceDate: new Date(Date.UTC(2026, 0, 1)),
      dismissalReason: 'sem_justa_causa',
      lastSalary: 3000,
      noticeType: 'indenizado',
      vacationDue: false,
    });

    expect(result.thirteenthReferenceMonths).toBe(2);
    expect(result.thirteenthProportional).toBe(500);
  });

  it('should not calculate a 13th salary for just cause', () => {
    const result = service.rescisao({
      admissionDate: new Date(Date.UTC(2026, 0, 1)),
      lastServiceDate: new Date(Date.UTC(2026, 5, 30)),
      dismissalReason: 'com_justa_causa',
      lastSalary: 3000,
      noticeType: 'dispensado',
      vacationDue: false,
    });

    expect(result.thirteenthReferenceMonths).toBe(0);
    expect(result.thirteenthProportional).toBe(0);
    expect(result.thirteenthINSS).toBe(0);
  });
});
