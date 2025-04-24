// src/app/services/stripe.service.ts
import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise = loadStripe('pk_test_51RBDOGQLnOgS0BJsaxhAaKAdMlfWTfuT1mvuSyNs2YAgWXbwkH0mskuYhczU0hjdBWnDk7RREVN3Vkd1uXNM5cP800YjtnJreT'); // Remplace par ta clé publique Stripe

  getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }
}
