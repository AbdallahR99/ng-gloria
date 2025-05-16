import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CartItem } from './cart.service';

export interface PaymentResult {
  success: boolean;
  message: string;
  paymentId?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  pay(cart: CartItem[], paymentDetails: any): Observable<PaymentResult> {
    // Mock payment processing
    if (!cart.length) {
      return of({ success: false, message: 'Cart is empty.' }).pipe(delay(500));
    }
    // Simulate payment success
    return of({
      success: true,
      message: 'Payment successful!',
      paymentId: 'MOCK-' + Math.floor(Math.random() * 1000000),
    }).pipe(delay(1000));
  }
}
