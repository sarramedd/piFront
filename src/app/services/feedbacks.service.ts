import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from '../core/models/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8089/borrowit/feedbacks';

  constructor(private http: HttpClient) {}

  getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/retrieve-all-feedbacks`);
  }

  addFeedback(feedbackData: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(`${this.apiUrl}/add-feedback`, feedbackData);
  }

  updateFeedback(feedbackData: Feedback): Observable<Feedback> {
    return this.http.put<Feedback>(`${this.apiUrl}/update-feedback`, feedbackData);
  }

  deleteFeedback(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-feedback/${id}`);
  }

  
  reportFeedback(feedbackId: number): Observable<any> {
    const url = `${this.apiUrl}/report-feedback/${feedbackId}`;
    return this.http.put(url, {}, { responseType: 'text' }); // Indiquer que la réponse est un texte
  }
  

  getReportedFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/retrieve-reported-feedbacks`);
  }

  // Supprimer un feedback signalé
  deleteReportedFeedback(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-reported-feedback/${id}`);
  }
  

  
}
