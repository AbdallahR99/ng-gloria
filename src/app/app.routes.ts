import { Routes } from '@angular/router';
import { APP_ROUTES } from './core/constants/app-routes.enum';

export const routes: Routes = [
  {
    path: APP_ROUTES.HOME.substring(1),
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },

  {
    path: '',
    redirectTo: APP_ROUTES.HOME.substring(1),
    pathMatch: 'full',
  },
];
