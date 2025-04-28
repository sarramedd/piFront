import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category/category.service';
import { ItemService } from 'src/app/services/item/item.service';
import { UploadService } from 'src/app/services/uploadImage/UploadService.service';
import { Item } from 'src/app/core/models/item';

@Component({
  selector: 'app-add-item-front',
  templateUrl: './add-item-front.component.html',
  styleUrls: ['./add-item-front.component.css']
})
export class AddItemFrontComponent implements OnInit {

  itemForm!: FormGroup;
  categoryTypes: any[] = [];  // Store categories fetched from the backend
  idUser: number = 2; // Assuming this is the logged-in user ID

  constructor(
    private categoryService: CategoryService,
    private itemService: ItemService,
    private router: Router,
    private uploadService: UploadService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Fetch categories when the component is initialized
    this.categoryService.getAllCategories().subscribe(
      (response) => {
        if (response && Array.isArray(response)) {
          this.categoryTypes = response;
        } else {
          console.error('Invalid category data:', response);
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );

    // Initialize the form
    this.itemForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(5)]),
      itemCondition: new FormControl('', [Validators.required]),
      availability: new FormControl(false, [Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      image: new FormControl(''),
      categoryType: new FormControl('', [Validators.required])  // Category form control
    });
  }

  onSubmit() {
    if (this.itemForm.valid) {
      const itemData = this.itemForm.value;
      
      // Get the selected category ID
      const categoryId = itemData.categoryType;

      this.ajouterImage(() => {
        // Once image is uploaded, create the item object with the image URL
        const newItem = {
          ...itemData,
          idUser: this.idUser, 
        };

        // Call the service to add the item with the image and category
        this.itemService.createItem(newItem, categoryId).subscribe({
          next: (response: Item) => {
            console.log('Item added successfully:', response);
            this.router.navigate(['/displayItems']);
            this.success('Item added successfully and you are waiting for admin approval');
          },
          error: (error: any) => {
            console.error('Error adding item:', error);
            this.error('Error adding item');
          }
        });
      });
    } else {
      console.log('Form is invalid');
    }
  }

  success(message: string): void {
    this.toastr.success(message, 'Success');
  }

  error(message: string): void {
    this.toastr.error(message, 'Error');
  }

  selectedImageFile: File | undefined;
  imageURL: string | undefined;

  onFileSelected(event: any) {
    this.selectedImageFile = event.target.files[0];
  }

  ajouterImage(callback: () => void) {
    if (this.selectedImageFile) {
      this.uploadService.uploadFile(this.selectedImageFile).subscribe(
        (response: any) => {
          console.log('Image uploaded successfully:', response);
          if (response && response.imageURL) {
            const itemData = this.itemForm.value;

            // Add the image URL to the item data
            itemData.image = response.imageURL;  // Update the image URL

            callback();  // Call the callback after adding the image
          } else {
            console.error('Error: Image URL not found in response.');
            callback();  // Call callback even if image URL is not found
          }
        },
        (error) => {
          console.error('Error uploading image:', error);
          callback();  // Call callback even if there's an error in uploading
        }
      );
    } else {
      console.error('No image selected');
      callback();  // Call the callback if no image is selected
    }
  }
}
