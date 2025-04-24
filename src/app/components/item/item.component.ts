import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/services/item.service';
import { CommandeService } from 'src/app/services/commande.service';
import { DiscountService } from 'src/app/services/discount.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Item } from 'src/app/core/models/item';
import { Commande } from 'src/app/core/models/commande';
import { Discount } from 'src/app/core/models/discount';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  items: Item[] = [];
  activeDiscounts: { [key: number]: Discount } = {}; // Map des discounts actifs par item
  borrowerId: number = 2; // À remplacer par l'ID de l'utilisateur connecté

  constructor(
    private itemService: ItemService,
    private commandeService: CommandeService,
    private discountService: DiscountService,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.itemService.getAllItems().subscribe({
      next: (items: Item[]) => {
        this.items = items;
        // Charger les discounts actifs pour chaque item
        items.forEach(item => {
          this.loadActiveDiscount(item.id);
        });
      },
      error: (err) => {
        console.error('Error loading items:', err);
      }
    });
  }

  loadActiveDiscount(itemId: number) {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    this.discountService.getActiveDiscountsForItem(itemId, token).subscribe({
      next: (discounts: Discount[]) => {
        if (discounts && discounts.length > 0) {
          this.activeDiscounts[itemId] = discounts[0]; // On prend le premier discount actif
        }
      },
      error: (err) => {
        // On ignore simplement l'erreur 403 et on continue avec le prix normal
        console.log('Note: Discount non disponible pour item:', itemId);
      }
    });
  }

  getDiscountedPrice(item: Item): number {
    const discount = this.activeDiscounts[item.id];
    if (discount) {
      return item.price * (1 - discount.percentage / 100);
    }
    return item.price;
  }

  createOrder(item: Item) {
    // Naviguer vers le formulaire de commande avec l'ID de l'item
    this.router.navigate(['/commande', item.id]);
  }
}
