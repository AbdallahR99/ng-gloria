import { inject } from '@angular/core';
import { RedirectCommand, Router, type ResolveFn } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { Voucher } from '@app/core/models/voucher.model';
import { FacadeService } from '@app/core/services/facade-service.service';
import { PlatformService } from '@app/core/services/platform/platform.service';
import { firstValueFrom, catchError, of } from 'rxjs';

export const voucherViewResolver: ResolveFn<Voucher> = async (route, state) => {
  const facadeService = inject(FacadeService);
  const router = inject(Router);
  const platformService = inject(PlatformService);

  // Get voucher code from route parameters
  const voucherCode = route.paramMap.get('voucherCode');

  if (platformService.isServer) {
    return new RedirectCommand(router.parseUrl(APP_ROUTES.Vouchers));
  }

  if (!voucherCode) {
    return new RedirectCommand(router.parseUrl(APP_ROUTES.Vouchers));
  }

  try {
    const voucher = await firstValueFrom(
      facadeService.vouchersService.getByCode(voucherCode).pipe(
        catchError((error) => {
          console.error('Error loading voucher:', error);
          return of(null);
        })
      )
    );

    if (!voucher) {
      return new RedirectCommand(router.parseUrl(APP_ROUTES.Vouchers));
    }

    return voucher;
  } catch (error) {
    console.error('Error loading voucher:', error);
    return new RedirectCommand(router.parseUrl(APP_ROUTES.Vouchers));
  }
};
