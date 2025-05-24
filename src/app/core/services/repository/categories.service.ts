import { inject, Injectable } from '@angular/core';
import { SupabaseFunctionsService } from './supabase-functions.service';
import { Category } from '@app/core/models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly fn = inject(SupabaseFunctionsService);
  private readonly endpoint = 'categories';

  get(slug?: string) {
    return this.fn.callFunction<Category | Category[]>(`${this.endpoint}/get`, {
      method: 'GET',
      queryParams: slug ? { slug } : undefined,
    });
  }

  create(category: Partial<Category>) {
    return this.fn.callFunction<Category>(`${this.endpoint}/create`, {
      method: 'POST',
      body: category,
    });
  }

  update(category: Partial<Category>) {
    return this.fn.callFunction<Category>(`${this.endpoint}/update`, {
      method: 'PUT',
      body: category,
    });
  }

  delete(id: string) {
    return this.fn.callFunction(`${this.endpoint}/delete`, {
      method: 'DELETE',
      body: { id },
    });
  }

  bulkCreate(categories: Partial<Category>[]) {
    return this.fn.callFunction(`${this.endpoint}/bulk`, {
      method: 'POST',
      body: categories,
    });
  }

  bulkDelete(ids: string[]) {
    return this.fn.callFunction(`${this.endpoint}/bulk`, {
      method: 'DELETE',
      body: ids,
    });
  }
}
