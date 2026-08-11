import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasDeAtuacaoComponent } from './areas-de-atuacao.component';

describe('AreasDeAtuacaoComponent', () => {
  let component: AreasDeAtuacaoComponent;
  let fixture: ComponentFixture<AreasDeAtuacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreasDeAtuacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AreasDeAtuacaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
