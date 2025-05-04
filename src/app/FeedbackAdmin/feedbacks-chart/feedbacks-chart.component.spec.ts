import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbacksChartComponent } from './feedbacks-chart.component';

describe('FeedbacksChartComponent', () => {
  let component: FeedbacksChartComponent;
  let fixture: ComponentFixture<FeedbacksChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbacksChartComponent]
    });
    fixture = TestBed.createComponent(FeedbacksChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
