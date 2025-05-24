import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';

@Component({
  selector: 'app-auth',
  imports: [SHARED_MODULES],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'h-full bg-neutral-content flex items-center justify-center',
  },
})
export class AuthComponent {}
