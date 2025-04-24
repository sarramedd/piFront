import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private baseUrl = 'http://localhost:8088/borrowit/api/auth';  // Make sure this is correct

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
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
  getUserFromToken(): any {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }
  hasRole(role: string): boolean {
    const user = this.getUserFromToken();
    return user?.roles?.includes(role);
  }
  getUserId(): number | null {
    const user = this.getUserFromToken();
    return user?.id ?? null;
  }
  
}
