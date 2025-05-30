import {
  Component,
  computed,
  inject,
  input,
  viewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { Invoice } from '../../../core/models/invoice.model';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';

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

  // ViewChild for the invoice content to be printed
  invoiceContent = viewChild<ElementRef>('invoiceContent');

  // Computed invoice calculations
  subtotal = computed(() => {
    const invoice = this.invoice();
    if (!invoice?.products) return 0;
    return invoice.products.reduce(
      (sum, product) => sum + Number(product.price) * Number(product.quantity),
      0
    );
  });

  totalDiscount = computed(() => {
    const invoice = this.invoice();
    return Number(invoice?.discount) || 0;
  });

  deliveryFees = computed(() => {
    const invoice = this.invoice();
    return Number(invoice?.deliveryFees) || 0;
  });

  grandTotal = computed(() => {
    return this.subtotal() - this.totalDiscount() + this.deliveryFees();
  });

  // Navigation methods
  goBack() {
    this.router.navigate([APP_ROUTES.Invoices]);
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
    const contentElement = this.invoiceContent()?.nativeElement;
    if (!contentElement) {
      console.error('Invoice content element not found');
      return;
    }

    const invoice = this.invoice();
    if (!invoice) {
      console.error('Invoice data not available');
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      console.error('Could not open print window');
      return;
    }

    // Get the computed styles for better styling
    const originalStyles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join('\n');
        } catch (e) {
          // Handle cross-origin stylesheets
          return '';
        }
      })
      .join('\n');

    // Create the HTML content for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${invoice.invoiceCode}</title>
          <style>
            /* Reset and base styles */
            * { margin: 0; padding: 0; box-sizing: border-box; }

            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }

            /* Typography */
            h1 { font-size: 32px; font-weight: bold; margin-bottom: 8px; text-align: center; }
            h2 { font-size: 24px; font-weight: bold; margin-bottom: 16px; }
            h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }

            /* Layout */
            .grid { display: grid; gap: 24px; margin-bottom: 24px; }
            .grid-3 { grid-template-columns: repeat(3, 1fr); }
            .grid-2 { grid-template-columns: repeat(2, 1fr); }

            /* Cards */
            .card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              background: #f9fafb;
            }

            /* Table */
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
            }

            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }

            th {
              background-color: #f3f4f6;
              font-weight: 600;
            }

            .text-center { text-align: center; }
            .text-right { text-align: right; }

            /* Spacing */
            .mb-2 { margin-bottom: 8px; }
            .mb-4 { margin-bottom: 16px; }
            .mb-6 { margin-bottom: 24px; }
            .mb-8 { margin-bottom: 32px; }

            .space-y-2 > * + * { margin-top: 8px; }
            .space-y-3 > * + * { margin-top: 12px; }

            /* Utility */
            .font-medium { font-weight: 500; }
            .font-bold { font-weight: bold; }
            .text-lg { font-size: 18px; }
            .text-success { color: #059669; }

            /* Summary section */
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
            }

            .summary-total {
              font-size: 18px;
              font-weight: bold;
              border-top: 2px solid #e5e7eb;
              padding-top: 12px;
              margin-top: 12px;
            }

            /* Print specific */
            @media print {
              body { padding: 0; }
              .card { border: 1px solid #ddd !important; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-content">
            <!-- Invoice Header -->
            <div class="mb-8">
              <h1>Invoice #${invoice.invoiceCode}</h1>
              <p style="text-align: center; color: #666; font-size: 16px;">
                Created on ${new Date(
                  invoice.createdAt || ''
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <!-- Invoice Details -->
            <div class="grid grid-3 mb-6">
              <!-- Customer Information -->
              <div class="card">
                <h3>Customer Information</h3>
                <div class="space-y-2">
                  <div><span class="font-medium">Email:</span> ${
                    invoice.userEmail || 'N/A'
                  }</div>
                  ${
                    invoice.userName
                      ? `<div><span class="font-medium">Name:</span> ${invoice.userName}</div>`
                      : ''
                  }
                  ${
                    invoice.userPhone
                      ? `<div><span class="font-medium">Phone:</span> ${invoice.userPhone}</div>`
                      : ''
                  }
                  ${
                    invoice.userAddress
                      ? `<div><span class="font-medium">Address:</span> ${invoice.userAddress}</div>`
                      : ''
                  }
                </div>
              </div>

              <!-- Invoice Information -->
              <div class="card">
                <h3>Invoice Details</h3>
                <div class="space-y-2">
                  <div><span class="font-medium">Invoice Code:</span> ${
                    invoice.invoiceCode
                  }</div>
                  <div><span class="font-medium">Date:</span> ${new Date(
                    invoice.createdAt || ''
                  ).toLocaleDateString()}</div>
                  ${
                    invoice.updatedAt && invoice.updatedAt !== invoice.createdAt
                      ? `<div><span class="font-medium">Last Updated:</span> ${new Date(
                          invoice.updatedAt
                        ).toLocaleDateString()}</div>`
                      : ''
                  }
                </div>
              </div>

              <!-- Order Reference -->
              ${
                invoice.orderCode
                  ? `
              <div class="card">
                <h3>Related Order</h3>
                <div class="space-y-2">
                  <div><span class="font-medium">Order Code:</span> ${invoice.orderCode}</div>
                </div>
              </div>
              `
                  : '<div></div>'
              }
            </div>

            <!-- Products Table -->
            <div class="card mb-6">
              <h3>Products</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th class="text-center">Quantity</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.products
                    .map(
                      (product) => `
                    <tr>
                      <td>
                        <div class="font-bold">${product.name}</div>
                        <div style="font-size: 14px; color: #666;">SKU: ${
                          product.sku
                        }</div>
                      </td>
                      <td class="text-center">${product.quantity}</td>
                      <td class="text-right">AED ${Number(
                        product.price
                      ).toFixed(2)}</td>
                      <td class="text-right font-medium">AED ${(
                        Number(product.price) * Number(product.quantity)
                      ).toFixed(2)}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>

            <!-- Invoice Summary -->
            <div class="card">
              <h3>Invoice Summary</h3>
              <div class="grid grid-2">
                <!-- Left side - Notes -->
                <div>
                  ${
                    invoice.notes
                      ? `
                    <h4 class="font-medium mb-2">Notes</h4>
                    <div style="padding: 12px; background-color: #f3f4f6; border-radius: 6px;">
                      ${invoice.notes}
                    </div>
                  `
                      : ''
                  }
                </div>

                <!-- Right side - Financial Summary -->
                <div>
                  <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>AED ${this.subtotal().toFixed(2)}</span>
                  </div>
                  ${
                    this.totalDiscount() > 0
                      ? `
                    <div class="summary-row text-success">
                      <span>Discount:</span>
                      <span>-AED ${this.totalDiscount().toFixed(2)}</span>
                    </div>
                  `
                      : ''
                  }
                  ${
                    this.deliveryFees() > 0
                      ? `
                    <div class="summary-row">
                      <span>Delivery Fees:</span>
                      <span>AED ${this.deliveryFees().toFixed(2)}</span>
                    </div>
                  `
                      : ''
                  }
                  <div class="summary-row summary-total">
                    <span>Total:</span>
                    <span>AED ${this.grandTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Write content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();

        // Close the window after printing (optional)
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 250);
    };
  }
}
