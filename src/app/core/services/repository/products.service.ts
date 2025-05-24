import { inject, Injectable } from '@angular/core';
import { SupabaseFunctionsService } from './supabase-functions.service';
import { Product } from '@app/core/models/product.model';
import { PaginatedResponse } from '@app/core/models/paginated-response.model';
export interface ProductQuery {
  page?: number;
  pageSize?: number;
  name?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly fn = inject(SupabaseFunctionsService);
  private readonly endpoint = 'products';

  getBySlug(slug: string) {
    return this.fn.callFunction<Product>(`${this.endpoint}`, {
      queryParams: { slug },
      method: 'GET',
    });
  }
  related(slug: string) {
    return this.fn.callFunction<Product[]>(`${this.endpoint}/related`, {
      queryParams: { slug },
      method: 'GET',
    });
  }
  get(query?: ProductQuery) {
    return this.fn.callFunction<Product>(`${this.endpoint}`, {
      method: 'GET',
      queryParams: query
        ? (Object.fromEntries(
            Object.entries({
              page: query.page,
              pageSize: query.pageSize,
              name: query.name,
              categoryId: query.categoryId,
              minPrice: query.minPrice,
              maxPrice: query.maxPrice,
              sortBy: query.sortBy,
              sortOrder: query.sortOrder,
            }).filter(([_, v]) => v !== undefined)
          ) as Record<string, string | number | boolean>)
        : undefined,
    });
  }

  filter(body: ProductQuery) {
    return this.fn.callFunction<PaginatedResponse<Product>>(
      `${this.endpoint}/filter`,
      {
        method: 'POST',
        body,
      }
    );
  }

  create(product: Partial<Product>) {
    return this.fn.callFunction<Product>(`${this.endpoint}/create`, {
      method: 'POST',
      body: product,
    });
  }

  update(product: Partial<Product>) {
    return this.fn.callFunction<Product>(`${this.endpoint}/update`, {
      method: 'PUT',
      body: product,
    });
  }

  delete(id: number) {
    return this.fn.callFunction<Product>(`${this.endpoint}/delete`, {
      method: 'DELETE',
      body: { id },
    });
  }

  bulkCreate(products: Partial<Product>[]) {
    return this.fn.callFunction(`${this.endpoint}/bulk`, {
      method: 'POST',
      body: products,
    });
  }

  bulkDelete(ids: number[]) {
    return this.fn.callFunction(`${this.endpoint}/bulk`, {
      method: 'DELETE',
      body: ids,
    });
  }
}
