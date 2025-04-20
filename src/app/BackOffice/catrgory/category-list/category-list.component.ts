import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  constructor( private serviceCategory : CategoryService,
                private router : Router,
   ) { }
  categories: any[] = [];

  ngOnInit(): void {
  this.loadCategories();
  }

  loadCategories() {  
    this.serviceCategory.getAllCategories().subscribe(
      (response: any) => {
        this.categories = response;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.serviceCategory.deleteCategory(id).subscribe(
        () => {
          this.loadCategories();
        },
        (error) => {
          console.error('Error deleting category:', error);
        }
      );
    }
  }
  addCategory() {
   this.router.navigate(['/dashboard/addCategorie']);
  }
  


}
