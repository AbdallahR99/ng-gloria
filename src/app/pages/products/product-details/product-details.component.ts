import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { Product } from '@app/core/models/product.model';
import { FacadeService } from '@app/core/services/facade-service.service';

import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { environment } from '@environments/environment';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [SHARED_MODULES],
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

  constructor() {}
}
