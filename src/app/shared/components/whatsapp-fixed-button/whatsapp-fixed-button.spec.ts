import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappFixedButton } from './whatsapp-fixed-button';

describe('WhatsappFixedButton', () => {
  let component: WhatsappFixedButton;
  let fixture: ComponentFixture<WhatsappFixedButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappFixedButton],
    }).compileComponents();

    fixture = TestBed.createComponent(WhatsappFixedButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
