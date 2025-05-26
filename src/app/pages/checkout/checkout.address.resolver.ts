import { inject } from '@angular/core';
import { RedirectCommand, Router, type ResolveFn } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { Address } from '@app/core/models/address.model';
import { FacadeService } from '@app/core/services/facade-service.service';
import { PlatformService } from '@app/core/services/platform/platform.service';
import { firstValueFrom } from 'rxjs';

export const checkoutAddressResolver: ResolveFn<Address[]> = async (
  route,
  state
) => {
  const facadeService = inject(FacadeService);
  const router = inject(Router);
  const plateFormService = inject(PlatformService);
  const addresses = await firstValueFrom(
    facadeService.addressesService.getAll()
  );

  if (plateFormService.isServer) return [];
  if (!addresses || addresses.length === 0) {
    return new RedirectCommand(
      router.parseUrl(
        `${APP_ROUTES.AddAddress}?redirectUrl=${APP_ROUTES.CheckOut}`
      )
    );
  }
  return addresses;
};
