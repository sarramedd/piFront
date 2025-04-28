import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbacksService } from 'src/app/services/FeedbackService/feedbacks.service';

@Component({
  selector: 'app-feedbacks-chart',
  templateUrl: './feedbacks-chart.component.html',
  styleUrls: ['./feedbacks-chart.component.css',
    '../../../assets/bootstrap-template/css/style.css',
    '../../../assets/bootstrap-template/vendors/mdi/css/materialdesignicons.min.css',
    '../../../assets/bootstrap-template/vendors/font-awesome/css/font-awesome.min.css',
    '../../../assets/bootstrap-template/vendors/css/vendor.bundle.base.css'
  ],
    encapsulation: ViewEncapsulation.None
  
  
})

export class FeedbacksChartComponent implements OnInit {
  // Chart data for different types
  pieChartData: any;
  barChartData: any;
  lineChartData: any;
  doughnutChartData: any;
  polarAreaChartData: any;
  radarChartData: any;
  
  // Chart options
  chartOptions: any;
  
  // Selected chart type
  selectedChartType: string = 'pie';

  constructor(private feedbackService: FeedbacksService, private router: Router) {}

  ngOnInit() {
    this.loadChartData();
  }

  loadChartData() {
    this.feedbackService.getAllFeedbacks().subscribe((feedbacks: any[]) => {
      console.log('Feedbacks récupérés:', feedbacks);
      const reactCount: { [key: string]: number } = {};

      feedbacks.forEach(fb => {
        fb.reacts?.forEach((react: any) => {
          const reaction = react.reaction || 'Autre';
          reactCount[reaction] = (reactCount[reaction] || 0) + 1;
        });
      });

      const labels = Object.keys(reactCount);
      const values = Object.values(reactCount);

      // Common chart options
      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Add this to allow custom sizing
        plugins: {
          legend: {
            position: 'right', // Moves legend to the right to save vertical space
            labels: {
              boxWidth: 12,
              padding: 10
            }
          },
          title: {
            display: true,
            text: 'Répartition des Réactions sur les Feedbacks',
            padding: {
              top: 10,
              bottom: 10
            }
          }
        }
      };

      // Pie Chart Data
      this.pieChartData = {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: this.generateColors(labels.length),
            hoverBackgroundColor: this.generateColors(labels.length, true)
          }
        ]
      };

      // Bar Chart Data
      this.barChartData = {
        labels,
        datasets: [
          {
            label: 'Nombre de réactions',
            data: values,
            backgroundColor: this.generateColors(labels.length),
            borderColor: this.generateColors(labels.length),
            borderWidth: 1
          }
        ]
      };

      // Line Chart Data
      this.lineChartData = {
        labels,
        datasets: [
          {
            label: 'Trend des réactions',
            data: values,
            fill: false,
            borderColor: '#42A5F5',
            tension: 0.4
          }
        ]
      };

      // Doughnut Chart Data (same as pie but with cutout)
      this.doughnutChartData = {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: this.generateColors(labels.length),
            hoverBackgroundColor: this.generateColors(labels.length, true)
          }
        ]
      };

      // Polar Area Chart Data
      this.polarAreaChartData = {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: this.generateColors(labels.length),
            hoverBackgroundColor: this.generateColors(labels.length, true)
          }
        ]
      };

      // Radar Chart Data
      this.radarChartData = {
        labels,
        datasets: [
          {
            label: 'Réactions par type',
            data: values,
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: this.generateColors(labels.length),
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)'
          }
        ]
      };
    });
  }

  // Change chart type
  changeChartType(type: string) {
    this.selectedChartType = type;
  }

  // Generate colors (keep your existing method)
  generateColors(length: number, lighter = false): string[] {
    const baseColors = ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A', '#BA68C8', '#FF7043'];
    return Array.from({ length }, (_, i) =>
      lighter
        ? this.lightenColor(baseColors[i % baseColors.length], 40)
        : baseColors[i % baseColors.length]
    );
  }

  lightenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (
      0x1000000 +
      (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
  }

  goToReportedFeedbacks() {
    this.router.navigate(['/dashboard/reported-Feedbacks']);
  }
}