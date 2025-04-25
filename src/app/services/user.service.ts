import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../core/models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8088/borrowit/api/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  private getMultipartHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);
  }

  registerUser(user: any, imageFile: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(user)], {
      type: 'application/json'
    }));
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.post(`${this.baseUrl}/register`, formData);
  }

  getUserImageByEmail(email: string): Observable<string> {
   return this.http.get(`${this.baseUrl}/image/${email}`, { responseType: 'text' });
  }

  verifyUserCode(userId: number, verificationCode: string): Observable<any> {
    const url = `${this.baseUrl}/verify/${userId}?verificationCode=${verificationCode}`;
    return this.http.post(url, {}, { responseType: 'text' });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/email/${email}`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/current`, { headers: this.getHeaders() });
  }

  updateUser(id: number, user: User, imageFile?: File | null): Observable<User> {
    if (imageFile) {
      const formData = new FormData();
      formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));
      formData.append('image', imageFile);
      return this.http.put<User>(`${this.baseUrl}/${id}`, formData, { headers: this.getMultipartHeaders() });
    } else {
      return this.http.put<User>(`${this.baseUrl}/${id}`, user, { headers: this.getHeaders() });
    }
  }

  banUser(userId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/ban/${userId}`, {});
  }

  unbanUser(userId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/unban/${userId}`, {});
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}`);
  }
}