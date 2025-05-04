import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyseChartComponent } from './analyse-chart.component';

describe('AnalyseChartComponent', () => {
  let component: AnalyseChartComponent;
  let fixture: ComponentFixture<AnalyseChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyseChartComponent]
    });
    fixture = TestBed.createComponent(AnalyseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
