import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { FacadeService } from '@core/services/facade-service.service';
import {
  CreateInvoiceRequest,
  InvoiceProduct,
} from '@core/models/invoice.model';
import { rxResource } from '@angular/core/rxjs-interop';
import { firstValueFrom, of } from 'rxjs';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { PaginatedResponse } from '@app/core/models/paginated-response.model';
import { Product } from '@app/core/models/product.model';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-invoices-create',
  imports: [SHARED_MODULES],
  templateUrl: './invoices-create.component.html',
  styleUrl: './invoices-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicesCreateComponent {
  private readonly facadeService = inject(FacadeService);
  private readonly router = inject(Router);
  imagePath = environment.supabaseImages;

  // Form signals
  userEmail = model('');
  customerName = model('');
  customerPhone = model('');
  orderId = model<string | null>(null);
  discount = model(0);
  deliveryFees = model(0);
  notes = model('');
  products = signal<InvoiceProduct[]>([]);

  // UI state signals
  isSubmitting = model(false);
  searchQuery = model('');
  productEntryMode = model<'search' | 'manual'>('search');

  // Manual product entry signals
  manualProductName = model('');
  manualProductSku = model('');
  manualProductPrice = model(0);
  manualProductOldPrice = model(0);
  manualProductQuantity = model(1);

  // Product search resource
  productSearch = rxResource({
    request: () => ({ query: this.searchQuery() }),
    loader: ({ request }) => {
      if (!request.query || request.query.length < 2) {
        return of({
          data: [],
          pagination: {
            total: 0,
            page: 1,
            pageSize: 10,
          },
        } as PaginatedResponse<Product>); // Return empty response if query is too short
      }
      return this.facadeService.productsService.filter({
        name: request.query,
        pageSize: 10,
      });
    },
  });

  // Computed values
  subtotal = computed(() => {
    return this.products()?.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
  });

  total = computed(() => {
    if (!this.products()?.length) return 0;
    if (this.subtotal() < 0) return 0; // Ensure subtotal is not negative
    let total = this.subtotal();
    if ((this.discount() ?? 0) > 0) {
      total -= this.discount();
    }
    if ((this.deliveryFees() ?? 0) > 0) {
      total += this.deliveryFees();
    }
    return total;
  });

  isFormValid = computed(() => {
    return (
      this.userEmail()?.length > 0 &&
      this.products()?.length > 0 &&
      this.products().every((p) => p.quantity > 0)
    );
  });

  // Form methods
  addProduct(product: Product) {
    const existingIndex = this.products().findIndex(
      (p) => p.sku === product.sku
    );

    if (existingIndex >= 0) {
      // Update quantity if product already exists
      this.products.update((products) =>
        products.map((p, index) =>
          index === existingIndex ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      // Add new product
      const newProduct: InvoiceProduct = {
        name: product.nameEn,
        sku: product.sku ?? product.nameEn,
        quantity: 1,
        price: product.price,
        oldPrice: product.oldPrice,
      };

      this.products.update((products) => [...products, newProduct]);
    }

    this.searchQuery.set('');
  }

  addManualProduct() {
    this.manualProductQuantity.update((val) => val ?? 1); // Ensure quantity is at least 1
    if (!this.isManualProductValid()) return;

    const existingIndex = this.products()?.findIndex(
      (p) => p.sku === this.manualProductSku()
    );

    if (existingIndex >= 0) {
      // Update quantity if product already exists
      this.products.update((products) =>
        products.map((p, index) =>
          index === existingIndex
            ? { ...p, quantity: p.quantity + this.manualProductQuantity() }
            : p
        )
      );
    } else {
      // Add new manual product
      const newProduct: InvoiceProduct = {
        name: this.manualProductName(),
        sku: this.manualProductSku(),
        quantity: this.manualProductQuantity() ?? 1,
        price: this.manualProductPrice(),
        oldPrice: this.manualProductOldPrice() || undefined,
      };

      this.products.update((products) => [...products, newProduct]);
    }

    this.clearManualProductForm();
  }

  clearManualProductForm() {
    this.manualProductName.set('');
    this.manualProductSku.set('');
    this.manualProductPrice.set(0);
    this.manualProductOldPrice.set(0);
    this.manualProductQuantity.set(1);
  }

  isManualProductValid = computed(() => {
    return (this.manualProductSku() ?? '').trim().length > 0;
    // return (
    //   (this.manualProductName() ?? '').trim().length > 0 &&
    //   (this.manualProductSku() ?? '')?.trim().length > 0 &&
    //   (this.manualProductPrice() ?? 0) > 0 &&
    //   (this.manualProductQuantity() ?? 0) > 0
    // );
  });

  switchProductEntryMode(mode: 'search' | 'manual') {
    this.productEntryMode.set(mode);
    // Clear search when switching to manual mode
    if (mode === 'manual') {
      this.searchQuery.set('');
    }
    // Clear manual form when switching to search mode
    if (mode === 'search') {
      this.clearManualProductForm();
    }
  }

  updateProductQuantity(index: number, quantity: number) {
    if (quantity <= 0) {
      this.products.update((products) =>
        products.map((p, i) => (i === index ? { ...p, quantity: 0 } : p))
      );
      return;
    }

    this.products.update((products) =>
      products.map((p, i) => (i === index ? { ...p, quantity } : p))
    );
  }

  removeProduct(index: number) {
    this.products.update((products) => products.filter((_, i) => i !== index));
  }

  async onSubmit() {
    if (!this.isFormValid() || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    try {
      const request: CreateInvoiceRequest = {
        userEmail: this.userEmail(),
        userName: this.customerName() || undefined,
        userPhone: this.customerPhone() || undefined,
        products: this.products(),
        discount: this.discount(),
        deliveryFees: this.deliveryFees(),
        totalPrice: this.total(),
        notes: this.notes() || undefined,
      };

      const result = await firstValueFrom(
        this.facadeService.invoicesService.create(request)
      );

      // Navigate to the created invoice
      this.router.navigate([APP_ROUTES.InvoiceDetails, result.invoiceCode]);
    } catch (error) {
      console.error('Error creating invoice:', error);
      // You might want to show a toast or alert here
    } finally {
      this.isSubmitting.set(false);
    }
  }

  goBack() {
    this.router.navigate([APP_ROUTES.Invoices]);
  }

  // Form helpers
  onSearchChange(query: string) {
    this.searchQuery.set(query);
  }

  clearForm() {
    this.userEmail.set('');
    this.customerName.set('');
    this.customerPhone.set('');
    this.orderId.set(null);
    this.discount.set(0);
    this.deliveryFees.set(0);
    this.notes.set('');
    this.products.set([]);
  }
}
