import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private backendUrl = 'http://localhost:8089/borrowit/stripe';

  constructor(private http: HttpClient) {}

  createPaymentIntent(contractId: number, amount: number): Observable<any> {
    return this.http.post(`${this.backendUrl}/create-payment-intent`, {
      contractId: contractId,
      amount: amount
    });
  }

  confirmPayment(paymentIntentId: string, status: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/confirm-payment`, {
      paymentIntentId: paymentIntentId,
      status: status
    });
  }
}
