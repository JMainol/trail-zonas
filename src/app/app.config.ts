import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { provideTranslateHttpLoader, TranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';

/**
 * Configuración principal de la aplicación.
 * Define los proveedores globales y la configuración de arranque.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Manejo global de errores en el navegador
    provideBrowserGlobalErrorListeners(),

    // Configuración del Router:
    // - withViewTransitions: Habilita transiciones nativas del navegador entre rutas.
    // - withComponentInputBinding: Permite recibir parámetros de ruta como inputs en componentes.
    provideRouter(routes, withViewTransitions(), withComponentInputBinding()),

    // Hidratación del lado del cliente (SSR):
    // - withEventReplay: Reproduce eventos capturados antes de la hidratación completa.
    provideClientHydration(withEventReplay()),

    // Animaciones cargadas de forma asíncrona para no bloquear el renderizado inicial
    provideAnimationsAsync(),

    // Configuración de i18n (ngx-translate)
    provideHttpClient(withFetch()),
    provideTranslateService({
      loader: {

        provide: TranslateLoader,
        useClass: TranslateHttpLoader
      }
    }),
    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    })
  ]
};
