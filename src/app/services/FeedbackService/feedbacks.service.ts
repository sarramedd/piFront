import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from 'src/app/core/models/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbacksService {

  private apiUrl = 'http://localhost:8089/borrowit/feedbacks';

  constructor(private http: HttpClient) {}

  getAllFeedbacks(): Observable<Feedback[]> {
    const token = localStorage.getItem('token'); // Make sure token is stored after login
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.get<Feedback[]>(`${this.apiUrl}/retrieve-all-feedbacks`, { headers });
  }
  
  addFeedback(feedbackData: Feedback): Observable<Feedback> {
    const token = localStorage.getItem('token'); // Make sure token is stored after login
  
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.post<Feedback>(`${this.apiUrl}/add-feedback`, feedbackData, { headers });
  }
  

  updateFeedback(feedbackData: Feedback): Observable<Feedback> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.put<Feedback>(`${this.apiUrl}/update-feedback`, feedbackData, { headers });
  }
  
  deleteFeedback(id: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.delete<void>(`${this.apiUrl}/delete-feedback/${id}`, { headers });
  }
  
  reportFeedback(feedbackId: number, reason: string): Observable<string> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.put<string>(
      `${this.apiUrl}/report-feedback/${feedbackId}?reason=${encodeURIComponent(reason)}`,
      {},
      { headers, responseType: 'text' as 'json' }
    );
  }
  
  
  
  
  

  

   getReportedFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/retrieve-reported-feedbacks`);
  }

  // Supprimer un feedback signalé
  deleteReportedFeedback(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-reported-feedback/${id}`);
  }

  rejectFeedback(feedbackId: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/reject-feedback/${feedbackId}`, {}, {
      responseType: 'text' as 'json'
    });
  }

  // feedbacks.service.ts
getFeedbacksByItem(itemId: number): Observable<Feedback[]> {
  return this.http.get<Feedback[]>(`${this.apiUrl}/item/${itemId}`);
}

  
  
  
  

  
}
