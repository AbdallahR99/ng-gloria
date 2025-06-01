import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { FacadeService } from '@app/core/services/facade-service.service';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { CreateVoucherRequest } from '@app/core/models/voucher.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-vouchers-create',
  imports: [SHARED_MODULES],
  templateUrl: './vouchers-create.component.html',
  styleUrl: './vouchers-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VouchersCreateComponent {
  private readonly facadeService = inject(FacadeService);
  private readonly router = inject(Router);

  // Form data object for ngModel
  voucherCodeInput = model<string>('');
  userNameInput = model<string>('');
  userEmailInput = model<string>('');
  userPhoneInput = model<string>('');
  notesInput = model<string>('');

  // State signals
  isSubmitting = signal(false);
  error = signal('');
  success = signal('');

  /**
   * Clear all form fields
   */
  clearForm() {
    this.voucherCodeInput.set('');
    this.userNameInput.set('');
    this.userEmailInput.set('');
    this.userPhoneInput.set('');
    this.notesInput.set('');
    this.isSubmitting.set(false);
    this.error.set('');
    this.success.set('');
  }

  /**
   * Create a new voucher
   */
  async onSubmit(form: NgForm) {
    if (form.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.error.set('');
    this.success.set('');

    try {
      const params: CreateVoucherRequest = {
        voucherCode: this.voucherCodeInput()?.trim() || undefined,
        userName: this.userNameInput()?.trim() || undefined,
        userEmail: this.userEmailInput()?.trim() || undefined,
        userPhone: this.userPhoneInput()?.trim() || undefined,
        notes: this.notesInput()?.trim() || undefined,
      };

      const response = await firstValueFrom(
        this.facadeService.vouchersService.create(params)
      );

      this.success.set('Voucher created successfully!');

      // Navigate to voucher view after a short delay
      setTimeout(() => {
        this.router.navigate([APP_ROUTES.VoucherDetails, response.voucherCode]);
      }, 1500);
    } catch (error: any) {
      console.error('Error creating voucher:', error);
      this.error.set(
        error?.message || 'Error creating voucher. Please try again.'
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Navigate back to vouchers list
   */
  goBack() {
    this.router.navigate([APP_ROUTES.Vouchers]);
  }
}
