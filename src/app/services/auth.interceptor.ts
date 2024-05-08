import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('auth_token');
    // console.log(authToken, 'authToken');

    if (!authToken) {
      this.router.navigate(['/login']);
    } else {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${authToken}` },
        withCredentials: true,
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.info(error.error); // Affiche le contenu de error.error dans la console

        if (error.status === 401) {
          console.info(error.error, 'error.error');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('id');
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
