import { Routes } from '@angular/router';
import { APP_ROUTES } from './core/constants/app-routes.enum';
import { productDetailsResolver } from './pages/products/product-details/product-details.resolver';
import { NotFoundComponent } from '@app/pages/not-found/not-found.component';
import { auth_routes } from './pages/auth/auth.routes';
import { NotAuthGuard } from './core/guards/auth.guard';

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
