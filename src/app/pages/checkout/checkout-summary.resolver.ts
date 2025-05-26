import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { CartSummary } from '@app/core/models/cart-summary.model';
import { FacadeService } from '@app/core/services/facade-service.service';
import { PlatformService } from '@app/core/services/platform/platform.service';

export const checkoutSummaryResolver: ResolveFn<CartSummary> = (
  route,
  state
) => {
  const facadeService = inject(FacadeService);
  const plateFormService = inject(PlatformService);
  if (plateFormService.isServer) return {};
  return facadeService.cartService.summary();
};
