import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  categoryForm!: FormGroup;

  categoryTypes = ['ELECTRONICS', 'FURNITURE', 'CLOTHING', 'BOOKS', 'OTHER'];

 constructor(private http:HttpClient,
            private router:Router,
            private serviceCategory: CategoryService, 
 ){}
  ngOnInit(): void {
    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      // categoryType: new FormControl('', Validators.required),
      description: new FormControl('', [Validators.required, Validators.minLength(5)]),
      // image: new FormControl('', [Validators.required]),
    });
  }

  addCategory() {
    const categoryData = this.categoryForm.value;
  
    this.serviceCategory.addCategory(categoryData).subscribe(
      (response) => {
        console.log('Category added successfully:', response);
        this.router.navigate(['/dashboard/listCategorie']);
      },
      (error) => {
        console.error('Error adding category:', error);
      }
    );
  }
  
}
