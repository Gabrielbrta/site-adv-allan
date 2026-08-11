import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAtuacaoComponent } from './card-atuacao.component';

describe('CardAtuacaoComponent', () => {
  let component: CardAtuacaoComponent;
  let fixture: ComponentFixture<CardAtuacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAtuacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardAtuacaoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
