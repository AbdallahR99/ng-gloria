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
import { Invoice, InvoiceFilters } from '@app/core/models/invoice.model';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';

@Component({
  selector: 'app-invoices',
  imports: [SHARED_MODULES],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesComponent {
  facadeService = inject(FacadeService);
  routes = APP_ROUTES;

  // Reactive signals for filters
  currentPage = signal(1);
  pageSize = signal(10);
  searchTerm = signal('');
  userEmailFilter = signal('');
  invoiceCodeFilter = signal('');
  dateFromFilter = signal('');
  dateToFilter = signal('');
  minTotalFilter = signal<number | undefined>(undefined);
  maxTotalFilter = signal<number | undefined>(undefined);
  sortBy = signal<string>('createdAt');
  sortOrder = signal<'asc' | 'desc'>('desc');

  // Computed filter object
  filters = computed<InvoiceFilters>(() => ({
    page: this.currentPage(),
    pageSize: this.pageSize(),
    userEmail: this.userEmailFilter() || undefined,
    invoiceCode: this.invoiceCodeFilter() || undefined,
    dateFrom: this.dateFromFilter() || undefined,
    dateTo: this.dateToFilter() || undefined,
    minTotal: this.minTotalFilter(),
    maxTotal: this.maxTotalFilter(),
    sortBy: this.sortBy(),
    sortOrder: this.sortOrder(),
  }));

  // Invoices data resource
  invoices = rxResource({
    params: () => this.filters(),
    stream: ({ params }) => {
      return this.facadeService.invoicesService.list(params);
    },
  });

  // Computed properties
  results = computed(() => {
    return Math.min(
      (this.invoices.value()?.page ?? 0) *
        (this.invoices.value()?.pageSize ?? 0),
      this.invoices.value()?.total ?? 0
    );
  });

  // Available sort options
  sortOptions = [
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
    { value: 'totalPrice', label: 'Total Price' },
    { value: 'invoiceCode', label: 'Invoice Code' },
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

  onInvoiceCodeFilterChange(code: string) {
    this.invoiceCodeFilter.set(code);
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

  onMinTotalFilterChange(amount: string) {
    const value = amount ? parseFloat(amount) : undefined;
    this.minTotalFilter.set(value);
    this.currentPage.set(1);
  }

  onMaxTotalFilterChange(amount: string) {
    const value = amount ? parseFloat(amount) : undefined;
    this.maxTotalFilter.set(value);
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
    this.invoiceCodeFilter.set('');
    this.dateFromFilter.set('');
    this.dateToFilter.set('');
    this.minTotalFilter.set(undefined);
    this.maxTotalFilter.set(undefined);
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

  // Utility methods
  formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatCurrency(amount?: number): string {
    if (amount === undefined || amount === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  // Generate page numbers for pagination
  getVisiblePages(): number[] {
    const totalPages = this.invoices.value()?.totalPages || 1;
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

  // Calculate product subtotal
  calculateProductSubtotal(invoice: Invoice): number {
    return (
      invoice.products?.reduce((sum, product) => {
        return sum + product.price * product.quantity;
      }, 0) || 0
    );
  }

  // Get total products count
  getTotalProductsCount(invoice: Invoice): number {
    return (
      invoice.products?.reduce((sum, product) => {
        return sum + product.quantity;
      }, 0) || 0
    );
  }
}
