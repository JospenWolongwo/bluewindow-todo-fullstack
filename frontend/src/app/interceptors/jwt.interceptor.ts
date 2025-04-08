import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip authentication for authentication endpoints themselves
    if (request.url.includes('/api/auth/login') || request.url.includes('/api/auth/register')) {
      return next.handle(request);
    }
    
    // Get the auth token from the service
    const token = this.authService.getToken();
    
    if (token) {
      // Clone the request and add the authorization header
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return next.handle(authRequest);
    }
    
    // If no token is available, proceed with the original request
    return next.handle(request);
  }
}
