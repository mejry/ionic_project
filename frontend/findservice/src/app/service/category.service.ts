import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

 
  private apiUrl = 'http://localhost:5000/category';

  constructor(private http: HttpClient) { }

 
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/addcategories`, category);
  }
  getAllCategories(): Observable<Category[]> {
    return this.http.get<any>(`${this.apiUrl}/getallcategories`);
  }
}
