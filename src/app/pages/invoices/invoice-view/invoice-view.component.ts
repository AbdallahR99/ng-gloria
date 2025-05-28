import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { Invoice } from '../../../core/models/invoice.model';

@Component({
  selector: 'app-invoice-view',
  imports: [SHARED_MODULES],
  templateUrl: './invoice-view.component.html',
  styleUrl: './invoice-view.component.scss',
})
export class InvoiceViewComponent {
  private readonly router = inject(Router);

  // Input signal for invoice data from resolver
  invoice = input.required<Invoice>();

  // Computed invoice calculations
  subtotal = computed(() => {
    const invoice = this.invoice();
    if (!invoice?.products) return 0;
    return invoice.products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
  });

  totalDiscount = computed(() => {
    const invoice = this.invoice();
    return invoice?.discount || 0;
  });

  deliveryFees = computed(() => {
    const invoice = this.invoice();
    return invoice?.deliveryFees || 0;
  });

  grandTotal = computed(() => {
    return this.subtotal() - this.totalDiscount() + this.deliveryFees();
  });

  // Navigation methods
  goBack() {
    this.router.navigate(['/invoices']);
  }

  editInvoice() {
    const invoice = this.invoice();
    if (invoice) {
      this.router.navigate(['/invoices/edit', invoice.id]);
    }
  }

  printInvoice() {
    window.print();
  }

  downloadPDF() {
    // TODO: Implement PDF download functionality
    console.log('Download PDF functionality to be implemented');
  }
}
