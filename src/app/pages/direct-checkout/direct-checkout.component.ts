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
import { Router } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { Address } from '@app/core/models/address.model';
import { CartItem } from '@app/core/models/cart-item.model';
import { CartSummary } from '@app/core/models/cart-summary.model';
import { Product } from '@app/core/models/product.model';
import { FacadeService } from '@app/core/services/facade-service.service';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-direct-checkout',
  imports: [SHARED_MODULES],
  templateUrl: './direct-checkout.component.html',
  styleUrl: './direct-checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectCheckoutComponent {
  facadeService = inject(FacadeService);
  router = inject(Router);
  routes = APP_ROUTES;
  imagePath = environment.supabaseImages;
  isLoading = signal(false);
  addresses = input<Address[]>();
  color = input<string | undefined>(undefined);
  size = input<string | undefined>(undefined);
  quantity = input<number>(1);
  product = input.required<Product>();
  defaultAddress = computed(() => {
    return this.addresses()?.find((address) => address.isDefault);
  });

  items = computed<CartItem[]>(() => {
    return [
      {
        id: this.product()?.id || '',
        userId: this.facadeService.usersService.user()?.id,
        productId: this.product()?.id || '',
        quantity: this.quantity() || 1,
        size: this.size(),
        color: this.color(),
        nameEn: this.product()?.nameEn || '',
        nameAr: this.product()?.nameAr || '',
        descriptionEn: this.product()?.descriptionEn || '',
        descriptionAr: this.product()?.descriptionAr || '',
        price: this.product()?.price || 0,
        oldPrice: this.product()?.oldPrice || 0,
        stars: this.product()?.stars || 0,
        reviews: this.product()?.reviews || 0,
        thumbnail: this.product()?.thumbnail || '',
        slug: this.product()?.slug || '',
        slugAr: this.product()?.slugAr || '',
        status: 'added',
        product: this.product(),
      } as CartItem,
    ];
  });

  discount = computed(() => {
    const oldPrice = this.product()?.oldPrice || 0;
    const price = this.product()?.price || 0;
    const quantity = this.quantity() || 1;
    return oldPrice > price ? (oldPrice - price) * quantity : 0;
  });

  discountPercentage = computed(() => {
    const oldPrice = this.product()?.oldPrice || 0;
    const price = this.product()?.price || 0;
    const quantity = this.quantity() || 1;
    return oldPrice > price ? ((oldPrice - price) / oldPrice) * 100 : 0;
  });

  oldSubtotal = computed(() => {
    const oldPrice = this.product()?.oldPrice || 0;
    return oldPrice * (this.quantity() || 1);
  });

  subtotal = computed(() => {
    const price = this.product()?.price || 0;
    return price * (this.quantity() || 1);
  });

  total = computed(() => {
    return this.product()?.price * (this.quantity() || 1) || 0;
  });

  summary = computed<CartSummary>(() => ({
    total: this.total(),
    deliveryFee: this.defaultAddress()?.deliveryFee || 0,
    discount: this.discount(),
    discountPercentage: this.discountPercentage(),
    oldSubtotal: this.oldSubtotal(),
    subtotal: this.subtotal(),
  }));

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
      .directCheckout({
        addressId: this.selectedAddressId(),
        productId: this.product()?.id || '',
        note: this.userNote(),
        color: this.color(),
        size: this.size(),
        quantity: this.quantity(),
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
