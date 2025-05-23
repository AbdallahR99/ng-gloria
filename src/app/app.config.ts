import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideClientTranslatorModule } from '@core/shared/modules/translator/translator.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { IconService } from './core/services/utils/icon.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslatorService } from './core/services/translate/translator.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
      // withViewTransitions()
    ),
    // provideClientHydration(withEventReplay()),
    provideClientTranslatorModule(),
    provideHttpClient(withFetch()),
    MatIconModule,
    provideAppInitializer(() => {
      inject(IconService).registerIcons();
      inject(TranslatorService).setCurrentLang();
    }),
  ],
};
