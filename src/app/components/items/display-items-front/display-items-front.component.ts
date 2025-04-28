import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Discount } from 'src/app/core/models/discount';
import { Item } from 'src/app/core/models/item';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CommandeService } from 'src/app/services/commande.service';
import { DiscountService } from 'src/app/services/discount.service';
import { ItemService } from 'src/app/services/item/item.service';

@Component({
  selector: 'app-display-items-front',
  templateUrl: './display-items-front.component.html',
  styleUrls: ['./display-items-front.component.css']
})
export class DisplayItemsFrontComponent implements OnInit {
  items: Item[] = [];
  filteredItems: Item[] = [];
  activeDiscounts: { [key: number]: Discount | null } = {};
  selectedCategory: string = '';
  categories: string[] = [];
  sortOrder: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  idUser: number = 2; // fixe pour l'instant, peut être dynamique ensuite

  constructor(
    private itemService: ItemService,
    private commandeService: CommandeService,
    private discountService: DiscountService,
    private authService: AuthServiceService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token || !this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.errorMessage = '';

    this.itemService.getAllItems().subscribe({
      next: (data: Item[]) => {
        this.items = data;
        this.filteredItems = [...this.items];

        data.forEach(item => {
          if (item.categoryType && !this.categories.includes(item.categoryType)) {
            this.categories.push(item.categoryType);
          }
          this.activeDiscounts[item.id] = null;
          this.tryLoadDiscount(item.id);
        });

        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching items:', error);
        this.errorMessage = 'Error loading items. Please try again later.';
        this.loading = false;
      }
    });
  }

  tryLoadDiscount(itemId: number): void {
    this.discountService.getActiveDiscountsForItem(itemId, true)
      .pipe(catchError(error => {
        console.log(`No active discount for item ${itemId}`);
        return of([]);
      }))
      .subscribe(discounts => {
        this.activeDiscounts[itemId] = discounts && discounts.length > 0 ? discounts[0] : null;
      });
  }

  hasDiscount(itemId: number): boolean {
    return this.activeDiscounts[itemId] !== null;
  }

  getDiscountedPrice(item: Item): number {
    const discount = this.activeDiscounts[item.id];
    if (discount) {
      return item.price * (1 - discount.percentage / 100);
    }
    return item.price;
  }

  groupItems(items: Item[], groupSize: number): Item[][] {
    const groups: Item[][] = [];
    for (let i = 0; i < items.length; i += groupSize) {
      groups.push(items.slice(i, i + groupSize));
    }
    return groups;
  }

  itemsFiltered(): Item[] {
    let filteredItems = [...this.items];

    const role = this.authService.getRoleFromToken();
    if (role === 'USER') {
      filteredItems = filteredItems.filter(item => item.statusItem === 'ACCEPTED');
    }

    if (this.selectedCategory) {
      filteredItems = filteredItems.filter(item => item.categoryType === this.selectedCategory);
    }

    if (this.sortOrder === 'asc') {
      filteredItems.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'desc') {
      filteredItems.sort((a, b) => b.price - a.price);
    }

    return filteredItems;
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.itemService.deleteItem(id).subscribe(
        () => {
          this.loadItems();
          this.success('Item deleted successfully');
        },
        (error) => {
          console.error('Error deleting item:', error);
          this.errorMessage = 'Failed to delete item.';
        }
      );
    }
  }

  createOrder(item: Item): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/commande', item.id]);
  }

  success(message: string): void {
    this.toastr.success(message, 'Success');
  }

  addItem(): void {
    this.router.navigate(['/addItemFront']);
  }
}
