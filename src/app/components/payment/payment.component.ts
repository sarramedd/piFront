import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StripeService } from 'src/app/services/stripe.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  stripe: any;
  elements: any;
  card: any;
  contractId: number | null = null;

  constructor(
    private stripeService: StripeService,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.contractId = +params.get('contractId')!;
    });

    this.stripeService.getStripe().then((stripe) => {
      this.stripe = stripe;
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
    });
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const amount = 50; // Exemple de montant, vous pouvez le rendre dynamique

    if (this.contractId === null) {
      console.error('Contract ID is missing');
      return;
    }

    this.paymentService.createPaymentIntent(this.contractId, amount).subscribe({
      next: async (response) => {
        const clientSecret = response.clientSecret;
        const result = await this.stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: this.card }
        });

        if (result.error) {
          console.error('Payment error:', result.error.message);
        } else if (result.paymentIntent.status === 'succeeded') {
          this.paymentService.confirmPayment(result.paymentIntent.id, 'succeeded').subscribe();
        } else {
          this.paymentService.confirmPayment(result.paymentIntent.id, 'failed').subscribe();
        }
      },
      error: (err) => {
        console.error('Error with API:', err);
      }
    });
  }
}
