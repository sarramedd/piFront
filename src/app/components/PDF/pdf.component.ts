import { Component } from '@angular/core';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-pdf-download',
  template: `
    <button (click)="downloadContract()">Télécharger le contrat</button>
  `
})
export class PdfDownloadComponent {
  constructor(private pdfService: PdfService) {}

  downloadContract() {
    const contractId = 123;
    const clientName = "John Doe";
    const amount = 1500.50;

    this.pdfService.downloadContractPdf(contractId, clientName, amount).subscribe(
      (blob: Blob) => {
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contrat.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('Erreur lors du téléchargement', error);
      }
    );
  }
}