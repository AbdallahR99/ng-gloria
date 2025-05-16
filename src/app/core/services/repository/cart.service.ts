import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Product } from '../../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart$ = new BehaviorSubject<CartItem[]>([]);

  getCart(): Observable<CartItem[]> {
    return this.cart$.asObservable().pipe(delay(100));
  }

  addToCart(product: Product, quantity = 1): Observable<CartItem[]> {
    const cart = this.cart$.value;
    const idx = cart.findIndex((item) => item.product.id === product.id);
    if (idx > -1) {
      cart[idx].quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    this.cart$.next([...cart]);
    return of(this.cart$.value).pipe(delay(100));
  }

  removeFromCart(productId: number): Observable<CartItem[]> {
    const cart = this.cart$.value.filter(
      (item) => item.product.id !== productId
    );
    this.cart$.next(cart);
    return of(cart).pipe(delay(100));
  }

  updateQuantity(productId: number, quantity: number): Observable<CartItem[]> {
    const cart = this.cart$.value.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    this.cart$.next(cart);
    return of(cart).pipe(delay(100));
  }

  clearCart(): Observable<void> {
    this.cart$.next([]);
    return of(undefined).pipe(delay(100));
  }
}
