import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
interface Order {
  _id: string;
  service: Service[]; // Ensure this is typed as an array
  client: string; // Or whatever type it is
  status: string;
}

interface Service {
  _id: string;
  user: any[]; // Adjust this based on your user structure
  diplome: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:5000/service'; 

  constructor(private http: HttpClient) { }

  
  addService(serviceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addservice`, serviceData);
  }
  getServicesByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5000/category/categories/${categoryId}`);
  }
}
