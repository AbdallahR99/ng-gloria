import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { FacadeService } from '@app/core/services/facade-service.service';
import { environment } from '@environments/environment';
import { rxResource } from '@angular/core/rxjs-interop';

interface MenuItem {
  route: string;
  icon: string;
  label: string;
  badge?: string;
}

@Component({
  selector: 'app-profile',
  imports: [SHARED_MODULES],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class ProfileComponent {
  facadeService = inject(FacadeService);
  appRoutes = APP_ROUTES;
  imagePath = environment.supabaseImages;

  get user() {
    return this.facadeService.usersService.user;
  }

  // Menu items for navigation
  menuItems: MenuItem[] = [
    {
      route: '.',
      icon: 'person',
      label: 'Profile Info',
    },
    {
      route: './orders',
      icon: 'receipt_long',
      label: 'My Orders',
    },
    {
      route: './addresses',
      icon: 'location_on',
      label: 'Addresses',
    },
    {
      route: './favorites',
      icon: 'favorite',
      label: 'Favorites',
    },
  ];
}
