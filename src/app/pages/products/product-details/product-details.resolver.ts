import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Product } from '@app/core/models/product.model';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FacadeService } from '@app/core/services/facade-service.service';
import { Meta, Title } from '@angular/platform-browser';

export const productDetailsResolver: ResolveFn<
  Observable<Product | undefined>
> = (route, state) => {
  const facadeService = inject(FacadeService);
  const router = inject(Router);
  const meta = inject(Meta);
  const title = inject(Title);

  const slug = route.paramMap.get('slug');
  if (slug) {
    return facadeService.productsService.getBySlug(slug).pipe(
      map((product) => {
        const isEn = facadeService.translatorService.isEn;
        if (isEn) {
          title.setTitle(
            product?.metaTitleEn || product?.nameEn || 'Product Details'
          );
          meta.updateTag({
            name: 'description',
            content: product?.metaDescriptionEn || product?.descriptionEn || '',
          });
        } else {
          title.setTitle(
            product?.metaTitleAr || product?.nameAr || 'تفاصيل المنتج'
          );
          meta.updateTag({
            name: 'description',
            content: product?.metaDescriptionAr || product?.descriptionAr || '',
          });
        }
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
