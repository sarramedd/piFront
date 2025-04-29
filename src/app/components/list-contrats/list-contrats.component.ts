import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Contract } from '../../core/models/contract';
import { ContractService } from '../../services/contract.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-contrats',
  templateUrl: './list-contrats.component.html',
  styleUrls: [
    './list-contrats.component.css',
    '../../../assets/bootstrap-template/css/style.css',
    '../../../assets/bootstrap-template/vendors/mdi/css/materialdesignicons.min.css',
    '../../../assets/bootstrap-template/vendors/font-awesome/css/font-awesome.min.css',
    '../../../assets/bootstrap-template/vendors/css/vendor.bundle.base.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class ListContratsComponent implements OnInit {
  contracts: Contract[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  filteredContracts: Contract[] = [];
  displayedContracts: Contract[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private contractService: ContractService, private router: Router) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.isLoading = true;
    this.contractService.getAllContracts().subscribe({
      next: (data) => {
        this.contracts = data;
        console.log('Contrats chargés:', this.contracts);

        // Charger les informations du propriétaire et du locataire pour chaque contrat
        this.contracts.forEach(contract => {
          forkJoin({
            owner: this.contractService.getOwnerByContract(contract.id),
            borrower: this.contractService.getBorrowerByContract(contract.id)
          }).subscribe({
            next: ({ owner, borrower }) => {
              contract.owner = owner;
              contract.borrower = borrower;
            },
            error: (error) => {
              console.error(`Erreur lors du chargement des utilisateurs pour le contrat ${contract.id}:`, error);
            }
          });
        });

        this.filteredContracts = this.contracts;
        this.applyPagination();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des contrats';
        console.error('Erreur lors du chargement des contrats:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.searchTerm) {
      this.filteredContracts = this.contracts.filter(contract =>
        contract.terms.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contract.owner?.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contract.borrower?.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredContracts = this.contracts;
    }
    this.applyPagination(); // Appliquer la pagination après le filtrage
  }

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedContracts = this.filteredContracts.slice(startIndex, endIndex);
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.filteredContracts.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getPages().length) {
      this.currentPage = page;
      this.applyPagination();
    }
  }

  // Nouvelle méthode pour rediriger vers la page de détails du contrat
  goToContractDetails(contractId: number): void {
    this.router.navigate(['/contract-details', contractId]);
  }
}
