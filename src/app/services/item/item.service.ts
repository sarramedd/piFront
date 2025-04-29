import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service'; 
import { Item } from 'src/app/core/models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8088/borrowit/api/items';

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService,
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

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);

    if (error.status === 403) {
      console.error('Access forbidden. This might be a role-based permission issue.');
      return throwError(() => new Error('You do not have permission to access this resource.'));
    }

    if (error.status === 401) {
      console.error('Authentication token is invalid or expired');
      this.authService.logout();
      this.router.navigate(['/login']);
      return throwError(() => new Error('Your session has expired. Please login again.'));
    }

    return throwError(() => error);
  }

  private checkAuthentication(): void {
    if (!this.authService.isLoggedIn()) {
      console.error('User is not authenticated');
      this.router.navigate(['/login']);
      throw new Error('User is not authenticated');
    }
  }

  getAllItems(): Observable<Item[]> {
    this.checkAuthentication();
    const headers = this.getHeaders();
    return this.http.get<Item[]>(`${this.apiUrl}/All`, { headers }).pipe(
      tap(response => console.log('Received items response:', response)),
      catchError(this.handleError.bind(this))
    );
  }

  getItemById(id: number): Observable<Item> {
    this.checkAuthentication();
    const headers = this.getHeaders();
    return this.http.get<Item>(`${this.apiUrl}/get/${id}`, { headers }).pipe(
      tap(response => console.log('Received item response:', response)),
      catchError(this.handleError.bind(this))
    );
  }

  createItem(item: Item, categoryId: number): Observable<Item> {
    this.checkAuthentication();
    const headers = this.getHeaders();
    return this.http.post<Item>(`${this.apiUrl}/add/${categoryId}`, item, { headers }).pipe(
      tap(response => console.log('Created item response:', response)),
      catchError(this.handleError.bind(this))
    );
  }

  updateItem(id: number, item: Item, categoryId: number): Observable<Item> {
    this.checkAuthentication();
    const headers = this.getHeaders();
    return this.http.put<Item>(`${this.apiUrl}/edit/${id}/${categoryId}`, item, { headers }).pipe(
      tap(response => console.log('Updated item response:', response)),
      catchError(this.handleError.bind(this))
    );
  }

  deleteItem(id: number): Observable<void> {
    this.checkAuthentication();
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers }).pipe(
      tap(() => console.log('Deleted item with id:', id)),
      catchError(this.handleError.bind(this))
    );
  }

  updateStatusItem(id: number, statusItem: string): Observable<void> {
    this.checkAuthentication();
    const headers = this.getHeaders();
    return this.http.put<void>(`${this.apiUrl}/updateStatus/${id}/${statusItem}`, null, { headers }).pipe(
      tap(() => console.log('Updated item status')),
      catchError(this.handleError.bind(this))
    );
  }
}
