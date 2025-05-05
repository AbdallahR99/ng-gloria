import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SHARED_MODULES } from '@core/shared/modules/shared.module';
import { HeaderComponent } from '../header.component';
import { APP_ROUTES } from '@core/constants/app-routes.enum';

@Component({
  selector: 'header-nav-menu',
  imports: [SHARED_MODULES],
  templateUrl: './header-nav-menu.component.html',
  styleUrl: './header-nav-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNavMenuComponent {
  appRoutes = APP_ROUTES;
  navItems: { name: string; route: string }[] = [
    { name: `Men's Perfume`, route: APP_ROUTES.MEN_PERFUME },
    { name: `Women's Perfume`, route: APP_ROUTES.WOMEN_PERFUME },
    { name: `Skin Care`, route: APP_ROUTES.SKIN_CARE },
    { name: `Hair Care`, route: APP_ROUTES.HAIR_CARE },
    { name: `Blogs`, route: APP_ROUTES.BLOGS },
  ];
}
