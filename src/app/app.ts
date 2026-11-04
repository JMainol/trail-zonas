import { Component, ChangeDetectionStrategy, inject, PLATFORM_ID, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from './core/services/seo.service';

export const LANG_STORAGE_KEY = 'selva-amazonas.lang';
const SUPPORTED_LANGS = ['es', 'en'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly translate = inject(TranslateService);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  title = 'selva-amazonas';

  constructor() {
    this.translate.setDefaultLang('es');

    // Mantiene <html lang> sincronizado (accesibilidad, guionado de párrafos justificados y SEO)
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(({ lang }) => {
        this.seo.setDocumentLanguage(lang);
        if (isPlatformBrowser(this.platformId)) {
          try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch { /* almacenamiento no disponible */ }
        }
      });

    this.translate.use(this.initialLang());
  }

  /** Recupera el idioma elegido por el usuario en visitas anteriores (solo en navegador). */
  private initialLang(): string {
    if (!isPlatformBrowser(this.platformId)) return 'es';
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    } catch { /* almacenamiento no disponible */ }
    return 'es';
  }
}
