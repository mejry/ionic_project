import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

 
  private apiUrl = 'http://localhost:5000/user';

  constructor(private http: HttpClient) { 
   
  }

 
  signup(userData: any): Observable<any> {
    const url = `${this.apiUrl}/signup`;

    console.log(userData);
    
    return this.http.post(url, userData);
  }

  login(credentials: { Email: string, Password: string }): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, credentials);
  }

  confirmCode(code: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/confirm/${code}`);
  }
}
