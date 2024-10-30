import { Component, OnInit } from '@angular/core';
import { OrderService } from '../service/order.service';
import { ToastController } from '@ionic/angular';

interface Order {
  _id: string;
  service: Service[];
  client: string;
  status: string;
}

interface Service {
  _id: string;
  user: {
    FirstName: string;
    LastName: string;
    Username: string;
    Gouvernerat: string;
    Adresse: string;
  }[];
  diplome: string;
  description: string;
}

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadConfirmedOrders();
  }

  loadConfirmedOrders() {
    const userId = localStorage.getItem('userid');
    console.log('User ID:', userId); // Log the user ID
    if (userId) {
      this.orderService.getConfirmedOrders(userId).subscribe(
        (response: Order[]) => {
          console.log('Confirmed Orders Response:', response);
          this.orders = response;
        },
        (error) => {
          console.error('Error fetching confirmed orders:', error);
          this.showToast('Failed to load confirmed orders');
        }
      );
    }
  }


  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
  isUserAdmin(): boolean {
    const role = localStorage.getItem('role'); 
    return role === 'admin' ;
  }
}
