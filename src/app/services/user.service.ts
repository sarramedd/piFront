import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthServiceService } from './auth-service.service'; // Assurez-vous d'importer votre AuthService pour récupérer le token JWT

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8088/borrowit/api/users';

  constructor(private http: HttpClient, private authService: AuthServiceService) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(users => users.map(user => this.normalizeUser(user)))
    );
  }
  registerUser(user: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/register`, user);
}


  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/email/${email}`).pipe(
      map(user => this.normalizeUser(user))
    );
  }

  updateUser(id: number, userData: any): Observable<any> {
    const token = this.authService.getToken(); // Récupérer le token JWT
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Envoyer la requête PUT pour mettre à jour les informations de l'utilisateur
    return this.http.put<any>(`${this.baseUrl}/${id}`, userData, { headers });
  }
  

  banUser(userId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.baseUrl}/ban/${userId}`, {}, { headers }).pipe(
      map(user => ({ ...user, status: 'Banned' }))
    );
  }

  unbanUser(userId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.baseUrl}/unban/${userId}`, {}, { headers }).pipe(
      map(user => ({ ...user, status: 'Active' }))
    );
  }

  deleteUser(userId: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.baseUrl}/${userId}`, { headers });
  }

  private normalizeUser(user: any): any {
    return {
      ...user,
      status: user.status || 'Active'
    };
  }
}
