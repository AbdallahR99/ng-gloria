import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { FacadeService } from '@app/core/services/facade-service.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Address } from '@app/core/models/address.model';
import { AddressFormComponent } from '@app/core/shared/components/address-form/address-form.component';

@Component({
  selector: 'app-addresses',
  imports: [SHARED_MODULES, AddressFormComponent],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressesComponent {
  facadeService = inject(FacadeService);
  isAddingNew = signal(false);
  editingAddress = signal<Address | undefined>(undefined);
  isLoading = signal(false);

  get isEn() {
    return this.facadeService.translatorService.isEn;
  }

  addresses = rxResource({
    stream: () => this.facadeService.addressesService.getAll(),
  });

  startAddNew() {
    this.editingAddress.set(undefined);
    this.isAddingNew.set(true);
  }

  startEdit(address: Address) {
    this.editingAddress.set(address);
    this.isAddingNew.set(true);
  }

  cancelForm() {
    this.isAddingNew.set(false);
    this.editingAddress.set(undefined);
  }

  onAddressSubmitted(address: Address) {
    this.isAddingNew.set(false);
    this.editingAddress.set(undefined);
    this.addresses.reload();
  }

  deleteAddress(address: Address) {
    if (confirm('Are you sure you want to delete this address?')) {
      this.isLoading.set(true);
      this.facadeService.addressesService.delete(address.id).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.addresses.reload();
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }
  }

  setAsDefault(address: Address) {
    this.isLoading.set(true);
    this.facadeService.addressesService.setDefault(address.id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.addresses.reload();
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
