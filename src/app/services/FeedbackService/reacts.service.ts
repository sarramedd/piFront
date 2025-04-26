import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Reaction, Reacts } from 'src/app/core/models/reacts';



// Define the DTO interface at the top of the file
interface ReactResponseDTO {
  id: number;
  reaction: string;
  date: string;
  userId: number;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userAvatarUrl?: string;
  userGenre?: string;
  userCin?: number;
  feedbackId?: number;
}
@Injectable({
  providedIn: 'root'
})
export class ReactsService {
  private apiUrl = 'http://localhost:8089/borrowit/reacts';  // Your Spring Boot API URL
  private defaultProfileImage = 'assets/images/Capture.png'; // Add this 

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
 // In reacts.service.ts
 getReactionsForFeedback(feedbackId: number): Observable<Reacts[]> {
  const headers = this.getAuthHeaders();
  
  return this.http.get<ReactResponseDTO[]>(
    `${this.apiUrl}/retrieve-reacts-for-feedback/${feedbackId}`,
    { headers }
  ).pipe(
    map((response: ReactResponseDTO[]) => {
      if (!response || !Array.isArray(response)) {
        return [];
      }
      return response.map(react => this.transformReactDTO(react));
    }),
    catchError(error => {
      console.error('Error fetching reactions:', error);
      return of([]);
    })
  );
}

private transformReactDTO(dto: ReactResponseDTO): Reacts {
  // Create a minimal Feedback object if feedbackId exists
  const feedback = dto.feedbackId ? { 
    id: dto.feedbackId,
    message: '', // Add required properties from Feedback interface
    date: new Date().toISOString(),
    // Add other required Feedback properties here
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
      avatar: dto.userAvatarUrl || this.defaultProfileImage,
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
}
