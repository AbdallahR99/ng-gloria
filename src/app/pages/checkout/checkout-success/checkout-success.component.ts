import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';

@Component({
  selector: 'app-checkout-success',
  imports: [SHARED_MODULES],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'h-full bg-neutral-content',
  },
})
export class CheckoutSuccessComponent {
  router = inject(Router);
  orderCode = signal<string>('');
  routes = APP_ROUTES;
  // 3 days later
  expectedDeliveryTime = signal<Date>(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );

  constructor() {
    const orderCodeFromRouteState = (this.router.getCurrentNavigation()?.extras
      .state ?? {})['orderCode'];
    if (orderCodeFromRouteState) {
      this.orderCode.set(orderCodeFromRouteState);
    } else {
      this.router.navigate([APP_ROUTES.HOME]);
    }
  }
}
