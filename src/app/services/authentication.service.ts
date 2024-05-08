import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  @Output() registrationStatus = new EventEmitter<{
    success: boolean;
    submitted: boolean;
  }>();
  formSubmitted = false;
  showPassword = false;
  baseUrl = 'http://localhost:5000';
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post<any>(environment.apiUrl + '/auth/login', credentials, {
        observe: 'response',
        responseType: 'json',
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          const authHeader = response.headers.get('Authorization');
          const authToken = localStorage.getItem('auth_token');
          const userData = response.body;
          const idUser = this.cookieService.get('id');

          if (authHeader) {
            // Stocker le token d'authentification dans le stockage local
            localStorage.setItem('auth_token', authHeader);
          } else {
            console.info('Aucun token trouvé.');
          }

          if (userData && userData.id) {
            // Stocker l'ID de l'utilisateur dans le stockage local
            localStorage.setItem('id', userData.id);
          } else {
            console.info('Aucun ID utilisateur trouvé dans la réponse.');
          }
        })
      );
  }

  logout(): Observable<any> {
    this.cookieService.delete('auth_token');
    return this.http.get(environment.apiUrl + '/auth/logout', {
      responseType: 'text',
      withCredentials: true,
    });
  }

  registerUser(user: any): Observable<any> {
    return this.http
      .post(environment.apiUrl + '/users', user, { observe: 'response' })
      .pipe(
        map((response) => {
          if (response.status === 200 || response.status === 201) {
            return { success: true };
          } else {
            return { success: false };
          }
        })
      );
  }
  getUserAvatar(userId: string): Observable<any> {
    return this.http.get(environment.apiUrl + '/users/' + userId + '/avatar', {
      responseType: 'text',
      withCredentials: true,
    });
  }

  updateUserAvatar(avatar: File, userId: string): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', avatar);

    return this.http.put(
      environment.apiUrl + '/users/' + userId + '/updateAvatar',
      formData,
      {
        responseType: 'text',
        withCredentials: true,
      }
    );
  }
  // environment.apiUrl/users/843fa8e5-a298-4ec5-ba52-d770e4d3ca47/avatar
  insertAvatar(avatar: string, userId: string): Observable<any> {
    return this.http.put(
      environment.apiUrl + '/users/' + userId + '/avatar',
      { avatar },
      { responseType: 'text', withCredentials: true }
    );
  }
  getUserData(userId: string): Observable<any> {
    return this.http.get(environment.apiUrl + '/users/' + userId, {
      withCredentials: true,
    });
  }
  uploadUserAvatar(userId: string, avatar: File): Observable<any> {
    return this.http.post(
      environment.apiUrl + '/users/' + userId + '/avatar',
      avatar
    );
  }
  getUserToken(): string | null {
    const cookieToken = document.cookie;
    const token = this.cookieService.get('auth_token');

    if (!token) {
      console.error('Token is undefined or not found.');
      return null;
    }

    try {
      const payload: any = jwtDecode(token);
      if (!payload || !payload.userId) {
        console.error('Invalid token payload:', payload);
        return null;
      }
      return payload.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
