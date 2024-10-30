import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  email: string = '';

  constructor(private router: Router) {}

  sendResetLink() {
    if (this.email.trim()) {
    
      console.log(`Sending password reset link to ${this.email}`);
      this.router.navigate(['/confirm-code']);
    } else {
  
      console.log('Veuillez entrer une adresse e-mail.');
    }
  }
}
