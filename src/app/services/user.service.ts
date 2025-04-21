import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8088/borrowit/api/users';

  constructor(private http: HttpClient) { }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
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

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, userData);
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