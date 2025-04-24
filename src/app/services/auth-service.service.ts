import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private baseUrl = 'http://localhost:8088/borrowit/api/auth';  // Make sure this is correct
  private userUrl = 'http://localhost:8088/borrowit/users';  // URL for user endpoints
  
  // Static user for testing purposes
  private staticUser = {
    id: 2,
  };

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

  getCurrentUser(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      console.log('No authentication token found. Using static user for testing.');
      return of(this.staticUser);
    }

    try {
      // Try to decode the token to get user info
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.sub || decodedToken.userId;
      
      if (userId) {
        // If we have a user ID in the token, fetch the full user details
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.userUrl}/${userId}`, { headers });
      } else {
        // Fallback to a generic endpoint that returns the current user
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.userUrl}/me`, { headers });
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      console.log('Using static user due to token error.');
      return of(this.staticUser);
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
}
