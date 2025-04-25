import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthServiceService } from "./services/auth-service.service";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthServiceService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();  // Get the token from localStorage
    
    if (token) {
      // Clone the request and add the Authorization header
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      });
      return next.handle(cloned);  // Proceed with the request
    }

    return next.handle(req);  // Proceed without adding the token if there's no token
  }
}