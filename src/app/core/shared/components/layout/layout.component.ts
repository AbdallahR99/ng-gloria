import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_MODULES } from '../../modules/shared.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-layout',
  imports: [SHARED_MODULES, HeaderComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  host: {
    class: 'h-full flex flex-col',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
