import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])(?!.*[ ])/;

    const valid = passwordRegex.test(control.value);

    const errors = {
        password: {
            rules: 'must contain at least one uppercase letter, one digit, and one special character, with no spaces'
        }
    };



    return !valid ? errors : null;
}