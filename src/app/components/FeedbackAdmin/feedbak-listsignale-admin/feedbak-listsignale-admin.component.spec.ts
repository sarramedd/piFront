import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbakListsignaleAdminComponent } from './feedbak-listsignale-admin.component';

describe('FeedbakListsignaleAdminComponent', () => {
  let component: FeedbakListsignaleAdminComponent;
  let fixture: ComponentFixture<FeedbakListsignaleAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbakListsignaleAdminComponent]
    });
    fixture = TestBed.createComponent(FeedbakListsignaleAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
