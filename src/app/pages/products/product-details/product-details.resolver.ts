import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductService } from '@app/core/services/repository/product.service';
import { Product } from '@app/core/models/product.model';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

export const productDetailsResolver: ResolveFn<
  Observable<Product | undefined>
> = (route, state) => {
  const productService = inject(ProductService);
  const router = inject(Router);

  const slug = route.paramMap.get('slug');
  if (slug) {
    return productService.getProductBySlug(slug).pipe(
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
