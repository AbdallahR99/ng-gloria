import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { FacadeService } from '@app/core/services/facade-service.service';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductQuery } from '@app/core/services/repository/product.service';
@Component({
  selector: 'app-home',
  imports: [SHARED_MODULES],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  appRoutes = APP_ROUTES;
  facadeService = inject(FacadeService);
  get isEn() {
    return this.facadeService.translateService.isEn();
  }
  categories = rxResource({
    loader: ({ request }) => {
      return this.facadeService.categoryService.getCategories();
    },
  });
  productsTodayDiscounts = rxResource({
    request: () =>
      ({
        pageSize: 5,
      } as Partial<ProductQuery>),

    loader: ({ request }) => {
      return this.facadeService.productService.getProducts(request);
    },
  });
  productsNewArrival = rxResource({
    request: () =>
      ({
        page: 2,
        pageSize: 4,
      } as Partial<ProductQuery>),
    loader: ({ request }) => {
      return this.facadeService.productService.getProducts(request);
    },
  });
}
