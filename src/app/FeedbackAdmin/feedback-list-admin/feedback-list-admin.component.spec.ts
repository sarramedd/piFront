import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackListAdminComponent } from './feedback-list-admin.component';

describe('FeedbackListAdminComponent', () => {
  let component: FeedbackListAdminComponent;
  let fixture: ComponentFixture<FeedbackListAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackListAdminComponent]
    });
    fixture = TestBed.createComponent(FeedbackListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
