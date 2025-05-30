import { Component, computed, inject, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Voucher } from '../../../core/models/voucher.model';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';

@Component({
  selector: 'app-voucher-view',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './voucher-view.component.html',
  styleUrls: ['./voucher-view.component.scss'],
})
export class VoucherViewComponent {
  private router = inject(Router);

  // Get voucher from resolver
  voucher = input.required<Voucher>();

  // Methods
  editVoucher() {
    const voucher = this.voucher();
    if (voucher?.id) {
      this.router.navigate(['/vouchers/edit', voucher.id]);
    }
  }

  goBack() {
    this.router.navigate(['/vouchers']);
  }

  // Utility methods
  formatDate(date: string | undefined): string {
    if (!date) return 'Not available';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatUser(): string {
    const voucher = this.voucher();
    const parts: string[] = [];

    if (voucher?.userName) parts.push(voucher.userName);
    if (voucher?.userEmail) parts.push(`(${voucher.userEmail})`);

    return parts.join(' ') || 'Not provided';
  }
}
