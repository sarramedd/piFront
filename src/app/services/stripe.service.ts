// src/app/services/stripe.service.ts

import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  stripePromise: Promise<any>;

  constructor() {
    // Remplace par ta clé publique Stripe
    this.stripePromise = loadStripe('pk_test_4eC39HqLyjWDarjtT1zdp7dc');
  }

  getStripe() {
    return this.stripePromise;
  }
}
