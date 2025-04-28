import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Payment } from "../core/models/payment";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private backendUrl = 'http://localhost:8088/borrowit/stripe';
  private apiUrl = 'http://localhost:8088/borrowit/payments';



  constructor(private http: HttpClient) {}

  createPaymentIntent(contractId: number): Observable<any> {
    return this.http.post(`${this.backendUrl}/create-payment-intent`, { 
      contractId: contractId,
    });
  }
  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  confirmPayment(paymentIntentId: string, status: string, contractId: number): Observable<any> {
    const params = new HttpParams()
      .set('paymentIntentId', paymentIntentId)
      .set('status', status)
      .set('contractId', contractId.toString());

    return this.http.post(`${this.apiUrl}/confirm`, null, { params });
  }
  getInvoice(contractId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/by-contract/${contractId}`);
  }
 
}
