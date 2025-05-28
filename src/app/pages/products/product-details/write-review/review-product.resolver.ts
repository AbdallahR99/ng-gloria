import { inject } from '@angular/core';
import { RedirectCommand, Router, type ResolveFn } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { Product } from '@app/core/models/product.model';
import { FacadeService } from '@app/core/services/facade-service.service';
import { firstValueFrom } from 'rxjs';

export const reviewProductResolver: ResolveFn<Product> = async (
  route,
  state
) => {
  const facadeService = inject(FacadeService);
  const router = inject(Router);

  const slug = route.paramMap.get('slug');
  if (slug) {
    const product = await firstValueFrom(
      facadeService.productsService.getBySlug(slug)
    );
    if (product) {
      return product;
    }
  }
  return new RedirectCommand(router.parseUrl(APP_ROUTES.NOT_FOUND));
};
