import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  paymentForm!: FormGroup;
  contractId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.contractId = Number(this.route.snapshot.paramMap.get('contractId'));

    this.paymentForm = this.fb.group({
      amount: [0, Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      cardNumber: ['', [Validators.required, Validators.minLength(16)]],
      cardHolder: ['', Validators.required],
      expiry: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  submitPayment(): void {
    if (this.paymentForm.valid) {
      const paymentData = {
        ...this.paymentForm.value,
        status: 'PENDING'
      };

      this.paymentService.addPayment(this.contractId, paymentData).subscribe({
        next: (res) => {
          alert('✅ Paiement enregistré avec succès !');
        },
        error: (err) => {
          console.error(err);
          alert('❌ Une erreur est survenue lors du paiement.');
        }
      });
    }
  }
}
