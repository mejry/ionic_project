import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  resetPassword() {
    if (this.newPassword === this.confirmPassword && this.newPassword.trim()) {
      
      console.log('Mot de passe réinitialisé avec succès');
      this.router.navigate(['/login']);
    } else {
     
      console.log('Les mots de passe ne correspondent pas ou sont vides.');
    }
  }
}
