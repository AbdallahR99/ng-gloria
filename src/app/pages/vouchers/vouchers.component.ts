import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { FacadeService } from '@app/core/services/facade-service.service';
import { Voucher, VoucherFilters } from '@app/core/models/voucher.model';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';

@Component({
  selector: 'app-vouchers',
  imports: [SHARED_MODULES],
  templateUrl: './vouchers.component.html',
  styleUrl: './vouchers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VouchersComponent {
  facadeService = inject(FacadeService);
  routes = APP_ROUTES;

  // Reactive signals for filters
  currentPage = signal(1);
  pageSize = signal(10);
  searchTerm = signal('');
  userEmailFilter = signal('');
  userNameFilter = signal('');
  userPhoneFilter = signal('');
  voucherCodeFilter = signal('');
  dateFromFilter = signal('');
  dateToFilter = signal('');
  sortBy = signal<string>('createdAt');
  sortOrder = signal<'asc' | 'desc'>('desc');

  // Computed filter object
  filters = computed<VoucherFilters>(() => ({
    page: this.currentPage(),
    pageSize: this.pageSize(),
    userEmail: this.userEmailFilter() || undefined,
    userName: this.userNameFilter() || undefined,
    userPhone: this.userPhoneFilter() || undefined,
    voucherCode: this.voucherCodeFilter() || undefined,
    dateFrom: this.dateFromFilter() || undefined,
    dateTo: this.dateToFilter() || undefined,
    sortBy: this.sortBy(),
    sortOrder: this.sortOrder(),
  }));

  // Vouchers data resource
  vouchers = rxResource({
    params: () => this.filters(),
    stream: ({ params }) => {
      return this.facadeService.vouchersService.list(params);
    },
  });

  // Computed properties
  results = computed(() => {
    return Math.min(
      (this.vouchers.value()?.pagination.page ?? 0) *
        (this.vouchers.value()?.pagination.pageSize ?? 0),
      this.vouchers.value()?.pagination.total ?? 0
    );
  });

  // Available sort options
  sortOptions = [
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
    { value: 'voucherCode', label: 'Voucher Code' },
    { value: 'userName', label: 'User Name' },
    { value: 'userEmail', label: 'User Email' },
  ];

  get isEn() {
    return this.facadeService.translatorService.isEn;
  }

  // Filter methods
  onUserEmailFilterChange(email: string) {
    this.userEmailFilter.set(email);
    this.currentPage.set(1);
  }

  onUserNameFilterChange(name: string) {
    this.userNameFilter.set(name);
    this.currentPage.set(1);
  }

  onUserPhoneFilterChange(phone: string) {
    this.userPhoneFilter.set(phone);
    this.currentPage.set(1);
  }

  onVoucherCodeFilterChange(code: string) {
    this.voucherCodeFilter.set(code);
    this.currentPage.set(1);
  }

  onDateFromFilterChange(date: string) {
    this.dateFromFilter.set(date);
    this.currentPage.set(1);
  }

  onDateToFilterChange(date: string) {
    this.dateToFilter.set(date);
    this.currentPage.set(1);
  }

  onSortChange(sortBy: string) {
    this.sortBy.set(sortBy);
    this.currentPage.set(1);
  }

  onSortOrderChange() {
    this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    this.currentPage.set(1);
  }

  // Clear all filters
  clearFilters() {
    this.userEmailFilter.set('');
    this.userNameFilter.set('');
    this.userPhoneFilter.set('');
    this.voucherCodeFilter.set('');
    this.dateFromFilter.set('');
    this.dateToFilter.set('');
    this.sortBy.set('createdAt');
    this.sortOrder.set('desc');
    this.currentPage.set(1);
  }

  // Pagination methods
  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  // Generate page numbers for pagination
  getVisiblePages(): number[] {
    const totalPages = this.vouchers.value()?.pagination.totalPages || 1;
    const current = this.currentPage();
    const pages: number[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5);
        if (totalPages > 5) pages.push(-1); // ellipsis
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        pages.push(1);
        if (totalPages > 6) pages.push(-1); // ellipsis
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1); // ellipsis
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push(-1); // ellipsis
        pages.push(totalPages);
      }
    }

    return pages;
  }

  // Delete voucher method
  deleteVoucher(voucher: Voucher) {
    if (!voucher.id && !voucher.voucherCode) {
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete voucher "${voucher.voucherCode}"? This action cannot be undone.`
    );

    if (confirmed) {
      const deleteRequest = voucher.id
        ? { voucherIds: [voucher.id] }
        : { voucherCodes: [voucher.voucherCode] };

      this.facadeService.vouchersService.bulkDelete(deleteRequest).subscribe({
        next: () => {
          // Refresh the vouchers list after successful deletion
          this.vouchers = rxResource({
            params: () => this.filters(),
            stream: ({ params }) => {
              return this.facadeService.vouchersService.list(params);
            },
          });
        },
        error: (error) => {
          console.error('Error deleting voucher:', error);
          alert('Failed to delete voucher. Please try again.');
        },
      });
    }
  }
}
