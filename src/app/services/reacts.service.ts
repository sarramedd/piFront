import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reacts } from '../core/models/reacts';

@Injectable({
  providedIn: 'root'
})
export class ReactsService {

  private apiUrl = 'http://localhost:8089/borrowit/reacts';  // Your Spring Boot API URL

  constructor(private http: HttpClient) {}

  getAllReacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/retrieve-all-reacts`);
  }
  // Add a reaction to a feedback
  addReaction(react: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post(`${this.apiUrl}/add-react`, react, { headers });
  }

  // Get reactions for a specific feedback
  getReactionsForFeedback(feedbackId: number): Observable<Reacts[]> {
    return this.http.get<Reacts[]>(`${this.apiUrl}/reactionCount/${feedbackId}`);
  }

  
  deleteReact(reactId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-react/${reactId}`);
}
}
