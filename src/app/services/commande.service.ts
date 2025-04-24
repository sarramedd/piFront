import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from '../core/models/commande';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
private apiUrl = 'http://localhost:8088/borrowit/commandes';
constructor(private http: HttpClient) {}
getAllCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.apiUrl);
  }
  getCommandesWithItemsAndOwners(userId: number): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/owner/${userId}`);
  }
}