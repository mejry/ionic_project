import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthentificationService } from '../service/authentification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  signupForm: FormGroup; // Utilisation de FormGroup
  message: string = '';  

  gouvernorats = [
    'Ariana', 'Beja', 'Ben Arous', 'Bizerte', 'Gabes', 'Gafsa', 'Jendouba',
    'Kairouan', 'Kasserine', 'Kebili', 'La Manouba', 'Mednine', 'Monastir',
    'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Tunis', 'Zaghouan'
  ];

  constructor(private formBuilder: FormBuilder, private authService: AuthentificationService) {
 
    this.signupForm = this.formBuilder.group({
      FirstName: [''],
      LastName: [''],
      Username: [''],
      Email: [''],
      Password: [''],
      Adresse: [''],
      Gouvernorat: [''],
      Role:['']
    });
  }

  onSignup() {
    const signupData = this.signupForm.value;
    console.log(signupData);

    this.authService.signup(signupData).subscribe(
      (response) => {
        this.message = 'User signed up successfully!';
        console.log('User signed up successfully!', response);
      },
      (error) => {
        if (error.status === 409) {
          this.message = 'User already exists.';
        } else {
          this.message = 'Error during signup. Please try again.';
        }
        console.error('Error during signup:', error);
      }
    );
  }
}
