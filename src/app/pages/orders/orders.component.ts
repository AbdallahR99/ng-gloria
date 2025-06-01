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
import { Order } from '@app/core/models/order.model';
import { OrderStatus } from '@app/core/constants/order-status.enum';
import { environment } from '@environments/environment';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';

interface OrderFilters {
  page?: number;
  page_size?: number;
  status?: OrderStatus | '';
}

interface OrdersResponse {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  items: Order[];
}

@Component({
  selector: 'app-orders',
  imports: [SHARED_MODULES],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  facadeService = inject(FacadeService);
  imagePath = environment.supabaseImages;
  routes = APP_ROUTES;

  // Reactive signals for filters
  currentPage = signal(1);
  pageSize = signal(10);
  selectedStatus = signal<OrderStatus | ''>('');

  // Computed filter object
  filters = computed<OrderFilters>(() => ({
    page: this.currentPage(),
    page_size: this.pageSize(),
    status: this.selectedStatus() || undefined,
  }));

  // Orders data resource
  orders = rxResource({
    params: () => this.filters(),
    stream: ({ params }) => {
      return this.facadeService.ordersService.list(params);
    },
  });

  // Available order statuses for filtering
  orderStatuses = Object.values(OrderStatus);

  results = computed(() => {
    return Math.min(
      (this.orders.value()?.page ?? 0) * (this.orders.value()?.pageSize ?? 0),
      this.orders.value()?.total ?? 0
    );
  });

  get isEn() {
    return this.facadeService.translatorService.isEn;
  }

  // Status filter methods
  onStatusChange(status: OrderStatus | '') {
    this.selectedStatus.set(status);
    this.currentPage.set(1); // Reset to first page when filtering
  }

  // Pagination methods
  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1); // Reset to first page when changing page size
  }

  // Utility methods
  getStatusColor(status?: OrderStatus): string {
    switch (status) {
      case OrderStatus.Pending:
        return 'badge-warning';
      case OrderStatus.Confirmed:
        return 'badge-info';
      case OrderStatus.Processing:
        return 'badge-primary';
      case OrderStatus.Shipped:
        return 'badge-accent';
      case OrderStatus.Delivered:
        return 'badge-success';
      case OrderStatus.Cancelled:
      case OrderStatus.Failed:
        return 'badge-error';
      case OrderStatus.Refunded:
      case OrderStatus.Returned:
        return 'badge-neutral';
      default:
        return 'badge-ghost';
    }
  }

  getStatusText(status?: OrderStatus): string {
    if (!status) return 'Unknown';

    // Capitalize and format the status
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

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

  // Generate page numbers for pagination
  getVisiblePages(): number[] {
    const totalPages = this.orders.value()?.totalPages || 1;
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
}
