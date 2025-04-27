import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contract } from 'src/app/core/models/contract';
import { ContractService } from 'src/app/services/contract.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { User } from 'src/app/core/models/user.model';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-contract-affichage',
  templateUrl: './contractAffichage.component.html',
  styleUrls: ['./contractAffichage.component.css']
})
export class ContractAffichageComponent implements OnInit {

  user!: User;
  contracts: Contract[] = [];
  currentUserId!: number;  // ID de l'utilisateur connecté

  constructor(
    private contractService: ContractService,
    private paymentService: PaymentService,
    private authService: AuthServiceService,  // Injecte le service d'authentification
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload JWT :', payload);
      this.user = payload;
    }
    this.contractService.getContractsByUserId(this.user.id).subscribe({
      next: data => this.contracts = data,
      error: err => console.error(err)
    });
  }

  goToContractDetails(contractId: number): void {
    this.router.navigate(['/contract-details', contractId]);
  }

  signContract(contractId: number): void {
    this.router.navigate([`/contract-sign/${contractId}`]); // Redirige vers la page de signature
  }

  isBorrower(contract: Contract): boolean {
    return this.user.role === 'BORROWER' ;
  }
  viewInvoice(contractId: number): void {
    // Appeler une méthode de ton service de paiement pour récupérer la facture
    this.paymentService.getInvoice(contractId).subscribe({
      next: (invoiceUrl) => {
        // Redirige vers l'URL de la facture
        window.open(invoiceUrl, '_blank');
      },
      error: (err) => console.error('Erreur lors de la récupération de la facture:', err)
    });
  }
}
