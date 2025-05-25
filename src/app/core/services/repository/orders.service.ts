import { inject, Injectable } from '@angular/core';
import { SupabaseFunctionsService } from './supabase-functions.service';
import { FacadeService } from '../facade-service.service';
import { tap } from 'rxjs';
type CheckoutRequest = {
  addressId?: string;
  note?: string;
};

type CheckoutResponse = {
  orderId: string;
  orderCode: string;
};
@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly fn = inject(SupabaseFunctionsService);
  private readonly endpoint = 'orders';
  facadeService = inject(FacadeService);

  get(orderId: string, userId?: string) {
    return this.fn.callFunction(`${this.endpoint}`, {
      method: 'GET',
      queryParams: {
        order_id: orderId,
        ...(userId ? { user_id: userId } : {}),
      },
    });
  }

  checkout(payload: CheckoutRequest) {
    return this.fn
      .callFunction<CheckoutResponse>(`${this.endpoint}/checkout`, {
        method: 'POST',
        body: payload,
      })
      .pipe(
        tap(() => {
          this.facadeService.cartService.updateCartCount();
        })
      );
  }

  updateStatus(payload: {
    orderId?: string;
    orderCode?: string;
    status: string;
    note?: string;
  }) {
    return this.fn.callFunction<{ status: 'updated' }>(
      `${this.endpoint}/status`,
      {
        method: 'PUT',
        body: payload,
      }
    );
  }

  list(filters?: any) {
    return this.fn.callFunction(`${this.endpoint}/list`, {
      method: 'POST',
      body: filters,
    });
  }

  bulkUpdateStatus(
    payloads: { order_id: string; status: string; note?: string }[]
  ) {
    return this.fn.callFunction(`${this.endpoint}/bulk`, {
      method: 'PUT',
      body: payloads,
    });
  }

  bulkDelete(orderIds: string[]) {
    return this.fn.callFunction(`${this.endpoint}/bulk`, {
      method: 'DELETE',
      body: orderIds,
    });
  }
}
