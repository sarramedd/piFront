import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemFrontComponent } from './add-item-front.component';

describe('AddItemFrontComponent', () => {
  let component: AddItemFrontComponent;
  let fixture: ComponentFixture<AddItemFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddItemFrontComponent]
    });
    fixture = TestBed.createComponent(AddItemFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
