import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthServiceService } from 'src/app/services/auth-service.service';
import { UserService } from 'src/app/services/user.service';
import { Commande } from 'src/app/core/models/commande';
import { Discount } from 'src/app/core/models/discount';
import { User } from 'src/app/core/models/user.model';
import { CommandeService } from 'src/app/services/commande.service';
import { DiscountService } from 'src/app/services/discount.service';
import { Item } from 'src/app/core/models/item';
import { ItemService } from 'src/app/services/item/item.service';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  commandes: Commande[] = [];
  currentUser: User | null = null;
  error: string | null = null;
  item: Item | null = null;
  activeDiscount: Discount | null = null;
  discountedPrice: number = 0;
  orderDescription: string = '';
  loading: boolean = false;
  currentDateTime: string = '';

  constructor(
    private commandeService: CommandeService,
    private userService: UserService,
    private authService: AuthServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private itemService: ItemService,
    private discountService: DiscountService
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000); // Mise à jour chaque seconde
    this.loadCommandes();
    this.loadCurrentUser();
    this.loadItemDetails();
  }

  updateDateTime(): void {
    const now = new Date();
    this.currentDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
  }

  loadItemDetails(): void {
    const itemId = this.route.snapshot.params['id'];
    if (itemId) {
      this.itemService.getItemById(itemId).subscribe({
        next: (item) => {
          this.item = item;
          this.loadActiveDiscount();
        },
        error: (error) => {
          console.error('Erreur lors du chargement de l\'item:', error);
          this.error = 'Erreur lors du chargement des détails de l\'item';
        }
      });
    }
  }

  loadActiveDiscount(): void {
    if (this.item) {
      const token = this.authService.getToken();
      if (!token) {
        console.error('Pas de token disponible');
        return;
      }
      
      this.discountService.getActiveDiscountsForItem(this.item.id, true).subscribe({
        next: (discounts: Discount[]) => {
          this.activeDiscount = discounts.length > 0 ? discounts[0] : null;
          this.calculateDiscountedPrice();
        },
        error: (error: Error) => {
          console.error('Erreur lors du chargement de la réduction:', error);
        }
      });
    }
  }

  calculateDiscountedPrice(): void {
    if (this.item && this.activeDiscount) {
      const reduction = (this.item.price * this.activeDiscount.percentage) / 100;
      this.discountedPrice = this.item.price - reduction;
    } else if (this.item) {
      this.discountedPrice = this.item.price;
    }
  }

  createOrder(): void {
    if (!this.item) {
      this.error = 'Aucun item sélectionné';
      return;
    }

    this.loading = true;
    const commande: Partial<Commande> = {
      itemId: this.item.id,
      description: this.orderDescription,
      totalPrice: this.discountedPrice,
      status: 'EN_ATTENTE'
    };

    this.commandeService.createCommande(commande as Commande).subscribe({
      next: (response) => {
        this.loading = false;
        if (response && response.id) {
          this.router.navigate(['/contract', response.id]);
        } else {
          this.router.navigate(['/commandes']);
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Erreur lors de la création de la commande:', error);
        this.error = 'Erreur lors de la création de la commande';
      }
    });
  }

  loadCurrentUser(): void {
    const tokenData = this.authService.decodeToken();
    if (!tokenData || !tokenData.email) {
      console.error('Aucun email trouvé dans le token');
      return;
    }
  
    // Appel au service UserService pour récupérer l'utilisateur par email
    this.userService.getUserByEmail(tokenData.email).subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error: Error) => {
        console.error('Erreur lors du chargement de l\'utilisateur actuel:', error);
        this.error = 'Erreur lors du chargement de l\'utilisateur';
      }
    });
  }
  
  loadCommandes(): void {
    this.commandeService.getAllCommandes().subscribe({
      next: (commandes) => {
        this.commandes = commandes;
      },
      error: (error: Error) => {
        console.error('Error loading commandes:', error);
      }
    });
  }

  confirmerCommande(id: number): void {
    this.commandeService.confirmCommande(id).subscribe({
      next: () => {
        this.loadCommandes();
      },
      error: (error: Error) => {
        console.error('Error confirming commande:', error);
      }
    });
  }

  rejeterCommande(id: number): void {
    this.commandeService.rejectCommande(id).subscribe({
      next: () => {
        this.loadCommandes();
      },
      error: (error: Error) => {
        console.error('Error rejecting commande:', error);
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.getRoleFromToken() === 'ADMIN';
  }
}
