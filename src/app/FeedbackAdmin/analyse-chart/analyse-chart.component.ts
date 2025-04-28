import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbacksService } from 'src/app/services/FeedbackService/feedbacks.service';

@Component({
  selector: 'app-analyse-chart',
  templateUrl: './analyse-chart.component.html',
  styleUrls: [
    './analyse-chart.component.css',
    '../../../assets/bootstrap-template/css/style.css',
    '../../../assets/bootstrap-template/vendors/mdi/css/materialdesignicons.min.css',
    '../../../assets/bootstrap-template/vendors/font-awesome/css/font-awesome.min.css',
    '../../../assets/bootstrap-template/vendors/css/vendor.bundle.base.css'
  ]
})
export class AnalyseChartComponent implements OnInit {
  // Chart data
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
  
  // Sentiment analysis text
  sentimentAnalysis: string = 'Chargement des données...';
  totalFeedbacks: number = 0;
  positivePercentage: number = 0;
  neutralPercentage: number = 0;
  negativePercentage: number = 0;

  constructor(private feedbackService: FeedbacksService, private router: Router) {}

  ngOnInit() {
    this.loadChartData();
  }

  loadChartData() {
    this.feedbackService.getAllFeedbacks().subscribe((feedbacks: any[]) => {
      const sentimentCount = {
        'Positifs': 0,
        'Neutres': 0,
        'Négatifs': 0
      };

      feedbacks.forEach(fb => {
        const sentimentScore = fb.sentimentScore;
        if (sentimentScore !== null && sentimentScore !== undefined) {
          if (sentimentScore > 0.6) {
            sentimentCount['Positifs']++;
          } else if (sentimentScore < 0.4) {
            sentimentCount['Négatifs']++;
          } else {
            sentimentCount['Neutres']++;
          }
        }
      });

      this.totalFeedbacks = feedbacks.length;
      this.positivePercentage = (sentimentCount['Positifs'] / this.totalFeedbacks) * 100;
      this.neutralPercentage = (sentimentCount['Neutres'] / this.totalFeedbacks) * 100;
      this.negativePercentage = (sentimentCount['Négatifs'] / this.totalFeedbacks) * 100;

      // Generate text analysis
      this.generateSentimentAnalysis(sentimentCount);

      const labels = Object.keys(sentimentCount);
      const values = Object.values(sentimentCount);

      // Common chart options
      this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Important pour permettre le redimensionnement personnalisé
        plugins: {
          legend: { position: 'right' },
          title: { 
            display: true, 
            text: 'Répartition des Sentiments',
            font: { size: 16 }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      };

      // Pie Chart
      this.pieChartData = { 
        labels, 
        datasets: [{ 
          data: values, 
          backgroundColor: this.generateColors(labels.length)
        }] 
      };

      // Bar Chart
      this.barChartData = { 
        labels, 
        datasets: [{
          label: 'Nombre de feedbacks',
          data: values,
          backgroundColor: this.generateColors(labels.length)
        }]
      };

      // Line Chart
      this.lineChartData = {
        labels,
        datasets: [{
          data: values,
          label: 'Distribution des sentiments',
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.1,
          backgroundColor: this.generateColors(labels.length)
        }]
      };

      // Doughnut Chart
      this.doughnutChartData = { 
        labels, 
        datasets: [{ 
          data: values, 
          backgroundColor: this.generateColors(labels.length)
        }] 
      };

      // Polar Area Chart
      this.polarAreaChartData = { 
        labels, 
        datasets: [{ 
          data: values, 
          backgroundColor: this.generateColors(labels.length)
        }] 
      };

      // Radar Chart
      this.radarChartData = {
        labels,
        datasets: [{
          data: values,
          label: 'Distribution des sentiments',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          borderColor: '#42A5F5',
          pointBackgroundColor: '#42A5F5'
        }]
      };
    });
  }

  generateSentimentAnalysis(stats: { [key: string]: number }) {
    const total = stats['Positifs'] + stats['Neutres'] + stats['Négatifs'];
    
    if (total === 0) {
      this.sentimentAnalysis = "Aucun feedback analysé pour le moment.";
      return;
    }

    let analysis = `Sur un total de ${total} feedbacks analysés :\n\n`;
    
    // Positive analysis
    if (stats['Positifs'] > 0) {
      analysis += `✅ ${stats['Positifs']} feedbacks positifs (${this.positivePercentage.toFixed(1)}%) : `;
      if (this.positivePercentage > 60) {
        analysis += "Excellent taux de satisfaction ! Les utilisateurs apprécient vraiment votre application.\n\n";
      } else if (this.positivePercentage > 40) {
        analysis += "Bon niveau de satisfaction globale. Continuez vos efforts !\n\n";
      } else {
        analysis += "Marge d'amélioration possible pour augmenter la satisfaction.\n\n";
      }
    }

    // Neutral analysis
    if (stats['Neutres'] > 0) {
      analysis += `➖ ${stats['Neutres']} feedbacks neutres (${this.neutralPercentage.toFixed(1)}%) : `;
      analysis += "Ces utilisateurs n'ont pas d'opinion forte ou ont eu une expérience mitigée.\n\n";
    }

    // Negative analysis
    if (stats['Négatifs'] > 0) {
      analysis += `❌ ${stats['Négatifs']} feedbacks négatifs (${this.negativePercentage.toFixed(1)}%) : `;
      if (this.negativePercentage > 30) {
        analysis += "Taux élevé nécessitant une attention immédiate.\n\n";
      } else if (this.negativePercentage > 15) {
        analysis += "Problèmes identifiés à adresser dans les prochaines versions.\n\n";
      } else {
        analysis += "Niveau acceptable mais à surveiller.\n\n";
      }
    }

    // Recommendations
    analysis += "\nRecommandations :\n";
    if (this.positivePercentage > 70) {
      analysis += "- Encourager les utilisateurs satisfaits à noter l'application\n";
      analysis += "- Identifier les points forts à mettre en avant\n";
    } else if (this.negativePercentage > 30) {
      analysis += "- Analyser en détail les feedbacks négatifs\n";
      analysis += "- Prioriser les corrections des problèmes majeurs\n";
      analysis += "- Communiquer sur les améliorations prévues\n";
    } else {
      analysis += "- Travailler sur les points neutres pour les convertir en positifs\n";
      analysis += "- Mettre en place des enquêtes plus approfondies\n";
    }

    this.sentimentAnalysis = analysis;
  }

  changeChartType(type: string) {
    this.selectedChartType = type;
  }

  generateColors(length: number): string[] {
    const baseColors = [
      '#4BC0C0', // Positive (teal)
      '#FFCE56', // Neutral (yellow)
      '#FF6384', // Negative (red)
      '#36A2EB', // Blue
      '#9966FF', // Purple
      '#FF9F40'  // Orange
    ];
    return baseColors.slice(0, length);
  }

  goToReportedFeedbacks() {
    this.router.navigate(['/dashboard/reported-Feedbacks']);
  }
}