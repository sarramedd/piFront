import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from 'src/app/services/item.service';
import { CommandeService } from 'src/app/services/commande.service';
import { DiscountService } from 'src/app/services/discount.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Item } from 'src/app/core/models/item';
import { Commande as CommandeModel } from 'src/app/core/models/commande';
import { Discount } from 'src/app/core/models/discount';

interface CommandeDisplay {
  id: number;
  date: Date;
  client: string;
  montant: number;
  status: 'en-cours' | 'terminee' | 'annulee';
}

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.scss']
})
export class CommandeComponent implements OnInit {
  itemId!: number;
  item!: Item;
  borrowerId: number = 2;
  orderDescription: string = '';
  loading: boolean = false;
  error: string | null = null;
  discountedPrice: number = 0;
  activeDiscount: Discount | null = null;
  commandes: CommandeDisplay[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  sortBy: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private commandeService: CommandeService,
    private discountService: DiscountService,
    private authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.itemId = +this.route.snapshot.paramMap.get('id')!;
    this.loadItem();
    this.loadCommandes();
  }

  loadCommandes(): void {
    // Simuler des données de commandes
    this.commandes = [
      {
        id: 1,
        date: new Date('2024-03-15'),
        client: 'Jean Dupont',
        montant: 150.00,
        status: 'en-cours'
      },
      {
        id: 2,
        date: new Date('2024-03-14'),
        client: 'Marie Martin',
        montant: 75.50,
        status: 'terminee'
      },
      {
        id: 3,
        date: new Date('2024-03-13'),
        client: 'Pierre Durand',
        montant: 200.00,
        status: 'annulee'
      }
    ];
  }

  loadItem(): void {
    this.loading = true;
    this.error = null;
    this.itemService.getItemById(this.itemId).subscribe({
      next: (item) => {
        this.item = item;
        this.discountedPrice = item.price;
        this.loadActiveDiscount();
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'item:', err);
        this.error = 'Erreur lors du chargement de l\'item';
        this.loading = false;
      }
    });
  }

  loadActiveDiscount(): void {
    const token = this.authService.getToken();
    if (!token) {
      console.log('User not authenticated - using original price');
      this.discountedPrice = this.item.price;
      this.loading = false;
      return;
    }

    this.discountService.getActiveDiscountsForItem(this.itemId, token).subscribe({
      next: (discounts) => {
        if (discounts && discounts.length > 0) {
          this.activeDiscount = discounts[0];
          this.discountedPrice = this.calculateDiscountedPrice(this.item.price, this.activeDiscount.percentage);
        } else {
          this.discountedPrice = this.item.price;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des discounts:', err);
        this.discountedPrice = this.item.price;
        this.loading = false;
      }
    });
  }

  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    const discountedPrice = originalPrice * (1 - discountPercentage / 100);
    return Number(discountedPrice.toFixed(2));
  }

  createOrder(): void {
    this.loading = true;
    this.error = null;

    const newCommande: CommandeModel = {
      item: this.item,
      itemId: this.item.id,
      borrowerId: this.borrowerId,
      description: this.orderDescription,
      totalPrice: this.discountedPrice,
      status: 'EN ATTENTE'
    };

    this.commandeService.createCommande(newCommande).subscribe({
      next: (response) => {
        console.log('Commande créée:', response);
        if (response.id) {
          this.router.navigate(['/contract', response.id]);
        } else {
          this.error = 'Erreur: ID de commande non reçu';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Erreur lors de la création de la commande:', err);
        this.error = 'Erreur lors de la création de la commande';
        this.loading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    // Implémenter la logique de recherche
  }

  onStatusFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusFilter = select.value;
    // Implémenter la logique de filtrage
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortBy = select.value;
    // Implémenter la logique de tri
  }

  viewCommande(id: number): void {
    console.log('Voir commande:', id);
  }

  editCommande(id: number): void {
    console.log('Éditer commande:', id);
  }

  deleteCommande(id: number): void {
    console.log('Supprimer commande:', id);
  }
}
