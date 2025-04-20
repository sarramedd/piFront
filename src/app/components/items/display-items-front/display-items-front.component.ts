import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from 'src/app/services/item/item.service';

@Component({
  selector: 'app-display-items-front',
  templateUrl: './display-items-front.component.html',
  styleUrls: ['./display-items-front.component.css']
})
export class DisplayItemsFrontComponent implements OnInit {
  constructor( private serviceItem : ItemService,
                private router : Router,
                 private toastr: ToastrService
                
   ) { }
   selectedCategory: string = ''; // la catégorie choisie
   categories: string[] = []; // toutes les catégories uniques
   sortOrder: string = ''; 
  items: any[] = [];
  idUser: number = 2;
  ngOnInit(): void {
  this.loadItems();
  }
  groupItems(items: any[], groupSize: number): any[][] {
    const groups = [];
    for (let i = 0; i < items.length; i += groupSize) {
      groups.push(items.slice(i, i + groupSize));
    }
    return groups;
  }
  
  itemsFiltered() {
    let filteredItems = this.items;
  
    const role = 'USER'; // Tu peux le rendre dynamique si besoin
  
    // Si le rôle est USER, ne montrer que les items acceptés
    if (role === 'USER') {
      filteredItems = filteredItems.filter(item => item.statusItem === 'ACCEPTED');
    }
  
    // Filtrer par catégorie
    if (this.selectedCategory) {
      filteredItems = filteredItems.filter(item => item.categoryType === this.selectedCategory);
    }
  
    // Trier par prix
    if (this.sortOrder === 'asc') {
      filteredItems = filteredItems.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'desc') {
      filteredItems = filteredItems.sort((a, b) => b.price - a.price);
    }
  
    return filteredItems;
  }
  
  
  loadItems() {
    this.serviceItem.getAllitems().subscribe(
      (response: any) => {
        this.items = response;
        // Extraire les catégories uniques pour la combobox
        const allCategories = response.map((item: any) => item.categoryType) as string[];
        this.categories = [...new Set(allCategories)];
        },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  
  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.serviceItem.deleteItem(id).subscribe(
        () => {
          this.loadItems();
          this.success('Item deleted successfully');
        },
        (error) => {
          console.error('Error deleting item:', error);
        }
      );
    }
  }
  success(message: string): void {
    this.toastr.success(message, "Success");
  }
  addItem() {
   this.router.navigate(['/addItemFront']);
  }
  


}
