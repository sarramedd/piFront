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

  createNewContract(item: Item) {
    if (!item) {
      console.error("Erreur : Aucun item sélectionné !");
      return;
    }
  
    const contract: Contract = {
      id: 0,
      startDate: new Date(),
      endDate: new Date(),
      terms: "Le locataire doit restituer l'objet en bon état.",
      ownerSignature: "",
      borrowerSignature: "",
      borrower: { id: this.borrowerId, name: "borrower" } as User,
      owner: { id: this.ownerId, name: item.owner?.name } as User,
      details: `Nom: ${item.name}, 
                Propriétaire: ${item.owner?.name}, 
                Prix: ${item.price}€, 
                Description: ${item.description}`
    };
  
    this.contractService.createContract(this.borrowerId, this.ownerId, contract).subscribe({
      next: (response) => {
        console.log("Contrat créé avec succès", response);
        if (response && response.id) {
          console.log("L'ID du contrat est :", response.id);
          // Navigation avec l'ID dans l'URL
          this.router.navigate(['/contract', response.id]);
        } else {
          console.error("L'ID du contrat est manquant dans la réponse");
        }
      },
      error: (err) => {
        console.error("Erreur lors de la création du contrat", err);
      }
    });
  }
  
  
  selectItem(item: Item) {
    this.selectedItem = item;
    console.log("Item sélectionné :", this.selectedItem);
  }
}
