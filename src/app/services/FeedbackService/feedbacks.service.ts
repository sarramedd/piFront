import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Feedback } from 'src/app/core/models/feedback';
import { FeedbackDTO } from 'src/app/core/models/FeedbackDTO';
import { Reaction, Reacts } from 'src/app/core/models/reacts';



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

  // In your feedbacks.service.ts
  getAllFeedbacks(): Observable<Feedback[]> {
    const headers = this.getAuthHeaders();
    
    return this.http.get<FeedbackDTO[]>(`${this.apiUrl}/retrieve-all-feedbacks`, { headers })
      .pipe(
        // Debug logging for avatar data
        tap((feedbacks: FeedbackDTO[]) => {
          console.log('[DEBUG] Received feedbacks with avatar data:', 
            feedbacks.map(f => ({
              id: f.id,
              hasAvatar: !!f.userAvatar,
              avatarLength: f.userAvatar?.length,
              hasUserData: !!f.userId
            }))
          );
        }),
        
        // Main mapping logic
        map((feedbacks: FeedbackDTO[]) => feedbacks.map(fb => {
          // Convert reactTypes to reacts (keeping your existing logic)
          const reacts = fb.reactTypes 
            ? fb.reactTypes
                .filter(type => type !== null && type !== undefined)
                .map(type => this.createReactsObject(type))
            : [];
  
          // Create the feedback object with all properties
          const mappedFeedback: Feedback = {
            ...fb,
            reacts,
            showReacts: false,
            reported: fb.isReported || false,
            reason: fb.reportReason || '',
            sentimentScore: fb.sentimentScore || null,
            user: {
              id: fb.userId,
              name: fb.userName,
              email: fb.userEmail,
              avatar: fb.userAvatar  // Properly mapped from DTO
            },
            // Keep these for backward compatibility
            userId: fb.userId,
            userName: fb.userName,
            userEmail: fb.userEmail
          };
  
          console.log('[DEBUG] Mapped feedback:', {
            id: mappedFeedback.id,
            hasAvatar: !!mappedFeedback.user?.avatar,
            reactCount: mappedFeedback.reacts?.length
          });
  
          return mappedFeedback;
        })),
        
        // Error handling
        catchError(error => {
          console.error('[ERROR] Failed to load feedbacks:', error);
          return throwError(() => new Error('Failed to load feedbacks'));
        })
      );
  }
  
  // Méthode helper pour créer un objet Reacts valide
  private createReactsObject(reactionType: string): Reacts {
    const validReactions: Reaction[] = ['LIKE', 'DISLIKE', 'LOVE', 'LAUGH', 'SAD', 'ANGRY'];
    const reaction: Reaction = validReactions.includes(reactionType as Reaction) 
      ? reactionType as Reaction 
      : 'LIKE'; // Valeur par défaut
  
    return {
      reaction,
      id: 0, // ID par défaut (à adapter selon vos besoins)
      date: new Date().toISOString(),
      user: undefined, // À remplir si nécessaire
      feedback: undefined // À remplir si nécessaire
    };
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
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/retrieve-reported-feedbacks`, { headers })
      .pipe(
        map(feedbacks => feedbacks.map(fb => ({
          id: fb.id,
          message: fb.message,
          date: fb.date,
          reason: fb.reportReason || fb.reason || '', // Handle both DTO and legacy fields
          reported: fb.isReported || fb.reported || false,
          showReason: false,
          user: {
            id: fb.userId,
            name: fb.userName,
            email: fb.userEmail
          },
          // Include other fields as needed
          reacts: fb.reactTypes ? fb.reactTypes.map((type: string) => ({ reaction: type })) : []
        })))
      );
  }

  // Supprimer un feedback signalé
deleteReportedFeedback(id: number): Observable<void> {
  const headers = this.getAuthHeaders();
  return this.http.delete<void>(`${this.apiUrl}/delete-reported-feedback/${id}`, { 
    headers 
  });
}

rejectFeedback(feedbackId: number): Observable<string> {
  const headers = this.getAuthHeaders();
  return this.http.put<string>(
    `${this.apiUrl}/reject-feedback/${feedbackId}`, 
    {}, 
    { 
      headers,
      responseType: 'text' as 'json' 
    }
  );
}

  // feedbacks.service.ts
getFeedbacksByItem(itemId: number): Observable<Feedback[]> {
  return this.http.get<Feedback[]>(`${this.apiUrl}/item/${itemId}`);
}

  
  // Add this method to your FeedbacksService
getFeedbacksByUserId(userId: number): Observable<Feedback[]> {
  const headers = this.getAuthHeaders();
  
  return this.http.get<FeedbackDTO[]>(`${this.apiUrl}/retrieve-user-feedbacks/${userId}`, { headers })
    .pipe(
      map((feedbacks: FeedbackDTO[]) => feedbacks.map(fb => {
        const reacts = fb.reactTypes 
          ? fb.reactTypes
              .filter(type => type !== null && type !== undefined)
              .map(type => this.createReactsObject(type))
          : [];

        return {
          ...fb,
          reacts,
          showReacts: false,
          reported: fb.isReported || false,
          reason: fb.reportReason || '',
          sentimentScore: fb.sentimentScore || null,
          user: {
            id: fb.userId,
            name: fb.userName,
            email: fb.userEmail,
            avatar: fb.userAvatar
          },
          userId: fb.userId,
          userName: fb.userName,
          userEmail: fb.userEmail
        } as Feedback;
      }))
    );
}
  
  

  
}
