import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeedbackAdminComponent } from './add-feedback-admin.component';

describe('AddFeedbackAdminComponent', () => {
  let component: AddFeedbackAdminComponent;
  let fixture: ComponentFixture<AddFeedbackAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFeedbackAdminComponent]
    });
    fixture = TestBed.createComponent(AddFeedbackAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
