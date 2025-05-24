import { inject, Injectable } from '@angular/core';
import { SupabaseFunctionsService } from './supabase-functions.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly fn = inject(SupabaseFunctionsService);
  private readonly endpoint = 'cart';

  get(userId?: string) {
    return this.fn.callFunction(`${this.endpoint}/get`, {
      method: 'GET',
      queryParams: userId ? { user_id: userId } : undefined,
    });
  }

  summary(userId?: string) {
    return this.fn.callFunction(`${this.endpoint}/summary`, {
      method: 'GET',
      queryParams: userId ? { user_id: userId } : undefined,
    });
  }

  create(item: any) {
    return this.fn.callFunction(`${this.endpoint}/create`, {
      method: 'POST',
      body: item,
    });
  }

  update(item: any) {
    return this.fn.callFunction(`${this.endpoint}/update`, {
      method: 'PUT',
      body: item,
    });
  }

  upsert(item: any) {
    return this.fn.callFunction(`${this.endpoint}/upsert`, {
      method: 'POST',
      body: item,
    });
  }

  delete(id: string, userId?: string) {
    return this.fn.callFunction(`${this.endpoint}/delete`, {
      method: 'DELETE',
      body: { cart_id: id, user_id: userId },
    });
  }

  bulkCreate(items: any[]) {
    return this.fn.callFunction(`${this.endpoint}/bulk`, {
      method: 'POST',
      body: items,
    });
  }

  bulkDelete(ids: string[]) {
    return this.fn.callFunction(`${this.endpoint}/bulk`, {
      method: 'DELETE',
      body: ids,
    });
  }
}
