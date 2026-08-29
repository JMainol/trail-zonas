import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, TransferState } from '@angular/core';
import { provideRouter, withViewTransitions, withComponentInputBinding, TitleStrategy, PreloadAllModules, withPreloading } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateBrowserLoader } from './core/loaders/translate-browser.loader';
import { CustomTitleStrategy } from './core/strategies/custom-title.strategy';

import { routes } from './app.routes';

// Factory function for TranslateBrowserLoader
export function HttpLoaderFactory(http: HttpClient, transferState: TransferState) {
  return new TranslateBrowserLoader(transferState, http);
}

/**
 * Configuración principal de la aplicación.
 * Define los proveedores globales y la configuración de arranque.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Modo Zoneless: Elimina zone.js para un rendimiento ultra-eficiente basado en Signals.
    provideZonelessChangeDetection(),

    // Manejo global de errores en el navegador
    provideBrowserGlobalErrorListeners(),

    // Configuración del Router:
    // - withViewTransitions: Habilita transiciones nativas del navegador entre rutas.
    // - withComponentInputBinding: Permite recibir parámetros de ruta como inputs en componentes.
    provideRouter(routes, withViewTransitions(), withComponentInputBinding(), withPreloading(PreloadAllModules)),

    // Hidratación del lado del cliente (SSR):
    // - withEventReplay: Reproduce eventos capturados antes de la hidratación completa.
    provideClientHydration(withEventReplay()),

    // Animaciones cargadas de forma asíncrona para no bloquear el renderizado inicial
    provideAnimationsAsync(),

    // Configuración de i18n (ngx-translate) con TransferState
    provideHttpClient(withFetch()),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, TransferState]
      }
    }),

    // Estrategia personalizada de títulos y SEO
    { provide: TitleStrategy, useClass: CustomTitleStrategy }
  ]
};
