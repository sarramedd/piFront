import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private apiUrl = 'http://localhost:8088/borrowit/pdf';

  constructor(private http: HttpClient) {}

  downloadContractPdf(contractId: number, clientName: string, amount: number) {
    const params = {
      contractId: contractId.toString(),
      clientName: clientName,
      amount: amount.toString()
    };

    return this.http.get(`${this.apiUrl}/contract`, {
      params: params,
      responseType: 'blob' // Important pour les fichiers binaires
    });
  }
}