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
  amount: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private stripeService: StripeService,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('contractId');
      this.contractId = id ? +id : null;
    });

    this.stripeService.getStripe().then((stripe) => {
      this.stripe = stripe;
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
    });
  }

async handleSubmit(event: Event) {
  event.preventDefault();
  this.errorMessage = null;
  
  if (!this.contractId) {
    this.errorMessage = 'Contract ID is missing';
    return;
  }

  this.isLoading = true;

  try {
    // 1. Créer l'intention de paiement
    const intentResponse = await this.paymentService.createPaymentIntent(this.contractId).toPromise();
    const clientSecret = intentResponse.clientSecret;
    this.amount = intentResponse.amount;

    if (!clientSecret) throw new Error('Échec de la création du paiement');

    // 2. Confirmer avec Stripe Elements
    const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: this.card }
    });

    if (error) throw error;
    if (!paymentIntent || paymentIntent.status !== 'succeeded') {
      throw new Error('Paiement non confirmé');
    }

    // 3. Confirmer avec notre backend
    await this.paymentService.confirmPayment(
      paymentIntent.id, 
      'succeeded',
      this.contractId
    ).toPromise();

    alert('✅ Paiement réussi ! Email envoyé.');

  } catch (error: unknown) {
    this.errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
  } finally {
    this.isLoading = false;
  }
}
}