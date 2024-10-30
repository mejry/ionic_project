import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CategoryService , Category } from '../service/category.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  cards:any = [];
  isModalOpen = false;
  newCategory = { name: '', description: '' };


  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private router : Router
  ) {
   
  }

  ngOnInit() {
    this.loadCategories();
  }
 

  
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        console.log("helooo");
        
        console.log(categories);
        
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
    this.router.navigate(['/login']); 
  }
}


