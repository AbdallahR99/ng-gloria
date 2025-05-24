import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Product } from '@app/core/models/product.model';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FacadeService } from '@app/core/services/facade-service.service';

export const productDetailsResolver: ResolveFn<
  Observable<Product | undefined>
> = (route, state) => {
  const facadeService = inject(FacadeService);
  const router = inject(Router);

  const slug = route.paramMap.get('slug');
  if (slug) {
    return facadeService.productsService.getBySlug(slug).pipe(
      map((product) => {
        if (!product) {
          router.navigate(['/not-found']);
        }
        return product;
      })
    );
  }
  router.navigate(['/not-found']);
  return of(undefined);
};
