import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbacksService } from 'src/app/services/FeedbackService/feedbacks.service';

@Component({
  selector: 'app-feedbacks-chart',
  templateUrl: './feedbacks-chart.component.html',
  styleUrls: ['./feedbacks-chart.component.css']
})
export class FeedbacksChartComponent implements OnInit {
  data: any;
  options: any;

  constructor(private feedbackService: FeedbacksService,private router: Router) {}

  ngOnInit() {
    this.loadChartData();
  }

  loadChartData() {
    this.feedbackService.getAllFeedbacks().subscribe((feedbacks: any[]) => {
      const reactCount: { [key: string]: number } = {};

      feedbacks.forEach(fb => {
        fb.reacts?.forEach((react: any) => {
          const reaction = react.reaction || 'Autre';
          reactCount[reaction] = (reactCount[reaction] || 0) + 1;
        });
      });

      const labels = Object.keys(reactCount);
      const values = Object.values(reactCount);

      this.data = {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: this.generateColors(labels.length),
            hoverBackgroundColor: this.generateColors(labels.length, true)
          }
        ]
      };

      this.options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Répartition des Réactions sur les Feedbacks'
          }
        }
      };
    });
  }

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