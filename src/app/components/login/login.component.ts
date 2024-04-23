// login.component.ts

import { Component, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { passwordValidator } from '../password-validator';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Output() registrationStatus = new EventEmitter<{ success: boolean; submitted: boolean; }>();
  formSubmitted = false;
  credentials = { email: '', password: '' };
  // showModal!: boolean;
  userForm: FormGroup;

  constructor(private authService: AuthenticationService, private cookieService: CookieService, private http: HttpClient, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator]],
      confirmationPassword: ['']
    });
  }

  loginUsingCookie() {
    this.authService.login(this.credentials).subscribe(response => {
      this.cookieService.get('auth_token',);

      const token = response.body.token;
     

      localStorage.setItem('auth_token', token);

      console.info('Connexion réussie !');
    }, error => {
      console.error('Erreur de connexion :', error);
    });
  }

  logoutUsingCookie() {
    this.authService.logout().subscribe(response => {
      console.info('Déconnexion réussie !', response);
    }, error => {
      console.error('Erreur de déconnexion :', error);
    });
    localStorage.removeItem('auth_token');
  }
  isLoggedIn() {
    return this.cookieService.check('token');
  }
  onRegisterUser(userForm: NgForm) {
    if (userForm.valid) {
      const user = {
        lastname: userForm.value.lastname,
        firstname: userForm.value.firstname,
        email: userForm.value.email,
        password: userForm.value.password
      };

      this.authService.registerUser(user).subscribe(
        () => {
          console.info('User registered successfully!');
          this.registrationStatus.emit({
            success: true,
            submitted: true
          });
        }
      );
    }
  }
}
