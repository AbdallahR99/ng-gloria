import { Routes } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';

export const profile_routes: Routes = [
  {
    title: 'Profile',
    path: '',
    loadComponent: () =>
      import('./user-info/user-info.component').then(
        (m) => m.UserInfoComponent
      ),
  },
  {
    title: 'Addresses',
    path: 'addresses',
    loadComponent: () =>
      import('./addresses/addresses.component').then(
        (m) => m.AddressesComponent
      ),
  },
  {
    title: 'Orders',
    path: 'orders',
    loadComponent: () =>
      import('./orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    title: 'favorites',
    path: 'favorites',
    loadComponent: () =>
      import('./favorites/favorites.component').then(
        (m) => m.FavoritesComponent
      ),
  },
];
