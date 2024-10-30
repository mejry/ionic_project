import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../service/authentification.service'; // Import your authentication service
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  loginData = {
    Email: '',
    Password: ''
  };
  
  message: string = ''; 
  
  constructor(private authService: AuthentificationService, private router: Router) { }

  singup(){
    this.router.navigate(['/signup']);
  }
  onLogin() {
    this.authService.login(this.loginData).subscribe(
        (response) => {
            console.log(response); // Log the full response for debugging
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.result.Role);
            localStorage.setItem('userid', response.result._id);
            console.log(response.result.confirmed);
            

            // Check if the user is confirmed
            if (!response.result.confirmed) {
                console.log("User needs to confirm their code.");
                this.router.navigate(['/confirm-code']); 
            } else {
                // Proceed to home or user based on role
                if (response.result.Role === "admin") {
                    this.router.navigate(['/home']);
                } else {
                    this.router.navigate(['/user']);
                }
            }

            this.message = response.message;
        },
        (error) => {
            if (error.status === 401) {
                this.message = error.error;
            } else if (error.status === 301) {
                this.message = error.error;
            } else {
                console.error('Error during login:', error);
                this.message = "Failed to sign in. Please try again.";
            }
        }
    );
}

}
