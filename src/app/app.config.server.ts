import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideServerTranslatorModule } from '@core/shared/modules/translator/translator-server.module';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideServerTranslatorModule(),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
