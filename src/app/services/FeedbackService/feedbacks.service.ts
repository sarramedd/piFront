import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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
    const headers = this.getAuthHeaders();
    
    return this.http.get<Feedback[]>(`${this.apiUrl}/retrieve-all-feedbacks`, { headers })
      .pipe(
        map(feedbacks => feedbacks.map(fb => ({
          ...fb,
          reacts: fb.reacts || [],
          showReacts: false,
          reported: fb.reported || false,
          reason: fb.reason || '',
          user: {
            id: fb.user?.id || fb.userId,
            name: fb.user?.name || fb.userName,
            email: fb.user?.email || fb.userEmail,
            avatar: fb.user?.avatar
          }
        }))),
      
      );
  }
  
  addFeedback(feedbackData: Feedback): Observable<Feedback> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post<Feedback>(
      `${this.apiUrl}/add-feedback`, 
      feedbackData, 
      { headers }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error details:', error);
        if (error.status === 403) {
          alert('Session expired or unauthorized. Please login again.');
          // Optional: redirect to login
          // this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
  
  updateFeedback(feedback: any): Observable<Feedback> {
    const headers = this.getAuthHeaders();
    return this.http.put<Feedback>(
      `${this.apiUrl}/update-feedback`,
      feedback,
      { headers }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Full error response:', error);
        let errorMessage = 'Update failed';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          if (error.error && error.error.message) {
            errorMessage += `\nServer Message: ${error.error.message}`;
          }
        }
        
        return throwError(() => new Error(errorMessage));
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
