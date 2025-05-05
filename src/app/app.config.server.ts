import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideServerTranslatorModule } from '@core/shared/modules/translator/translator-server.module';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(), provideServerTranslatorModule()],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
