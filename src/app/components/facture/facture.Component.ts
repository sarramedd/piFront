import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Payment } from 'src/app/core/models/payment';
import { User } from 'src/app/core/models/user.model';
import { ContractService } from 'src/app/services/contract.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class InvoiceDetailsComponent implements OnInit {
  payment!: Payment;
  loading: boolean = true;
  contractId!: number;
  borrower!:any;
  owner!:any;
  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private contractService :ContractService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.contractId = +id;
        this.fetchPayment(this.contractId);
      }
    });

    this.borrower= this.contractService.getBorrowerByContract(this.contractId) ;
    
  }

  fetchPayment(contractId: number): void {
    this.paymentService.getInvoice(contractId).subscribe({
      next: (data) => {
        this.payment = data;
        this.loading = false;
        console.log(this.payment);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du paiement:', err);
        this.loading = false;
      }
    });
     this.contractService.getBorrowerByContract(this.contractId).subscribe({
        next: (data) => {
            this.borrower = data;
            this.loading = false;
          },
    }) ;
    this.contractService.getOwnerByContract(this.contractId).subscribe({
        next: (data) => {
            this.owner = data;
            this.loading = false;
          },
    }) ;
}
}
