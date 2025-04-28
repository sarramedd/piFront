/*import { Component, OnInit } from '@angular/core';
import { CommandeService } from '../../services/commande.service';
import { DiscountService } from '../../services/discount.service';
import { AuthService } from '../../services/auth.service';
import { Item } from '../../core/models/item';
import { Commande } from '../../core/models/commande';
import { Discount } from '../../core/models/discount';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ItemService } from 'src/app/services/item/item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  items: Item[] = [];
  activeDiscounts: { [key: number]: Discount | null } = {};
  borrowerId: number = 3;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private itemService: ItemService,
    private commandeService: CommandeService,
    private discountService: DiscountService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token || !this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.errorMessage = '';

    this.itemService.getAllItems().subscribe({
      next: (data) => {
        this.items = data;
        this.errorMessage = '';
        // Initialize discounts as null for all items
        data.forEach(item => {
          this.activeDiscounts[item.id] = null;
          this.tryLoadDiscount(item.id);
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading items:', error);
        if (error.status === 401) {
          this.errorMessage = 'Session expired. Please log in again.';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Error loading items. Please try again later.';
        }
        this.loading = false;
      }
    });
  }

  tryLoadDiscount(itemId: number): void {
    const token = this.authService.getToken();
    if (!token) return;

    this.discountService.getActiveDiscountsForItem(itemId, true)
      .pipe(
        catchError(error => {
          console.log(`No active discount for item ${itemId}`);
          return of([]); // Return empty array in case of error
        })
      )
      .subscribe(discounts => {
        if (discounts && discounts.length > 0) {
          this.activeDiscounts[itemId] = discounts[0];
        } else {
          this.activeDiscounts[itemId] = null;
      }
    });
  }

  hasDiscount(itemId: number): boolean {
    return this.activeDiscounts[itemId] !== null && this.activeDiscounts[itemId] !== undefined;
  }

  getDiscountedPrice(item: Item): number {
    const discount = this.activeDiscounts[item.id];
    if (discount) {
      return item.price * (1 - discount.percentage / 100);
    }
    return item.price;
  }

  createOrder(item: Item): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/commande', item.id]);
  }
}
*/