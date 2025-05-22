import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { PRODUCTS_DATA } from '../../data/products.data';
import { Product } from '../../models/product.model';
import { Bundle } from '../../models/product-bundle.model';
import { BundleService } from './product-bundle.service';

export interface ProductQuery {
  categoryId?: number;
  page?: number;
  pageSize?: number;
  minRating?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products = PRODUCTS_DATA;

  constructor(private productBundleService: BundleService) {}

  getProducts(
    query: ProductQuery = {}
  ): Observable<{ items: Product[]; total: number }> {
    let filtered = this.products;
    if (query.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === query.categoryId);
    }
    if (query.minRating) {
      filtered = filtered.filter((p) => p.stars >= (query.minRating ?? 0));
    }
    const total = filtered.length;
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return of({ items, total }).pipe(delay(300));
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.products.find((p) => p.id === id)).pipe(delay(200));
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return of(this.products.find((p) => p.slug === slug)).pipe(delay(200));
  }

  addProduct(product: Product): Observable<Product> {
    product.id = this.products.length + 1;
    this.products.push(product);
    return of(product).pipe(delay(200));
  }

  editProduct(
    id: number,
    changes: Partial<Product>
  ): Observable<Product | undefined> {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return of(undefined).pipe(delay(200));
    this.products[idx] = { ...this.products[idx], ...changes };
    return of(this.products[idx]).pipe(delay(200));
  }

  rateProduct(id: number, stars: number): Observable<Product | undefined> {
    return this.editProduct(id, { stars });
  }

  getProductBundle(productId: number): Observable<Bundle | undefined> {
    return this.productBundleService.getBundleByProductId(productId);
  }

  getRelatedProducts(productId: number): Observable<Product[]> {
    return this.getProductById(productId).pipe(
      map((product) => {
        if (!product) return [];

        // Fetch products with the same category
        const sameCategory = this.products.filter(
          (p) => p.categoryId === product.categoryId && p.id !== product.id
        );

        // Fetch products inspired by the same source, if applicable
        const sameInspiredBy = product.inspiredBy
          ? this.products.filter(
              (p) =>
                p.inspiredBy?.nameEn === product.inspiredBy?.nameEn &&
                p.id !== product.id
            )
          : [];

        // Combine results, prioritizing inspired-by products
        const relatedProducts = [
          ...sameInspiredBy.slice(0, 2),
          ...sameCategory.slice(0, 4 - sameInspiredBy.length),
        ];

        // Ensure only 4 products are returned
        return relatedProducts.slice(0, 4);
      })
    );
  }
}
