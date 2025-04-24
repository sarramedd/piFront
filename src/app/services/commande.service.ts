import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Commande } from '../core/models/commande';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  private apiUrl = 'http://localhost:8088/borrowit/commandes';  // L'URL de ton API

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('Token utilisé:', token ? 'Présent' : 'Absent');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createCommande(commande: Commande): Observable<Commande> {
    console.log('Création commande:', commande);
    return this.http.post<Commande>(`${this.apiUrl}/add-commandes`, commande, { headers: this.getHeaders() })
      .pipe(tap({
        next: (response) => console.log('Commande créée:', response),
        error: (error) => console.error('Erreur création commande:', error)
      }));
  }

  confirmCommande(id: number): Observable<Commande> {
    console.log('Confirmation commande:', id);
    return this.http.post<Commande>(`${this.apiUrl}/confirm/${id}`, {}, { headers: this.getHeaders() })
      .pipe(tap({
        next: (response) => console.log('Commande confirmée:', response),
        error: (error) => console.error('Erreur confirmation commande:', error)
      }));
  }

  getAllCommandes(): Observable<Commande[]> {
    console.log('Récupération de toutes les commandes');
    const headers = this.getHeaders();
    console.log('Headers envoyés:', headers);
    
    return this.http.get<Commande[]>(`${this.apiUrl}/get-commandes`, { headers })
      .pipe(tap({
        next: (response) => console.log('Commandes récupérées:', response),
        error: (error) => {
          console.error('Erreur détaillée:', {
            message: error.message,
            status: error.status,
            statusText: error.statusText,
            error: error.error
          });
        }
      }));
  }

  cancelCommande(id: number): Observable<Commande> {
    console.log('Annulation commande:', id);
    return this.http.post<Commande>(`${this.apiUrl}/cancel/${id}`, {}, { headers: this.getHeaders() })
      .pipe(tap({
        next: (response) => console.log('Commande annulée:', response),
        error: (error) => console.error('Erreur annulation commande:', error)
      }));
  }
}
