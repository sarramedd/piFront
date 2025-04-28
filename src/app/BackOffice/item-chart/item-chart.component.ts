import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item/item.service';
import { Item } from 'src/app/core/models/item';

@Component({
  selector: 'app-item-chart',
  templateUrl: './item-chart.component.html',
  styleUrls: ['./item-chart.component.css']
})
export class ItemChartComponent implements OnInit {
  data: any;
  options: any;

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.loadChartData();
  }

  loadChartData() {
    this.itemService.getAllItems().subscribe((items: Item[]) => {
      const categoryCount: { [key: string]: number } = {};

      items.forEach((item: Item) => {
        if (item.categoryType) {
          const category = item.categoryType;
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        }
      });

      const labels = Object.keys(categoryCount);
      const values = Object.values(categoryCount);

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
            text: 'Répartition des items par catégorie'
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
}
