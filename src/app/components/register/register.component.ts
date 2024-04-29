import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @Output() closeRegister = new EventEmitter<void>();
  @Output() registrationStatus = new EventEmitter<{ success: boolean; submitted: boolean; }>();

  constructor(private authService: AuthenticationService, private router: Router) { }
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

  onCloseRegisterForm() {
    this.closeRegister.emit();
  }

}
