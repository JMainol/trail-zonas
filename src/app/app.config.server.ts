import { mergeApplicationConfig, ApplicationConfig, TransferState } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateServerLoader } from './core/loaders/translate-server.loader';

// Factory function for TranslateServerLoader
export function serverLoaderFactory(transferState: TransferState) {
  return new TranslateServerLoader(transferState);
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: serverLoaderFactory,
        deps: [TransferState]
      }
    })
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
