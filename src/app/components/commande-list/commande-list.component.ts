import { Component, OnInit } from '@angular/core';
import { CommandeService } from 'src/app/services/commande.service';
import { Commande } from 'src/app/core/models/commande';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-commande-list',
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.css']
})
export class CommandeListComponent implements OnInit {
  commandes: Commande[] = [];
  loading: boolean = false;
  error: string | null = null;
  searchTerm: string = '';
  filteredCommandes: Commande[] = [];

  constructor(
    private commandeService: CommandeService,
    private authService: AuthServiceService
  ) { }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est authentifié
    const token = this.authService.getToken();
    if (!token) {
      this.error = 'Vous devez être connecté pour voir les commandes';
      return;
    }
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.loading = true;
    this.error = null;
    console.log('Début du chargement des commandes...');
    
    this.commandeService.getAllCommandes().subscribe({
      next: (data: Commande[]) => {
        console.log('Commandes reçues:', data);
        this.commandes = data;
        this.filterCommandes();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erreur détaillée:', {
          message: err.message,
          status: err.status,
          statusText: err.statusText,
          error: err.error
        });
        this.error = `Erreur lors du chargement des commandes: ${err.status} - ${err.statusText}`;
        this.loading = false;
      }
    });
  }

  filterCommandes(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCommandes = this.commandes;
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredCommandes = this.commandes.filter(commande => 
      commande.id?.toString().includes(searchLower) ||
      commande.status?.toLowerCase().includes(searchLower) ||
      commande.description?.toLowerCase().includes(searchLower) ||
      commande.item?.name?.toLowerCase().includes(searchLower) ||
      commande.item?.category?.toLowerCase().includes(searchLower) ||
      commande.totalPrice?.toString().includes(searchLower)
    );
  }

  onSearch(): void {
    this.filterCommandes();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'en_attente':
        return 'bg-warning';
      case 'confirmee':
        return 'bg-success';
      case 'annulee':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status.toLowerCase()) {
      case 'en_attente':
        return 'En attente';
      case 'confirmee':
        return 'Confirmée';
      case 'annulee':
        return 'Annulée';
      default:
        return status;
    }
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

  confirmCommande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir confirmer cette commande ?')) {
      this.loading = true;
      this.error = null;

      this.commandeService.confirmCommande(id).subscribe({
        next: () => {
          this.loadCommandes();
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Erreur lors de la confirmation de la commande:', err);
          this.error = 'Erreur lors de la confirmation de la commande';
          this.loading = false;
        }
      });
    }
  }

  cancelCommande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      this.loading = true;
      this.error = null;

      this.commandeService.cancelCommande(id).subscribe({
        next: () => {
          this.loadCommandes();
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Erreur lors de l\'annulation de la commande:', err);
          this.error = 'Erreur lors de l\'annulation de la commande';
          this.loading = false;
        }
      });
    }
  }
} 