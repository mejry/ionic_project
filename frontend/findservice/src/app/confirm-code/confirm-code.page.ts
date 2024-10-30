import { Component, ViewChild } from '@angular/core';
import { IonInput, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthentificationService } from '../service/authentification.service'; // Adjust the path as necessary

@Component({
  selector: 'app-confirm-code',
  templateUrl: './confirm-code.page.html',
  styleUrls: ['./confirm-code.page.scss'],
})
export class ConfirmCodePage {
  code: string[] = ['', '', '', ''];
  errorMessage: string | null = null; // Define errorMessage here

  @ViewChild('input0', { static: false }) input0!: IonInput;
  @ViewChild('input1', { static: false }) input1!: IonInput;
  @ViewChild('input2', { static: false }) input2!: IonInput;
  @ViewChild('input3', { static: false }) input3!: IonInput;

  inputs: IonInput[] = [];

  constructor(private router: Router, private authService: AuthentificationService, private toastController: ToastController) {}

  ngAfterViewInit() {
    this.inputs = [this.input0, this.input1, this.input2, this.input3];
  }

  moveFocus(event: any, index: number) {
    const inputValue = event.target.value;

    if (inputValue.length === 1) {
      if (index < 3) {
        this.inputs[index + 1].setFocus();
      }
    } else if (inputValue.length === 0 && index > 0) {
      this.inputs[index - 1].setFocus();
    }
  }

  async confirmCode() {
    const fullCode = this.code.join('');
    if (fullCode.length === 4) {
      try {
        const response = await this.authService.confirmCode(fullCode).toPromise();
        console.log(response); // Handle response accordingly
        this.router.navigate(['/login']);
        this.errorMessage = null; // Clear error message on success
      } catch (error) {
        console.error('Error confirming code', error);
        this.errorMessage = 'Invalid confirmation code or an error occurred.'; // Set error message
        const toast = await this.toastController.create({
          message: this.errorMessage,
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    } else {
      this.errorMessage = 'Please enter a 4-digit code.'; // Set error message for invalid input
      const toast = await this.toastController.create({
        message: this.errorMessage,
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
    }
  }
}
