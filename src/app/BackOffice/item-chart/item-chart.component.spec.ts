import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemChartComponent } from './item-chart.component';

describe('ItemChartComponent', () => {
  let component: ItemChartComponent;
  let fixture: ComponentFixture<ItemChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemChartComponent]
    });
    fixture = TestBed.createComponent(ItemChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
