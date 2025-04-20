import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayItemsFrontComponent } from './display-items-front.component';

describe('DisplayItemsFrontComponent', () => {
  let component: DisplayItemsFrontComponent;
  let fixture: ComponentFixture<DisplayItemsFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayItemsFrontComponent]
    });
    fixture = TestBed.createComponent(DisplayItemsFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
