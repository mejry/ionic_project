import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { ServiceService } from '../service/service.service'; 
import { OrderService } from '../service/order.service';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute to get route params
import { AuthentificationService } from '../service/authentification.service';

@Component({
  selector: 'app-add-service',
  templateUrl: 'add-service.page.html',
  styleUrls: ['add-service.page.scss'],
})
export class AddServicePage implements OnInit {
  serviceForm: FormGroup; 
  services: any[] = []; 
  orders: any[] = []; 
  isModalOpen = false; 
  serviceData = { diplome: '', description: '' }; 
  categoryId: any | null; 

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private serviceService: ServiceService, 
    private route: ActivatedRoute ,
    private orderService: OrderService,
    private authService: AuthentificationService
  ) {
    
    this.serviceForm = this.formBuilder.group({
      diplome: ['', Validators.required], 
      description: ['', Validators.required], 
    });
  }

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.loadServices();
  }

  loadServices() {
    if (this.categoryId) {
      this.serviceService.getServicesByCategory(this.categoryId).subscribe((response: any) => {
        console.log('Fetched services:', response);
  
        
        if (response && Array.isArray(response.service)) {
          this.services = response.service; 
        } else {
          console.error('Fetched services is not an array or is undefined:', response);
          this.presentToast('Failed to load services.'); 
        }
      }, (error) => {
        console.error('Error loading services:', error); 
        this.presentToast('Failed to load services.'); 
      });
    }
  }
  

  
  async addService() {
    const userId = localStorage.getItem('userid'); 
    console.log(userId);
    
    const serviceData = {
      userId: userId || '',
      ...this.serviceData,
      categoryId:this.categoryId 
    };
    console.log(serviceData);
    
    try {
      const response = await this.serviceService.addService(serviceData).toPromise();
      this.services.push(response); 
      this.serviceForm.reset(); 
      this.serviceData = { diplome: '', description: '' }; 
      this.presentToast('Service added successfully!'); 
      this.dismissModal(); 
    } catch (error) {
      console.error('Error adding service:', error); 
      this.presentToast('Failed to add service. Please try again.'); 
    }
  }

  openAddServiceModal() {
    this.isModalOpen = true;
  }

  dismissModal() {
    this.isModalOpen = false; 
    this.serviceForm.reset(); 
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present(); 
  }

  commander(service: any) {
    const userId = localStorage.getItem('userid'); 
    const orderData = {
      service: service._id, 
      client: userId,
      status: 'Pending', 
    };

    this.orderService.addOrder(orderData).subscribe(
      (response) => {
        console.log('Order placed successfully:', response);
        this.presentToast('Order placed successfully!');
       
      },
      (error) => {
        console.error('Error placing order:', error);
        this.presentToast('Failed to place order. Please try again.');
      }
    );
  }

  

  isUserAdminOrEmployee(): boolean {
    const role = localStorage.getItem('role');   
    return role === 'admin' || role === 'employee';
  }
  
  isUserAdmin(): boolean {
    const role = localStorage.getItem('role'); 
    return role === 'admin' ;
  }
}
