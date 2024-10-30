import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Order {
  _id: string;
  service: Service[]; // Assuming this is an array of Service
  client: string; // Assuming client is represented as a string (user ID)
  status: string;
}

export interface Service {
  _id: string;
  user: {
    FirstName: string;
    LastName: string;
    Username: string;
    Gouvernerat: string;
    Adresse: string;
  }[]; // Adjust based on your actual user structure
  diplome: string;
  description: string;
}
@Injectable({
  providedIn: 'root'
})
export class OrderService {
 private apiUrl = 'http://localhost:5000/commande';
  constructor(private http: HttpClient) { }

  addOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addcommande`, orderData);
  }

  getAllOrders(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  getOrdersByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`); 
  }

  getConfirmedOrders(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getconfirmed/${userId}`);
  }

  getPendingOrdersByEmployee(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/pending/${userId}`);
  }

  confirmOrder(orderId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/confirm/${orderId}`, {});
  }

  rejectOrder(orderId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/reject/${orderId}`, {});
  }

}
