import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // const authToken = this.cookieService.get('auth_token'); // Utilisation de la clé 'auth_token'
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` },
        withCredentials: true,
      });
    }

    return next.handle(request);
  }
}
