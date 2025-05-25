import { Routes } from '@angular/router';
import { APP_ROUTES } from './core/constants/app-routes.enum';
import { productDetailsResolver } from './pages/products/product-details/product-details.resolver';
import { NotFoundComponent } from '@app/pages/not-found/not-found.component';
import { auth_routes } from './pages/auth/auth.routes';
import { authGuard, NotAuthGuard } from './core/guards/auth.guard';
import { checkoutAddressResolver } from './pages/checkout/checkout.address.resolver';
import { checkoutItemsResolver } from './pages/checkout/checkout-items.resolver';
import { checkoutSummaryResolver } from './pages/checkout/checkout-summary.resolver';

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
    title: 'Checkout Success',
    canActivate: [authGuard],
    path: APP_ROUTES.CheckoutSuccess.substring(1),
    loadComponent: () =>
      import(
        './pages/checkout/checkout-success/checkout-success.component'
      ).then((m) => m.CheckoutSuccessComponent),
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
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
  {
    path: '',
    redirectTo: APP_ROUTES.HOME.substring(1),
    pathMatch: 'full',
  },
];
