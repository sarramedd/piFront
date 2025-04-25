import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id?: number;
  email: string;
  password?: string;
  role: 'ADMIN' | 'BORROWER' | 'OWNER';
  firstName?: string;
  lastName?: string;
  cin?: string;
  name?: string;
  phone?: string;
  address?: string;
  dateDeNaissance?: string;
  genre?: string;
  status?: string;
}

export interface JwtResponse {
  token: string;
}

interface DecodedToken {
  sub: string;
  role: string;
  name: string;
  dateDeNaissance?: string;
  genre?: string;
  exp?: number;
  iat?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly API_URL = 'http://localhost:8088/borrowit';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  register(user: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    });

    console.log('Tentative d\'inscription avec les données:', user);
    console.log('URL d\'inscription:', `${this.API_URL}/api/users/register`);

    return this.http.post<User>(`${this.API_URL}/api/users/register`, user, { 
      headers,
      withCredentials: true 
    }).pipe(
      tap({
        next: (response) => {
          console.log('Réponse d\'inscription réussie:', response);
          if (response) {
            const userData: User = {
              email: response.email,
              role: response.role,
              firstName: response.firstName,
              lastName: response.lastName
            };
            this.currentUserSubject.next(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            this.redirectBasedOnRole(userData.role);
          }
        },
        error: (error) => {
          console.error('Erreur détaillée d\'inscription:', error);
          console.error('Détails de la requête:', {
            url: error.url,
            status: error.status,
            message: error.message,
            error: error.error,
            headers: error.headers
          });
          
          if (error.status === 403) {
            throw new Error('Accès refusé. Veuillez vérifier vos autorisations.');
          } else if (error.status === 0) {
            throw new Error('Impossible de se connecter au serveur. Veuillez vérifier que le serveur est en cours d\'exécution.');
          } else if (error.error && error.error.message) {
            throw new Error(error.error.message);
          } else {
            throw new Error('Erreur lors de l\'inscription. Veuillez réessayer.');
          }
        }
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const loginData = {
      email: credentials.email,
      password: credentials.password
    };

    console.log('Attempting login with:', JSON.stringify(loginData, null, 2));
    console.log('Login URL:', `${this.API_URL}/api/auth/login`);

    return this.http.post<JwtResponse>(`${this.API_URL}/api/auth/login`, loginData, { 
      headers,
      observe: 'response'
    }).pipe(
      tap({
        next: (response) => {
          console.log('Full login response:', response);
          const jwtResponse = response.body as JwtResponse;
          
          if (jwtResponse && jwtResponse.token) {
            console.log('Token received, storing in localStorage');
            localStorage.setItem('token', jwtResponse.token);
            
            try {
              const decodedToken = jwtDecode<DecodedToken>(jwtResponse.token);
              console.log('Decoded token:', decodedToken);
              
              if (decodedToken && decodedToken.sub && decodedToken.role) {
                console.log('Role from token:', decodedToken.role);
                const userData: User = {
                  email: decodedToken.sub,
                  role: decodedToken.role as 'ADMIN' | 'BORROWER' | 'OWNER',
                  name: decodedToken.name
                };
                
                console.log('User data extracted from token:', userData);
                this.currentUserSubject.next(userData);
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                console.log('Redirecting based on role:', userData.role);
                this.redirectBasedOnRole(userData.role);
              } else {
                console.error('Invalid JWT token: missing required fields');
                this.logout();
              }
            } catch (error) {
              console.error('Error decoding JWT token:', error);
              this.logout();
            }
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          if (error.status === 401) {
            console.error('Invalid credentials or user not found');
          }
        }
      })
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value && !!localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.currentUserSubject.value?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private redirectBasedOnRole(role: string): void {
    console.log('Executing redirectBasedOnRole with role:', role);
    switch (role) {
      case 'ADMIN':
        console.log('Redirecting ADMIN to dashboard');
        this.router.navigate(['/dashboard']);
        break;
      case 'BORROWER':
      case 'OWNER':
        console.log('Redirecting', role, 'to home');
        this.router.navigate(['/home']);
        break;
      default:
        console.log('Unknown role, redirecting to login');
        this.router.navigate(['/login']);
    }
  }
} 