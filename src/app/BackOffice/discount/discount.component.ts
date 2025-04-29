import { Component, OnInit } from '@angular/core';
import { Discount } from 'src/app/core/models/discount';
import { Item } from 'src/app/core/models/item';
import { ItemListComponent } from '../items/item-list/item-list.component';
import { DiscountService } from 'src/app/services/discount.service';
import { ItemService } from 'src/app/services/item/item.service';



@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit {
  discounts: Discount[] = [];
  items: Item[] = [];
  today: string;
  newDiscount: Discount = {
    id: 0,
    name: '',
    code: '',
    percentage: 0,
    startDate: '',
    endDate: '',
    active: true,
    item_id: null,
    commandes: null
  };
  selectedItemId: number | null = null;
  loading: boolean = false;
  error: string | null = null;
  editingDiscount: Discount | null = null;
  searchTerm: string = '';
  filteredDiscounts: Discount[] = [];

  constructor(
    private discountService: DiscountService,
    private itemService: ItemService
  ) {
    const today = new Date();
    this.today = today.toISOString().split('T')[0];
    this.newDiscount.startDate = this.today;
    this.newDiscount.endDate = this.today;
  }

  ngOnInit(): void {
    this.loadDiscounts();
    this.loadItems();
  }

  loadDiscounts(): void {
    this.loading = true;
    this.error = null;
    this.discountService.getAllDiscounts().subscribe({
      next: (data) => {
        this.discounts = data;
        this.filterDiscounts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réductions:', err);
        this.error = 'Erreur lors du chargement des réductions';
        this.loading = false;
      }
    });
  } 

  loadItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (data: Item[]) => {
        this.items = data;
      },
      error: (err: any) => {
        console.error('Error fetching items:', err);
      }
    });
  }

  filterDiscounts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDiscounts = this.discounts;
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredDiscounts = this.discounts.filter(discount => 
      (discount.name?.toLowerCase() || '').includes(searchLower) ||
      (discount.code?.toLowerCase() || '').includes(searchLower) ||
      discount.percentage.toString().includes(searchLower)
    );
  }

  onSearch(): void {
    this.filterDiscounts();
  }

  getItemName(itemId: number | null): string {
    if (!itemId) return 'Aucun item';
    const item = this.items.find(i => i.id === itemId);
    return item ? item.name : 'Item non trouvé';
  }

  editDiscount(discount: Discount): void {
    this.editingDiscount = { ...discount };
    this.newDiscount = { ...discount };
    this.selectedItemId = discount.item_id;
  }

  cancelEdit(): void {
    this.editingDiscount = null;
    this.resetForm();
  }

  private validateDates(startDate: string | null, endDate: string | null): string | null {
    if (!startDate || !endDate) {
      return 'Les dates sont requises';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    if (start < today) {
      return 'La date de début ne peut pas être antérieure à aujourd\'hui';
    }

    if (end < start) {
      return 'La date de fin doit être postérieure à la date de début';
    }

    return null;
  }

  private validateDiscount(discount: Discount): string | null {
    // Validation des dates
    const dateError = this.validateDates(discount.startDate, discount.endDate);
    if (dateError) {
      return dateError;
    }

    // Validation de l'item
    if (!discount.item_id) {
      return 'Un item doit être sélectionné';
    }

    return null;
  }

  createDiscount(): void {
    if (!this.selectedItemId) {
      this.error = 'Veuillez sélectionner un item';
      return;
    }

    this.newDiscount.item_id = this.selectedItemId;
    this.loading = true;
    this.error = null;

    this.discountService.createDiscount(this.newDiscount).subscribe({
      next: (response) => {
        this.loadDiscounts();
        this.resetForm();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la création de la réduction:', err);
        this.error = 'Erreur lors de la création de la réduction';
        this.loading = false;
      }
    });
  }

  updateDiscount(discount: Discount): void {
    if (!this.selectedItemId) {
      this.error = 'Veuillez sélectionner un item';
      return;
    }

    // Validation du discount avant la mise à jour
    const validationError = this.validateDiscount(this.newDiscount);
    if (validationError) {
      this.error = validationError;
      return;
    }

    // Utiliser les valeurs de newDiscount pour la mise à jour
    const updatedDiscount: Discount = {
      ...discount,
      name: this.newDiscount.name,
      code: this.newDiscount.code,
      percentage: this.newDiscount.percentage,
      startDate: this.newDiscount.startDate,
      endDate: this.newDiscount.endDate,
      active: this.newDiscount.active,
      item_id: this.selectedItemId
    };

    this.loading = true;
    this.error = null;

    console.log('Mise à jour de la réduction:', updatedDiscount);

    this.discountService.updateDiscount(discount.id, updatedDiscount).subscribe({
      next: (response) => {
        console.log('Réponse du serveur:', response);
        this.loadDiscounts();
        this.resetForm();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur détaillée lors de la mise à jour:', err);
        this.error = 'Erreur lors de la mise à jour de la réduction';
        this.loading = false;
      }
    });
  }

  deleteDiscount(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réduction ?')) {
      this.loading = true;
      this.error = null;

      this.discountService.deleteDiscount(id).subscribe({
        next: () => {
          this.loadDiscounts();
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la réduction:', err);
          this.error = 'Erreur lors de la suppression de la réduction';
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.newDiscount = {
      id: 0,
      name: '',
      code: '',
      percentage: 0,
      startDate: this.today,
      endDate: this.today,
      active: true,
      item_id: null,
      commandes: null
    };
    this.selectedItemId = null;
    this.editingDiscount = null;
    this.error = null;
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (e) {
      return '-';
    }
  }
} 