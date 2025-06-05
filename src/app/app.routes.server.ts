import { RenderMode, ServerRoute } from '@angular/ssr';
import { APP_ROUTES } from './core/constants/app-routes.enum';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: APP_ROUTES.HOME.slice(1),
    renderMode: RenderMode.Prerender,
  },
  {
    path: APP_ROUTES.PRODUCTS.slice(1),
    renderMode: RenderMode.Server,
  },
  {
    path: APP_ROUTES.PRODUCT_DETAILS.slice(1) + '/:slug',
    renderMode: RenderMode.Server,
  },

  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
