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
import { ProductQuery } from '@app/core/services/repository/products.service';
import { CategoriesService } from '@app/core/services/repository/categories.service';
import { FacadeService } from '@app/core/services/facade-service.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { c } from 'node_modules/@angular/material/icon-module.d-sA1hmRKS';

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
    return this.facadeService.translatorService.isEn();
  }
  categories = rxResource({
    loader: ({ request }) => {
      return this.facadeService.categoryService.get();
    },
  });
  products = rxResource({
    request: () =>
      ({
        name: this.queryString(),
        categorySlug: this.categorySlug(),
      } as Partial<ProductQuery>),

    loader: ({ request }) => {
      return this.facadeService.productsService.filter(request);
    },
  });

  onSearch(query: string) {
    this.router.navigate([this.routes.PRODUCTS], {
      queryParams: {
        search: query ? query : undefined,
        category: this.categorySlug(),
      },
    });
  }
}
