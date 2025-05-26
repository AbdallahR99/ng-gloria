import { FacadeService } from '@app/core/services/facade-service.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { Address } from '@app/core/models/address.model';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { CartItem } from '@app/core/models/cart-item.model';
import { CartSummary } from '@app/core/models/cart-summary.model';
import { Router } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-checkout',
  imports: [SHARED_MODULES],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  facadeService = inject(FacadeService);
  router = inject(Router);
  routes = APP_ROUTES;
  imagePath = environment.supabaseImages;
  isLoading = signal(false);
  addresses = input<Address[]>();
  items = input<CartItem[]>();
  summary = input<CartSummary>();
  defaultAddress = computed(() => {
    return this.addresses()?.find((address) => address.isDefault);
  });

  selectedAddressId = model<string>(
    this.defaultAddress()?.id ?? (this.addresses() ?? [])[0]?.id
  ); // selected address id;
  userNote = model<string>('');
  selectedAddress = computed(() => {
    return this.addresses()?.find(
      (address) => address.id === this.selectedAddressId()
    );
  });

  init = effect(() => {
    this.selectedAddressId.set(
      this.defaultAddress()?.id ?? (this.addresses() ?? [])[0]?.id
    );
  });

  totalPrice = computed(() => {
    return (this.summary()?.total || 0) + (this.deliveryFee() || 0);
  });

  get isEn() {
    return this.facadeService.translatorService.isEn;
  }

  deliveryFee = computed(() => {
    return this.selectedAddress()?.deliveryFee;
  });

  checkOut() {
    if (!this.selectedAddressId()) {
      return;
    }
    this.isLoading.set(true);
    this.facadeService.ordersService
      .checkout({
        addressId: this.selectedAddressId(),
        note: this.userNote(),
      })
      .subscribe({
        next: (data) => {
          this.isLoading.set(false);
          this.router.navigate([APP_ROUTES.CheckoutSuccess], {
            state: { orderCode: data.orderCode },
          });
        },
        error: (error) => {
          console.error('Checkout error:', error);
          this.isLoading.set(false);
        },
      });
  }
}
