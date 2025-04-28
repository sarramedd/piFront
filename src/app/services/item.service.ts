/* import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Item } from '../core/models/item';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  //private apiUrl = 'http://localhost:8088/borrowit/items';
  private allowedRoles = ['OWNER', 'BORROWER', 'ADMIN'];
  private apiUrl = 'http://localhost:8088/borrowit/api/items';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token found in ItemService');
      this.authService.logout();
      this.router.navigate(['/login']);
      throw new Error('Authentication token is missing');
    }

    if (!this.authService.hasAnyRole(this.allowedRoles)) {
      console.error('User does not have required role');
      throw new Error('You do not have permission to access items');
    }

    try {
      console.log('Using token:', token.substring(0, 10) + '...');
      console.log('User role is allowed to access items');
      
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      console.log('Headers created:', headers.keys());
      return headers;
    } catch (error) {
      console.error('Error creating headers:', error);
      throw error;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    
    if (error.status === 403) {
      console.error('Access forbidden. This might be a role-based permission issue.');
      return throwError(() => new Error('You do not have permission to access this resource. Please contact support if you believe this is an error.'));
    }
    
    if (error.status === 401) {
      console.error('Authentication token is invalid or expired');
      this.authService.logout();
      this.router.navigate(['/login']);
      return throwError(() => new Error('Your session has expired. Please login again.'));
    }

    return throwError(() => error);
  }

  getAllItems(): Observable<Item[]> {
    if (!this.authService.isAuthenticated()) {
      console.error('User is not authenticated in getAllItems');
      this.router.navigate(['/login']);
      return throwError(() => new Error('User is not authenticated'));
    }

    const headers = this.getHeaders();
    console.log('Making request to:', `${this.apiUrl}/get-items`);
    console.log('Request headers:', headers.keys());

    return this.http.get<Item[]>(`${this.apiUrl}/get-items`, { 
      headers: headers 
    }).pipe(
      tap(response => {
        console.log('Received items response:', response);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  getItemById(id: number): Observable<Item> {
    if (!this.authService.isAuthenticated()) {
      console.error('User is not authenticated in getItemById');
      this.router.navigate(['/login']);
      return throwError(() => new Error('User is not authenticated'));
    }

    const headers = this.getHeaders();
    console.log('Making request to:', `${this.apiUrl}/get-items/${id}`);
    console.log('Request headers:', headers.keys());

    return this.http.get<Item>(`${this.apiUrl}/get-items/${id}`, { 
      headers: headers 
    }).pipe(
      tap(response => {
        console.log('Received item response:', response);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  createItem(item: Item): Observable<Item> {
    if (!this.authService.isAuthenticated()) {
      console.error('User is not authenticated in createItem');
      this.router.navigate(['/login']);
      return throwError(() => new Error('User is not authenticated'));
    }

    const headers = this.getHeaders();
    console.log('Making request to:', `${this.apiUrl}/add-items`);
    console.log('Request payload:', item);

    return this.http.post<Item>(`${this.apiUrl}/add-items`, item, { 
      headers: headers
    }).pipe(
      tap(response => {
        console.log('Created item response:', response);
      }),
      catchError(this.handleError.bind(this))
    );
  }
}*/
