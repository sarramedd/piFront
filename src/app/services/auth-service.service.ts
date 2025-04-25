import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService, User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private baseUrl = 'http://localhost:8088/borrowit/api/auth';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.authService.login(credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.authService.getToken();
  }

  logout(): void {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
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
      return parsedPayload.role || null;
    } catch (e) {
      console.error('Erreur lors du décodage du token :', e);
      return null;
    }
  }

  getCurrentUser(): Observable<User | null> {
    return this.authService.currentUser$;
  }
} 