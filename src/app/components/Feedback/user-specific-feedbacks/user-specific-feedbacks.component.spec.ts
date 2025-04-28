import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSpecificFeedbacksComponent } from './user-specific-feedbacks.component';

describe('UserSpecificFeedbacksComponent', () => {
  let component: UserSpecificFeedbacksComponent;
  let fixture: ComponentFixture<UserSpecificFeedbacksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSpecificFeedbacksComponent]
    });
    fixture = TestBed.createComponent(UserSpecificFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
