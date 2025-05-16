import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { PRODUCTS_DATA } from '../../data/products.data';
import { Product } from '../../models/product.model';

export interface ProductQuery {
  categoryId?: number;
  page?: number;
  pageSize?: number;
  minRating?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products = PRODUCTS_DATA;

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
}
