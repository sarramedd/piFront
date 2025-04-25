import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reacts } from 'src/app/core/models/reacts';

@Injectable({
  providedIn: 'root'
})
export class ReactsService {
  private apiUrl = 'http://localhost:8089/borrowit/reacts';  // Your Spring Boot API URL

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // or sessionStorage depending on where you stored it
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  getAllReacts(): Observable<Reacts[]> {
    const token = localStorage.getItem('token'); // Make sure token is stored after login
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.http.get<any[]>(`${this.apiUrl}/retrieve-all-reacts`, {
      headers
    });
  }

  // Add a reaction to a feedback
  addReaction(react: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-react`, react, {
      headers: this.getAuthHeaders()
    });
  }

  // Get reactions for a specific feedback
  getReactionsForFeedback(feedbackId: number): Observable<Reacts[]> {
    const token = localStorage.getItem('token'); // Make sure token is stored after login
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    return this.http.get<Reacts[]>(`${this.apiUrl}/reactionCount/${feedbackId}`, {
      headers
    });
  }

  deleteReact(reactId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-react/${reactId}`, {
      headers: this.getAuthHeaders()
    });
  }
}
