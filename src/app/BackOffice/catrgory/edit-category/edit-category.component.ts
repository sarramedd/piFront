import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  categoryTypes = ['ELECTRONICS', 'FURNITURE', 'CLOTHING', 'BOOKS', 'OTHER'];
  categoryId!: number;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch the category ID from route parameters
    this.categoryId = +this.route.snapshot.paramMap.get('id')!;

    // Initialize the form
    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      // categoryType: new FormControl('', Validators.required),
      description: new FormControl('', [Validators.required, Validators.minLength(5)]),
      // image: new FormControl(''),
    });

    // Fetch category data and populate the form
    this.categoryService.getCategoryById(this.categoryId).subscribe(
      (category) => {
        this.categoryForm.patchValue(category); // Pre-fill the form
      },
      (error) => {
        console.error('Error fetching category:', error);
      }
    );
  }

  updateCategory() {
    if (this.categoryForm.valid) {
      this.categoryService.updateCategory(this.categoryId, this.categoryForm.value).subscribe(
        (response) => {
          console.log('Category updated successfully:', response);
          this.router.navigate(['/dashboard/listCategorie']); // Navigate back to the category list
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    }
  }
}
