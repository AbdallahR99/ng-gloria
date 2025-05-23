import { TranslatorService } from '@app/core/services/translate/translator.service';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import {
  ProductQuery,
  ProductService,
} from '@app/core/services/repository/product.service';
import { CategoryService } from '@app/core/services/repository/category.service';
import { FacadeService } from '@app/core/services/facade-service.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products',
  imports: [SHARED_MODULES],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent {
  facadeService = inject(FacadeService);

  routes = APP_ROUTES;
  router = inject(Router);
  queryString = input('', { alias: 'search' });
  categorySlug = input('', { alias: 'category' });

  get isEn() {
    return this.facadeService.translateService.isEn();
  }
  categories = rxResource({
    loader: ({ request }) => {
      return this.facadeService.categoryService.getCategories();
    },
  });
  products = rxResource({
    request: () =>
      ({
        queryString: this.queryString(),
        categorySlug: this.categorySlug(),
      } as Partial<ProductQuery>),

    loader: ({ request }) => {
      return this.facadeService.productService.getProducts(request);
    },
  });
}
