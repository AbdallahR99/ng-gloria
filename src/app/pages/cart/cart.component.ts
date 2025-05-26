import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { CartItem } from '@app/core/models/cart-item.model';
import { FacadeService } from '@app/core/services/facade-service.service';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-cart',
  imports: [SHARED_MODULES],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'h-full max-md:bg-neutral-content',
  },
})
export class CartComponent {
  imagePath = environment.supabaseImages;
  facadeService = inject(FacadeService);
  isRemovingId = signal('');
  isUpdatingId = signal('');
  routes = APP_ROUTES;

  get isEn() {
    return this.facadeService.translatorService.isEn;
  }

  get cartCount() {
    return this.facadeService.cartService.cartCount;
  }

  cartItems = rxResource({
    loader: () => {
      return this.facadeService.cartService.get();
    },
  });

  cartSummary = rxResource({
    loader: () => {
      return this.facadeService.cartService.summary();
    },
  });

  removeItem(item: CartItem) {
    this.isRemovingId.set(item.id);
    this.facadeService.cartService
      .delete({
        productId: item.productId,
        color: item.color ? item.color : undefined,
        size: item.size ? item.size : undefined,
      })
      .subscribe({
        next: () => {
          this.cartItems.reload();
          this.cartSummary.reload();
          this.isRemovingId.set('');
        },
        error: (error) => {
          this.isRemovingId.set('');

          console.error('Error removing item from cart:', error);
        },
      });
  }

  updateQuantity(item: CartItem, quantity: number) {
    this.isUpdatingId.set(item.id);

    if (quantity <= 0) {
      this.removeItem(item);
      return;
    }
    this.facadeService.cartService
      .update({
        productId: item.productId,
        color: item.color ? item.color : undefined,
        size: item.size ? item.size : undefined,
        quantity,
      })
      .subscribe({
        next: () => {
          this.cartItems.reload();
          this.cartSummary.reload();
          this.isUpdatingId.set(item.id);
        },
        error: (error) => {
          this.isUpdatingId.set(item.id);

          console.error('Error updating item quantity in cart:', error);
        },
      });
  }

  increaseQuantity(item: CartItem) {
    this.updateQuantity(item, item.quantity + 1);
  }
  decreaseQuantity(item: CartItem) {
    this.updateQuantity(item, item.quantity - 1);
  }
}
