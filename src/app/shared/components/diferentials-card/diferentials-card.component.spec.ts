import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiferentialsCardComponent } from './diferentials-card.component';

describe('DiferentialsCardComponent', () => {
  let component: DiferentialsCardComponent;
  let fixture: ComponentFixture<DiferentialsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiferentialsCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DiferentialsCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
