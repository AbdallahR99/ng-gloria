import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatorService } from '@app/core/services/translate/translator.service';
import { SHARED_MODULES } from '@app/core/shared/modules/shared.module';

@Component({
  selector: 'app-about-us',
  imports: [SHARED_MODULES],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsComponent {
  translatorService = inject(TranslatorService);
  get isEn(): boolean {
    return this.translatorService.isEn;
  }
}
