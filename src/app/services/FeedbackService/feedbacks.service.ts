import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, tap, throwError } from "rxjs";
import { Feedback } from "../feedback";
import { FeedbackDTO } from "../FeedbackDTO";
import { Reaction, Reacts } from "../reacts";


@Injectable({
  providedIn: 'root'
})
export class FeedbacksService {


  private apiUrl = 'http://localhost:8088/borrowit/feedbacks';
  
  constructor(private http: HttpClient) {}
  // Add this method to handle authentication headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

 // Dans votre feedbacks.service.ts
 // Dans feedbacks.service.ts
getAllFeedbacks(): Observable<Feedback[]> {
  const headers = this.getAuthHeaders();
  
  return this.http.get<FeedbackDTO[]>(`${this.apiUrl}/retrieve-all-feedbacks`, { headers })
    .pipe(
      tap(response => console.log('Raw feedback response:', response)),
      map((feedbacks: FeedbackDTO[]) => feedbacks.map(fb => {
        // Debug: Afficher les données de l'avatar reçues
        console.log('User avatar data for feedback', fb.id, ':', {
          hasAvatar: !!fb.userAvatar,
          avatarLength: fb.userAvatar?.length,
          isBase64: fb.userAvatar?.startsWith('data:image') ? false : true
        });

        const reacts = fb.reactTypes 
          ? fb.reactTypes.map(type => this.createReactsObject(type)).filter(Boolean)
          : [];

        // Fonction pour générer l'URL de l'avatar
        const getAvatarUrl = () => {
          if (!fb.userAvatar) return 'assets/images/Capture.png';
          
          // Si c'est déjà une URL complète
          if (fb.userAvatar.startsWith('http') || fb.userAvatar.startsWith('data:image')) {
            return fb.userAvatar;
          }
          
          // Si c'est un chemin relatif
          if (fb.userAvatar.startsWith('assets/')) {
            return fb.userAvatar;
          }
          
          // Sinon, supposons que c'est du Base64 (sans le préfixe)
          return `data:image/*;base64,${fb.userAvatar}`;
        };

        const avatarUrl = getAvatarUrl();

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
            avatar: avatarUrl
          },
          userId: fb.userId,
          userName: fb.userName,
          userEmail: fb.userEmail,
          userAvatar: avatarUrl
        } as Feedback;
      })),
      catchError(error => {
        console.error('Error fetching feedbacks:', error);
        return throwError(() => error);
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
          userEmail: fb.userEmail,
          userAvatar: fb.userAvatar
        } as Feedback;
      }))
    );
}
  
  

  
}