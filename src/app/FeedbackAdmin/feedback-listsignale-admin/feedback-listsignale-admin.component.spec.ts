import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackListsignaleAdminComponent } from './feedback-listsignale-admin.component';

describe('FeedbackListsignaleAdminComponent', () => {
  let component: FeedbackListsignaleAdminComponent;
  let fixture: ComponentFixture<FeedbackListsignaleAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackListsignaleAdminComponent]
    });
    fixture = TestBed.createComponent(FeedbackListsignaleAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
