import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { Reaction, Reacts } from 'src/app/core/models/reacts';
import { AvatarService } from './avatar.service';

interface ReactResponseDTO {
  id: number;
  reaction: string;
  date: string;
  userId: number;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userAvatar?: string;
  userGenre?: string;
  userCin?: number;
  feedbackId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReactsService {
  private apiUrl = 'http://localhost:8089/borrowit/reacts';
  private defaultProfileImage = 'assets/images/Capture.png';

  constructor(private http: HttpClient,private avatarService: AvatarService ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private getCurrentUserId(): number {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData?.id || 0; // Return 0 or handle null case as needed
  }

  getAllReacts(): Observable<Reacts[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/retrieve-all-reacts`, { headers });
  }

  addReaction(react: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-react`, react, {
      headers: this.getAuthHeaders()
    });
  }

  getReactionsForFeedback(feedbackId: number): Observable<Reacts[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ReactResponseDTO[]>(
        `${this.apiUrl}/retrieve-reacts-for-feedback/${feedbackId}`,
        { headers }
    ).pipe(
        tap(response => console.log('Raw reaction response:', response)),
        map((response: ReactResponseDTO[]) => {
            if (!response || !Array.isArray(response)) return [];
            const transformed = response.map(react => {
                const result = this.transformReactDTO(react);
                console.log('Transformed react:', result);
                return result;
            });
            return transformed;
        }),
        catchError(error => {
            console.error('Error fetching reactions:', error);
            return of([]);
        })
    );
}

private transformReactDTO(dto: ReactResponseDTO): Reacts {
  const feedback = dto.feedbackId ? { 
      id: dto.feedbackId,
      message: '',
      date: new Date().toISOString(),
      user: undefined,
      reacts: undefined
  } : undefined;

  return {
      id: dto.id,
      reaction: dto.reaction as Reaction,
      date: dto.date,
      user: {
          id: dto.userId,
          name: dto.userName || 'Anonymous',
          email: dto.userEmail || '',
          phone: dto.userPhone || '',
          avatar: dto.userAvatar || this.defaultProfileImage, // Use direct avatar URL
          genre: dto.userGenre || '',
          cin: dto.userCin || 0
      },
      feedback: feedback
  };
}

  deleteReact(reactId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-react/${reactId}`, {
      headers: this.getAuthHeaders()
    });
  }

  addOrUpdateReaction(feedbackId: number, reactionType: Reaction): Observable<Reacts> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('User not logged in'));
    }
  
    const headers = this.getAuthHeaders();
    return this.http.post<Reacts>(
      `${this.apiUrl}/react`,
      { feedbackId, userId, reactionType },
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Error adding/updating reaction:', error);
        return throwError(() => error);
      })
    );
  }
  
  removeReaction(feedbackId: number): Observable<void> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      return throwError(() => new Error('User not logged in'));
    }
  
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(
      `${this.apiUrl}/react?feedbackId=${feedbackId}&userId=${userId}`,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Error removing reaction:', error);
        return throwError(() => error);
      })
    );
  }

  
}