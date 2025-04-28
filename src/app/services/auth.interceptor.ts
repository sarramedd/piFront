import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service'; // Adjust path as needed

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthServiceService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip adding token for public endpoints
    if (req.url.includes('/api/auth/') ||
      req.url.includes('/api/users/') ||
      req.url.includes('/api/forgot-password') ||
      req.url.includes('/api/reset-password')) {
      return next.handle(req);
    }

    const token = this.authService.getToken();
    if (token) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(authReq);
    } else {
      console.warn('No token found in AuthInterceptor for request:', req.url);
    }

    return next.handle(req);
  }
}
