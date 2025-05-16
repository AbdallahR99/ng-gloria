import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { APP_ROUTES } from '@app/core/constants/app-routes.enum';
import { FacadeService } from '@app/core/services/facade-service.service';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';

@Component({
  selector: 'app-home',
  imports: [SHARED_MODULES],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  appRoutes = APP_ROUTES;
  facadeService = inject(FacadeService);
}
