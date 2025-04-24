import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discount } from '../core/models/discount';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private apiUrl = 'http://localhost:8088/borrowit/discounts';

  constructor(private http: HttpClient) { }

  // Créer un nouveau discount
  createDiscount(discount: Discount): Observable<Discount> {
    console.log('Envoi au serveur:', discount); // Pour le débogage
    return this.http.post<Discount>(`${this.apiUrl}/add-discounts`, discount);
  }

  // Obtenir tous les discounts
  getAllDiscounts(): Observable<Discount[]> {
    return this.http.get<Discount[]>(`${this.apiUrl}/get-discounts`);
  }

  // Method to get the discount for a specific item
  getDiscount(itemId: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/${itemId}/active`, { headers });
  }
  
  // Obtenir un discount par ID
  getDiscountById(id: number): Observable<Discount> {
    return this.http.get<Discount>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour un discount
  updateDiscount(id: number, discount: Discount): Observable<Discount> {
    return this.http.put<Discount>(`${this.apiUrl}/${id}`, discount);
  }

  // Supprimer un discount
  deleteDiscount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Obtenir les discounts actifs pour un item
  getActiveDiscountsForItem(itemId: number, token: string): Observable<Discount[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Discount[]>(`${this.apiUrl}/item/${itemId}/active`, { headers });
  }
} 