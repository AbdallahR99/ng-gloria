import { inject } from '@angular/core';
import { Router, type ResolveFn } from '@angular/router';
import { Product } from '@app/core/models/product.model';
import { FacadeService } from '@app/core/services/facade-service.service';
import { Observable, of } from 'rxjs';

export const directCheckoutProductResolver: ResolveFn<
  Observable<Product | undefined>
> = (route, state) => {
  const facadeService = inject(FacadeService);
  const router = inject(Router);

  const slug = route.paramMap.get('slug');
  if (slug) {
    return facadeService.productsService.getBySlug(slug);
  }
  router.navigate(['/not-found']);
  return of(undefined);
};
