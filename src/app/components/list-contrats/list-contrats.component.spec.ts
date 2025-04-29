import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListContratsComponent } from './list-contrats.component';

describe('ListContratsComponent', () => {
  let component: ListContratsComponent;
  let fixture: ComponentFixture<ListContratsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListContratsComponent]
    });
    fixture = TestBed.createComponent(ListContratsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
