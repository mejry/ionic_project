import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService, Category } from '../service/category.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  cards: any = [];
  isModalOpen = false; 
  newCategory = { id: '', name: '', description: '' }; 

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories(); 
  }

 
  openAddCategoryModal() {
    this.isModalOpen = true;
  }

  dismissModal() {
    this.isModalOpen = false;
  }

  addCategory() {
    if (this.newCategory.name.trim()) {
     
      this.newCategory.id = Date.now().toString(); 
      
      this.categoryService.addCategory(this.newCategory).subscribe({
        next: (response) => {
          console.log('Category added:', response);
          this.newCategory = { id: '', name: '', description: '' }; 
          this.dismissModal(); 
          this.loadCategories(); 
        },
        error: (error) => {
          console.error('Error adding category:', error);
        }
      });
    }
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        console.log("Fetched categories:", categories);
        this.cards = categories; 
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userid');
    console.log('User logged out');
    this.router.navigate(['/login']); // Adjust the route based on your app's routing
  }
}
