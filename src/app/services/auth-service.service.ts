import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private baseUrl = 'http://localhost:8089/borrowit/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('API Login Response:', response);  // Log the response
      })
    );
  }
  

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.id) {
        localStorage.setItem('userId', payload.id.toString());
      }
    } catch (e) {
      console.error('Failed to decode token:', e);
    }
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Erreur lors du décodage du token :', e);
      return null;
    }
  }
  

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/request-reset?email=${email}`, {});
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    const body = {
      token: token,
      newPassword: newPassword
    };
    return this.http.post(`${this.baseUrl}/reset-password`, body);
  }

  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);

      // Adapte ici si ton backend utilise un autre nom que "role"
      return parsedPayload.role || null;
    } catch (e) {
      console.error('Erreur lors du décodage du token :', e);
      return null;
    }
  }

  
}
