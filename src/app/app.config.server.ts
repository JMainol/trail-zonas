import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateServerLoader } from './core/loaders/translate-server.loader';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateServerLoader
      }
    })
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
