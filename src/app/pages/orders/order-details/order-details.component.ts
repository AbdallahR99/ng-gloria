import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { OrderStatus } from '@app/core/constants/order-status.enum';
import { Order } from '@app/core/models/order.model';
import { FacadeService } from '@app/core/services/facade-service.service';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-order-details',
  imports: [SHARED_MODULES],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailsComponent {
  facadeService = inject(FacadeService);
  router = inject(Router);
  imagePath = environment.supabaseImages;
  routes = APP_ROUTES;

  // Order data from resolver
  order = input.required<Order>();

  get isEn() {
    return this.facadeService.translatorService.isEn;
  }

  // Computed order totals
  subtotal = computed(() => {
    const items = this.order().items || [];
    return items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  });

  // Order status utilities
  getStatusColor(status?: OrderStatus): string {
    switch (status) {
      case OrderStatus.Pending:
        return 'badge-warning text-yellow-800';
      case OrderStatus.Confirmed:
        return 'badge-info text-blue-800';
      case OrderStatus.Processing:
        return 'badge-primary text-blue-800';
      case OrderStatus.Shipped:
        return 'badge-accent text-purple-800';
      case OrderStatus.Delivered:
        return 'badge-success text-green-800';
      case OrderStatus.Cancelled:
        return 'badge-error text-red-800';
      case OrderStatus.Refunded:
        return 'badge-neutral text-gray-800';
      default:
        return 'badge-neutral text-gray-800';
    }
  }

  getStatusText(status?: OrderStatus): string {
    switch (status) {
      case OrderStatus.Pending:
        return 'Pending';
      case OrderStatus.Confirmed:
        return 'Confirmed';
      case OrderStatus.Processing:
        return 'Processing';
      case OrderStatus.Shipped:
        return 'Shipped';
      case OrderStatus.Delivered:
        return 'Delivered';
      case OrderStatus.Cancelled:
        return 'Cancelled';
      case OrderStatus.Refunded:
        return 'Refunded';
      default:
        return 'Unknown';
    }
  }

  // Date formatting
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

  // Action methods
  goBackToOrders() {
    this.router.navigate([APP_ROUTES.Orders]);
  }

  reorderItems() {
    // Implementation would add all items to cart
    const items = this.order().items || [];
    // TODO: Implement bulk add to cart functionality
    console.log('Reorder items:', items);
  }

  cancelOrder() {
    if (confirm('Are you sure you want to cancel this order?')) {
      const orderId = this.order().id?.toString();
      if (orderId) {
        this.facadeService.ordersService
          .updateStatus({
            orderId,
            status: OrderStatus.Cancelled,
            note: 'Cancelled by customer',
          })
          .subscribe({
            next: () => {
              // Refresh the page or show success message
              location.reload();
            },
            error: (error) => {
              console.error('Error cancelling order:', error);
            },
          });
      }
    }
  }

  // Check if order can be cancelled
  canCancelOrder(): boolean {
    const status = this.order().status;
    return status === OrderStatus.Pending || status === OrderStatus.Confirmed;
  }

  // Get order progress for status timeline
  getOrderProgress(): Array<{
    step: string;
    status: 'completed' | 'current' | 'pending';
    date?: string;
  }> {
    const currentStatus = this.order().status;
    const createdAt = this.order().createdAt;

    const steps = [
      { step: 'Order Placed', status: 'completed' as const, date: createdAt },
      { step: 'Confirmed', status: 'pending' as const },
      { step: 'Processing', status: 'pending' as const },
      { step: 'Shipped', status: 'pending' as const },
      { step: 'Delivered', status: 'pending' as const },
    ];

    // Update status based on current order status
    switch (currentStatus) {
      case OrderStatus.Confirmed:
        steps[1].status = 'pending';
        break;
      case OrderStatus.Processing:
        steps[1].status = 'completed';
        steps[2].status = 'pending';
        break;
      case OrderStatus.Shipped:
        steps[1].status = 'completed';
        steps[2].status = 'completed';
        steps[3].status = 'pending';
        break;
      case OrderStatus.Delivered:
        steps[1].status = 'completed';
        steps[2].status = 'completed';
        steps[3].status = 'completed';
        steps[4].status = 'completed';
        break;
      case OrderStatus.Cancelled:
        return [
          { step: 'Order Cancelled', status: 'completed', date: createdAt },
        ];
      case OrderStatus.Refunded:
        return [
          { step: 'Order Refunded', status: 'completed', date: createdAt },
        ];
    }

    return steps;
  }

  sendWhatsAppMessage(): void {
    let message = `Order Code: ${this.order().orderCode}\n`;

    message += this.isEn
      ? 'I would like to inquire about my order details.'
      : 'أود الاستفسار عن تفاصيل طلبي.';

    const phoneNumber = '+971509700715';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, '_blank');
  }
}
