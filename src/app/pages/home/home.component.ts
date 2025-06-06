import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { FacadeService } from '@app/core/services/facade-service.service';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductQuery } from '@app/core/services/repository/products.service';
import { environment } from '@environments/environment';
import { CartButtonComponent } from '@app/core/shared/components/cart-button/cart-button.component';
import { FavButtonComponent } from '@app/core/shared/components/fav-button/fav-button.component';
@Component({
  selector: 'app-home',
  imports: [SHARED_MODULES, CartButtonComponent, FavButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  appRoutes = APP_ROUTES;
  imagePath = environment.supabaseImages;

  facadeService = inject(FacadeService);
  get isEn() {
    return this.facadeService.translatorService.isEn;
  }
  categories = rxResource({
    stream: ({ params }) => {
      return this.facadeService.categoryService.get();
    },
  });
  productsTodayDiscounts = rxResource({
    params: () =>
      ({
        pageSize: 5,
        sortBy: 'created_at',
        sortOrder: 'asc',
      } as Partial<ProductQuery>),

    stream: ({ params }) => {
      return this.facadeService.productsService.filter(params);
    },
  });
  productsNewArrival = rxResource({
    params: () =>
      ({
        pageSize: 4,
        sortBy: 'created_at',
        sortOrder: 'desc',
      } as Partial<ProductQuery>),
    stream: ({ params }) => {
      return this.facadeService.productsService.filter(params);
    },
  });
}
