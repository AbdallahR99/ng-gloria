import { inject } from '@angular/core';
import { RedirectCommand, Router, type ResolveFn } from '@angular/router';
import { Invoice } from '@app/core/models/invoice.model';
import { FacadeService } from '@app/core/services/facade-service.service';
import { PlatformService } from '@app/core/services/platform/platform.service';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { catchError, firstValueFrom, of } from 'rxjs';

export const invoiceViewResolver: ResolveFn<Invoice> = async (route, state) => {
  const facadeService = inject(FacadeService);
  const router = inject(Router);
  const platformService = inject(PlatformService);

  // Get invoice code from route parameters
  const invoiceCode = route.paramMap.get('invoiceCode');

  if (platformService.isServer) {
    return new RedirectCommand(router.parseUrl(APP_ROUTES.Invoices));
  }

  if (!invoiceCode) {
    return new RedirectCommand(router.parseUrl(APP_ROUTES.Invoices));
  }

  try {
    const invoice = await firstValueFrom(
      facadeService.invoicesService.getByCode(invoiceCode).pipe(
        catchError((error) => {
          console.error('Error loading invoice:', error);
          return of(null);
        })
      )
    );

    if (!invoice) {
      return new RedirectCommand(router.parseUrl(APP_ROUTES.Invoices));
    }

    return invoice;
  } catch (error) {
    console.error('Error loading invoice:', error);
    return new RedirectCommand(router.parseUrl(APP_ROUTES.Invoices));
  }
};
