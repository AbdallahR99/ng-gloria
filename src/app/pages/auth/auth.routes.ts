import { Routes } from '@angular/router';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';

export const auth_routes: Routes = [
  {
    title: 'Login',
    path: APP_ROUTES.SignIn.substring(1),
    loadComponent: () =>
      import('./signin/signin.component').then((m) => m.SigninComponent),
  },
  {
    title: 'Signup',
    path: APP_ROUTES.SignUp.substring(1),

    loadComponent: () =>
      import('./signup/signup.component').then((m) => m.SignupComponent),
  },
];
