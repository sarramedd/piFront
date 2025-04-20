import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from 'src/app/services/item/item.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  constructor( private serviceItem : ItemService,
                private router : Router,
                
   ) { }
  items: any[] = [];
  selectedCategory: string = ''; // la catégorie choisie
  categories: string[] = []; // toutes les catégories uniques
  
  ngOnInit(): void {
  this.loadItems();
  }
  itemsFiltered() {
    if (!this.selectedCategory) return this.items;
    return this.items.filter(item => item.categoryType === this.selectedCategory);
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
        },
        (error) => {
          console.error('Error deleting item:', error);
        }
      );
    }
  }
  addItem() {
   this.router.navigate(['/dashboard/addItem']);
  }
 
  
  updateItemStatus(id: number, statusItem: string) {
    this.serviceItem.updateStatusItem(id, statusItem).subscribe(
      () => {
        this.loadItems();
      },
      (error) => {
        console.error('Error updating item status:', error);
      }
    );
  }


  toggleStatus(item: any) {
    if (item.statusItem === 'PENDING' || item.statusItem === 'REFUSED') {
      this.updateItemStatus(item.id, 'ACCEPTED');
    } else if (item.statusItem === 'ACCEPTED') {
      this.updateItemStatus(item.id, 'REFUSED');
    }
  }
  
  getButtonLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'Approve';
      case 'ACCEPTED': return 'Reject';
      case 'REFUSED': return 'Approve';
      default: return 'Change Status';
    }
  }
  
  getButtonClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'btn-primary';
      case 'ACCEPTED': return 'btn-danger';
      case 'REFUSED': return 'btn-success';
      default: return 'btn-secondary';
    }
  }
  

}
