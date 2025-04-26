import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationSmsComponent } from './verification-sms.component';

describe('VerificationSmsComponent', () => {
  let component: VerificationSmsComponent;
  let fixture: ComponentFixture<VerificationSmsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerificationSmsComponent]
    });
    fixture = TestBed.createComponent(VerificationSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
