import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiferentialsComponent } from './diferentials.component';

describe('DiferentialsComponent', () => {
  let component: DiferentialsComponent;
  let fixture: ComponentFixture<DiferentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiferentialsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DiferentialsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
