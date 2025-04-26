import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Feedback } from 'src/app/core/models/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbacksService {

  private apiUrl = 'http://localhost:8089/borrowit/feedbacks';

  constructor(private http: HttpClient) {}
  // Add this method to handle authentication headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAllFeedbacks(): Observable<Feedback[]> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.get<Feedback[]>(`${this.apiUrl}/retrieve-all-feedbacks`, { headers })
      .pipe(
        map(feedbacks => feedbacks.map(fb => ({
          id: fb.id,
          message: fb.message,
          date: fb.date,
          reacts: fb.reacts || [],
          showReacts: false,
          reported: fb.reported || false,
          reason: fb.reason || '',
          user: {
            id: fb.user?.id || fb.userId,
            name: fb.user?.name || fb.userName,
            email: fb.user?.email || fb.userEmail
          }
        })))
      );
  }
  
  addFeedback(feedbackData: Feedback): Observable<Feedback> {
    const token = localStorage.getItem('token'); // Make sure token is stored after login
  
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.post<Feedback>(`${this.apiUrl}/add-feedback`, feedbackData, { headers });
  }
  
  updateFeedback(feedback: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(
      `${this.apiUrl}/update-feedback`,
      feedback,
      { 
        headers,
        responseType: 'text' // First get raw response
      }
    ).pipe(
      map(response => {
        try {
          // Try to parse JSON
          return JSON.parse(response);
        } catch (e) {
          // If parsing fails but we know the update succeeded
          console.warn('Response parsing failed but operation succeeded');
          return { success: true };
        }
      }),
      catchError(error => {
        // Handle cases where the request actually failed
        return throwError(() => new Error('Update failed'));
      })
    );
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
