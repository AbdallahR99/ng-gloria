import { inject } from '@angular/core';
import { RedirectCommand, Router, type ResolveFn } from '@angular/router';
import { Order } from '@app/core/models/order.model';
import { FacadeService } from '@app/core/services/facade-service.service';
import { PlatformService } from '@app/core/services/platform/platform.service';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { catchError, firstValueFrom, of } from 'rxjs';

export const orderDetailsResolver: ResolveFn<Order> = async (route, state) => {
  const facadeService = inject(FacadeService);
  const router = inject(Router);
  const platformService = inject(PlatformService);

  // Get order ID from route parameters
  const orderCode = route.paramMap.get('orderCode');

  if (platformService.isServer) {
    return new RedirectCommand(router.parseUrl(APP_ROUTES.Orders));
  }

  if (!orderCode) {
    return new RedirectCommand(router.parseUrl(APP_ROUTES.Orders));
  }

  const order = await firstValueFrom(
    facadeService.ordersService.get(orderCode)
  );
  if (!order) {
    return new RedirectCommand(router.parseUrl(APP_ROUTES.Orders));
  }
  return order;
};
