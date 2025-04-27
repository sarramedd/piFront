import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { ContractService } from 'src/app/services/contract.service';
import { Item } from 'src/app/core/models/item';
import { Contract } from 'src/app/core/models/contract';
import { User } from '../../core/models/user.model'; // Importer le modèle User
import { Router } from '@angular/router';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  items: Item[] = [];
  selectedItem!: Item;
  borrowerId: number = 2; // ID du borrower (peut être récupéré dynamiquement)
  ownerId: number = 1;

  constructor(
    private itemService: ItemService,
    private contractService: ContractService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.itemService.getAllItems().subscribe({
      next: (items) => {
        console.log('Received items:', items);
        this.items = items;
      },
      error: (err) => {
        console.error('Error loading items:', err);
      }
    });
  }


  
  
  selectItem(item: Item) {
    this.selectedItem = item;
    console.log("Item sélectionné :", this.selectedItem);
  }
}
