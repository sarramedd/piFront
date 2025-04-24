import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contract } from 'src/app/core/models/contract';
import { ContractService } from 'src/app/services/contract.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { User } from 'src/app/core/models/user.model';

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
}
