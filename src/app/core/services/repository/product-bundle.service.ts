import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Bundle } from '../../models/product-bundle.model';
import { PRODUCT_BUNDLES_DATA } from '../../data/bandles.data';

@Injectable({ providedIn: 'root' })
export class BundleService {
  private bundles = PRODUCT_BUNDLES_DATA;

  getBundleByProductId(productId: number): Observable<Bundle | undefined> {
    return of(this.bundles.find((bundle) => bundle.productId === productId));
  }
}
