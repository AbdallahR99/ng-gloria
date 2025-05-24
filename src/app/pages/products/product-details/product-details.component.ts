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
    return this.facadeService.translatorService.isEn();
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
      productId: this.product().id,
    }),
    loader: ({ request }) => {
      return of([
        {
          id: 1,
          name: 'John Doe',
          date: '2023-10-01',
          comment: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
      dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.`,
          stars: 4,
        },
        {
          id: 2,
          name: 'Jane Smith',
          date: '2023-10-02',
          comment: `Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
          stars: 5,
        },
        {
          id: 3,
          name: 'Alice Johnson',
          date: '2023-10-03',
          comment: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
      rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
          stars: 3,
        },
      ]);
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
