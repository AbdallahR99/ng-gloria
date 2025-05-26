import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { Address } from '@app/core/models/address.model';
import { AddressFormComponent } from '@app/core/shared/components/address-form/address-form.component';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';

@Component({
  selector: 'app-add-address',
  imports: [SHARED_MODULES, AddressFormComponent],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'h-full bg-neutral-content',
  },
})
export class AddAddressComponent {
  router = inject(Router);
  routes = APP_ROUTES;
  redirectUrl = input<string>();

  onAddressSubmitted(address: Address) {
    if (this.redirectUrl()) {
      this.router.navigate([this.redirectUrl()]);
    } else {
      this.router.navigate([this.routes.Addresses]);
    }
  }
}
