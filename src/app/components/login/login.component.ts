// login.component.ts

import { Component, EventEmitter, Output } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { passwordValidator } from '../password-validator';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  handleRegistrationStatus($event: { success: boolean; submitted: boolean; }) {
    this.visibleRegisterForm = false;
  }
  @Output() registrationStatus = new EventEmitter<{ success: boolean; submitted: boolean; }>();
  formSubmitted = false;
  credentials = { email: '', password: '' };
  visibleRegisterForm!: boolean;
  userForm: FormGroup;
  visiblePassword = false;

  constructor(private authService: AuthenticationService,
    private cookieService: CookieService,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router) {
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
      this.router.navigate(['/todolist']);
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
  toggleRegisterForm() {
    this.visibleRegisterForm = !this.visibleRegisterForm;
  }
  closeRegisterForm() {
    this.visibleRegisterForm = false;
  }
  togglePassword() {
    this.visiblePassword = !this.visiblePassword;
  }
}
