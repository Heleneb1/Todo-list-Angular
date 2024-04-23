import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  @Output() registrationStatus = new EventEmitter<{ success: boolean; submitted: boolean; }>();
  formSubmitted = false;
  showPassword = false;

  constructor(private http: HttpClient, private cookieService: CookieService) { }


  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>('http://localhost:5000/auth/login', credentials, { observe: 'response', responseType: 'json', withCredentials: true })
      .pipe(
        tap(response => {

          const authHeader = response.headers.get('Authorization');
          const authToken = localStorage.getItem('auth_token');
          if (authToken) {

          } else {
            console.info('Aucun token trouvé.');
          }
        })
      );
  }

  logout(): Observable<any> {
    this.cookieService.delete('auth_token');
    return this.http.get('http://localhost:5000/auth/logout', { responseType: 'text', withCredentials: true });
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(environment.apiUrl + '/users', user, { observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200 || response.status === 201) {
            return { success: true };
          } else {
            return { success: false };
          }
        })
      );
  }


}
