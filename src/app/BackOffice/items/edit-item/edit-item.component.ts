import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';
import { ItemService } from 'src/app/services/item/item.service';
import { UploadService } from 'src/app/services/uploadImage/UploadService.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {
  itemForm!: FormGroup;
  itemId!: number;
  categoryTypes: any[] = [];
  item: any;
  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private router: Router,
    private uploadService: UploadService,
  ) {}

  ngOnInit(): void {
    this.itemId = +this.route.snapshot.paramMap.get('id')!;

    this.itemForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(5)]),
      itemCondition: new FormControl('', [Validators.required]),
      availability: new FormControl(false, [Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      image: new FormControl(''),
      categoryType: new FormControl('', [Validators.required])
    });

    // Charger les catégories
    this.categoryService.getAllCategories().subscribe(
      (response:any) => {
        this.categoryTypes = response;
      },
      (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    );

    // Charger l'item à modifier
    this.itemService.getItemById(this.itemId).subscribe(
      (item: any) => {
        this.item = item;
        this.itemForm.patchValue({
          name: item.name,
          description: item.description,
          itemCondition: item.itemCondition,
          availability: item.availability,
          price: item.price,
          image: item.image,
          categoryType: item.categoryType
        });
        this.imageURL = item.image;  // Set the image URL for preview
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'item:', error);
      }
    );
    
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
            // 🔥 Met à jour le champ image dans le formulaire
            this.itemForm.patchValue({ image: response.imageURL });
            console.log('Image mise à jour dans le formulaire :', this.itemForm.value.image);
          }
          callback(); // on continue après
        },
        (error) => {
          console.error('Erreur lors de l\'upload :', error);
          callback();
        }
      );
    } else {
      // Aucune image sélectionnée => garder l'ancienne
      console.log('Aucune image sélectionnée, on garde l\'image actuelle');
      callback();
    }
  }
  
  
  updateItem() {
    if (this.itemForm.valid) {
      this.ajouterImage(() => {
        const itemData = this.itemForm.value; 
        const categoryId = itemData.categoryType;
        console.log('ID de la catégorie sélectionnée :', categoryId);
        console.log('Formulaire prêt à être envoyé :', itemData);
  
        this.itemService.updateItem(this.itemId, itemData, categoryId).subscribe(
          (response) => {
            console.log('Item mis à jour avec succès:', response);
            this.router.navigate(['/dashboard/listItems']);
          },
          (error) => {
            console.error('Erreur lors de la mise à jour de l\'item:', error);
          }
        );
      });
    }
  }
  
}
