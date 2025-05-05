import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { SHARED_MODULES } from '../../../modules/shared.module';
import { HeaderBannerComponent } from './header-banner/header-banner.component';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { HeaderNavMenuComponent } from './header-nav-menu/header-nav-menu.component';

@Component({
  selector: 'app-header',
  imports: [SHARED_MODULES, HeaderBannerComponent, HeaderNavMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  menuCollapse = model(false);
  appRoutes = APP_ROUTES;
  navItems: { name: string; route: string }[] = [
    { name: 'home', route: APP_ROUTES.HOME },
    { name: 'shop', route: APP_ROUTES.SHOP },
    { name: 'services', route: APP_ROUTES.BLOGS },
  ];
}
