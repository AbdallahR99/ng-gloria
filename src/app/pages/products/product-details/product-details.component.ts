import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { Product } from '@app/core/models/product.model';
import { TranslatorService } from '@app/core/services/translate/translator.service';

import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';

@Component({
  selector: 'app-product-details',
  imports: [SHARED_MODULES],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent {
  product = input.required<Product>();
  translatorService = inject(TranslatorService);
  quantity = signal(1);
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
    return this.translatorService.isEn();
  }

  routes = APP_ROUTES;

  increase() {
    if (this.quantity() >= this.product().quantity) return;
    this.quantity.update((value) => value + 1);
  }

  decrease() {
    if (this.quantity() <= 1) return;
    this.quantity.update((value) => value - 1);
  }

  constructor() {}
}
