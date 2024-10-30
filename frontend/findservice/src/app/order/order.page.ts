import { Component, OnInit } from '@angular/core';
import { OrderService } from '../service/order.service';
import {  ToastController } from '@ionic/angular';

interface Order {
  _id: string;
  service: Service[]; 
  client: string;
  status: string;
}

interface Service {
  _id: string;
  user: { FirstName: string; 
    LastName: string; 
    Username: string; 
    Gouvernerat: string;
    Adresse: string }[]; 
    diplome: string;
    description: string;
}
@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  orders: Order[] = []; // Correctly typed as Order array

  constructor(
    private orderService: OrderService,
    private toastController: ToastController // Injecting ToastController here
  ) {}

  ngOnInit() {
    this.loadPendingOrders(); // Load pending orders on initialization
  }

  loadPendingOrders() {
    const userId = localStorage.getItem('userid'); 
    console.log('User ID:', userId);
    if (userId) {
      this.orderService.getPendingOrdersByEmployee(userId).subscribe(
        (response: Order[]) => {
          console.log( "this response :",response);
          
          this.orders = response; 
        },
        (error) => {
          console.error('Error fetching pending orders:', error);
        }
      );
    }
  }

  async confirmOrder(orderId: string) {
    this.orderService.confirmOrder(orderId).subscribe(
      async (response) => {
        this.loadPendingOrders(); // Refresh the orders list after confirmation
        await this.showToast('Order confirmed successfully.'); // Show success message
      },
      async (error) => {
        console.error('Error confirming order:', error);
        await this.showToast('Failed to confirm order. Please try again.'); // Show error message
      }
    );
  }

  async cancelOrder(orderId: string) {
    this.orderService.rejectOrder(orderId).subscribe(
      async (response) => {
        this.loadPendingOrders(); // Refresh the orders list after cancellation
        await this.showToast('Order cancelled successfully.'); // Show success message
      },
      async (error) => {
        console.error('Error cancelling order:', error);
        await this.showToast('Failed to cancel order. Please try again.'); // Show error message
      }
    );
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