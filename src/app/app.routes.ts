import { Routes } from '@angular/router';
import { APP_ROUTES } from './core/constants/app-routes.enum';
import { productDetailsResolver } from './pages/products/product-details/product-details.resolver';
import { NotFoundComponent } from '@app/pages/not-found/not-found.component';
import { auth_routes } from './pages/auth/auth.routes';
import { authGuard, NotAuthGuard } from './core/guards/auth.guard';
import { checkoutAddressResolver } from './pages/checkout/checkout.address.resolver';
import { checkoutItemsResolver } from './pages/checkout/checkout-items.resolver';
import { checkoutSummaryResolver } from './pages/checkout/checkout-summary.resolver';
import { orderDetailsResolver } from './pages/orders/order-details/order-details.resolver';
import { invoiceViewResolver } from './pages/invoices/invoice-view/invoice-view.resolver';
import { directCheckoutProductResolver } from './pages/direct-checkout/direct-checkout-product.resolver';
import { reviewProductResolver } from './pages/products/product-details/write-review/review-product.resolver';
import { voucherViewResolver } from './pages/vouchers/voucher-view/voucher-view.resolver';

export const routes: Routes = [
  {
    path: APP_ROUTES.HOME.substring(1),
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: APP_ROUTES.PRODUCTS.substring(1),
    loadComponent: () =>
      import('./pages/products/products.component').then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: APP_ROUTES.Services.substring(1),
    loadComponent: () =>
      import('./pages/g-services/g-services.component').then(
        (m) => m.GServicesComponent
      ),
  },
  {
    path: APP_ROUTES.About.substring(1),
    loadComponent: () =>
      import('./pages/about-us/about-us.component').then(
        (m) => m.AboutUsComponent
      ),
  },
  {
    path: `${APP_ROUTES.PRODUCTS.substring(1)}/:slug`,
    loadComponent: () =>
      import('./pages/products/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent
      ),
    // data: {
    //   product: productDetailsResolver,
    // },
    resolve: { product: productDetailsResolver },
  },
  {
    path: `${APP_ROUTES.WriteReview.substring(1)}/:slug`,
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './pages/products/product-details/write-review/write-review.component'
      ).then((m) => m.WriteReviewComponent),

    resolve: { product: reviewProductResolver },
  },
  {
    title: 'Cart',
    path: APP_ROUTES.Cart.substring(1),
    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    title: 'Add Address',
    path: APP_ROUTES.AddAddress.substring(1),
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/add-address/add-address.component').then(
        (m) => m.AddAddressComponent
      ),
  },
  {
    title: 'Checkout',
    canActivate: [authGuard],

    path: APP_ROUTES.CheckOut.substring(1),
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
    resolve: {
      addresses: checkoutAddressResolver,
      items: checkoutItemsResolver,
      summary: checkoutSummaryResolver,
    },
  },
  {
    title: 'Direct Checkout',
    canActivate: [authGuard],
    path: APP_ROUTES.CheckoutDirect.substring(1) + '/:productSlug',
    loadComponent: () =>
      import('./pages/direct-checkout/direct-checkout.component').then(
        (m) => m.DirectCheckoutComponent
      ),
    resolve: {
      addresses: checkoutAddressResolver,
      product: directCheckoutProductResolver,
    },
  },

  {
    title: 'Checkout Success',
    canActivate: [authGuard],
    path: APP_ROUTES.CheckoutSuccess.substring(1),
    loadComponent: () =>
      import(
        './pages/checkout/checkout-success/checkout-success.component'
      ).then((m) => m.CheckoutSuccessComponent),
  },
  {
    title: 'Orders',
    canActivate: [authGuard],
    path: APP_ROUTES.Orders.substring(1),
    loadComponent: () =>
      import('./pages/orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    title: 'Order Details',
    canActivate: [authGuard],
    path: `${APP_ROUTES.OrderDetails.substring(1)}/:orderCode`,
    loadComponent: () =>
      import('./pages/orders/order-details/order-details.component').then(
        (m) => m.OrderDetailsComponent
      ),
    resolve: {
      order: orderDetailsResolver,
    },
  },
  {
    title: 'Invoices',
    // canActivate: [authGuard],
    path: APP_ROUTES.Invoices.substring(1),

    loadComponent: () =>
      import('./pages/invoices/invoices.component').then(
        (m) => m.InvoicesComponent
      ),
  },
  {
    title: 'Invoice Details',
    // canActivate: [authGuard],
    path: `${APP_ROUTES.InvoiceDetails.substring(1)}/:invoiceCode`,
    loadComponent: () =>
      import('./pages/invoices/invoice-view/invoice-view.component').then(
        (m) => m.InvoiceViewComponent
      ),
    resolve: {
      invoice: invoiceViewResolver,
    },
  },
  {
    title: 'Create Invoice',
    // canActivate: [authGuard],
    path: APP_ROUTES.InvoicesCreate.substring(1),
    loadComponent: () =>
      import('./pages/invoices/invoices-create/invoices-create.component').then(
        (m) => m.InvoicesCreateComponent
      ),
  },
  {
    title: 'Vouchers',
    // canActivate: [authGuard],
    path: APP_ROUTES.Vouchers.substring(1),

    loadComponent: () =>
      import('./pages/vouchers/vouchers.component').then(
        (m) => m.VouchersComponent
      ),
  },
  {
    title: 'Voucher Details',
    // canActivate: [authGuard],
    path: `${APP_ROUTES.VoucherDetails.substring(1)}/:voucherCode`,
    loadComponent: () =>
      import('./pages/vouchers/voucher-view/voucher-view.component').then(
        (m) => m.VoucherViewComponent
      ),
    resolve: {
      voucher: voucherViewResolver,
    },
  },
  {
    title: 'Voucher Invoice',
    // canActivate: [authGuard],
    path: APP_ROUTES.VoucherCreate.substring(1),
    loadComponent: () =>
      import('./pages/vouchers/vouchers-create/vouchers-create.component').then(
        (m) => m.VouchersCreateComponent
      ),
  },
  {
    path: APP_ROUTES.AUTH.substring(1),
    canActivate: [NotAuthGuard],
    loadComponent: () =>
      import('./pages/auth/auth.component').then((m) => m.AuthComponent),
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((m) => m.auth_routes),
  },
  {
    title: 'Profile',
    path: APP_ROUTES.Profile.substring(1),
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    loadChildren: () =>
      import('./pages/profile/profile.route').then((m) => m.profile_routes),
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '',
    redirectTo: APP_ROUTES.HOME.substring(1),
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
