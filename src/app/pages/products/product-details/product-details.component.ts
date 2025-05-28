import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { Product } from '@app/core/models/product.model';
import { FacadeService } from '@app/core/services/facade-service.service';
import { CartButtonComponent } from '@app/core/shared/components/cart-button/cart-button.component';
import { FavButtonComponent } from '@app/core/shared/components/fav-button/fav-button.component';

import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { environment } from '@environments/environment';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [SHARED_MODULES, FavButtonComponent, CartButtonComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent {
  product = input.required<Product>();
  facadeService = inject(FacadeService);
  quantity = signal(1);
  selectedColor = signal('');
  selectedSize = signal('');
  imagePath = environment.supabaseImages;
  isAddingBundleToCart = signal(false);
  isBundleInCart = signal(false);

  init = effect(() => {
    if (this.product().colors && (this.product().colors?.length ?? 0) > 0) {
      this.selectedColor.set(this.product().colors?.[0].name ?? '');
    }
    if (this.product().sizes && (this.product().sizes?.length ?? 0) > 0) {
      this.selectedSize.set(this.product().sizes?.[0] ?? '');
    }
  });

  currentImageIndex = signal(0);

  currentImage = computed(() => {
    if (this.product().images.length === 0) return '';
    if (this.product().images.length <= this.currentImageIndex()) return '';
    return this.product().images[this.currentImageIndex()];
  });

  setImage(imageIndex: number) {
    this.currentImageIndex.set(imageIndex);
  }

  get isEn(): boolean {
    return this.facadeService.translatorService.isEn;
  }

  routes = APP_ROUTES;

  bundle = rxResource({
    request: () => ({
      slug: this.product().slug,
    }),
    loader: ({ request }) => {
      return this.facadeService.bundlesService.getByProductSlug(request.slug);
    },
  });

  relatedProducts = rxResource({
    request: () => ({
      slug: this.product().slug,
    }),
    loader: ({ request }) => {
      return this.facadeService.productsService.related(request.slug);
    },
  });

  comments = rxResource({
    request: () => ({
      slug: this.product().slug,
    }),
    loader: ({ request }) => {
      return this.facadeService.reviewsService.get(request.slug);
    },
  });

  ratingDistributionStars = rxResource({
    request: () => ({
      slug: this.product().slug,
    }),
    loader: ({ request }) => {
      return this.facadeService.reviewsService.getRatingDistribution(
        request.slug
      );
    },
  });

  increase() {
    if (this.quantity() >= this.product().quantity) return;
    this.quantity.update((value) => value + 1);
  }

  decrease() {
    if (this.quantity() <= 1) return;
    this.quantity.update((value) => value - 1);
  }

  addBundleToCart(bundleId: string): void {
    if (this.isAddingBundleToCart()) return;
    if (!this.facadeService.authService.isLoggedIn()) return;
    this.isAddingBundleToCart.set(true);
    this.facadeService.cartService.addBundle(bundleId).subscribe({
      next: () => {
        this.isAddingBundleToCart.set(false);
        this.isBundleInCart.set(true);
        // this.facadeService.toastrService.success(
        //   this.isEn
        //     ? 'Bundle added to cart successfully'
        //     : 'تم إضافة الباقة إلى السلة بنجاح'
        // );
      },
      error: (error) => {
        this.isAddingBundleToCart.set(false);
        // this.facadeService.toastrService.error(
        //   this.isEn
        //     ? 'Failed to add bundle to cart'
        //     : 'فشل إضافة الباقة إلى السلة'
        // );
        // console.error('Error adding bundle to cart:', error);
      },
    });
  }

  sendWhatsAppMessage(): void {
    const productName = this.product().nameEn;
    const selectedColor = this.selectedColor();
    const selectedSize = this.selectedSize();
    const quantity = this.quantity();

    let message = `Product: ${productName}`;
    if (selectedColor) {
      message += `\nColor: ${selectedColor}`;
    }
    if (selectedSize) {
      message += `\nSize: ${selectedSize}`;
    }

    if (quantity > 1) {
      message += `\nQuantity: ${quantity}`;
    }

    const phoneNumber = '+971509700715';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, '_blank');
  }
}
