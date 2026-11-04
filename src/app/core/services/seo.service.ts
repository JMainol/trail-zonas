import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta } from '@angular/platform-browser';

export const SITE_URL = 'https://selva-amazonas.com';
export const SITE_NAME = 'Selva Amazonas 2.0';
export const DEFAULT_DESCRIPTION =
  'Enciclopedia visual, abierta y colaborativa sobre la Amazonía: fauna, flora medicinal, pueblos indígenas, reservas naturales, conservación y recursos audiovisuales.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/og-image.jpg`;

/**
 * Servicio centralizado de SEO: meta etiquetas, Open Graph, Twitter Cards,
 * URL canónica, directivas de indexación, idioma del documento y datos estructurados.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  updateMetaTags(title: string, description?: string, imageUrl?: string): void {
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ name: 'twitter:description', content: description });
    }

    if (title) {
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ name: 'twitter:title', content: title });
    }

    if (imageUrl) {
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
      this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    }
  }

  /** Marca la página como indexable o no (p. ej. secciones aún en construcción). */
  setIndexable(indexable: boolean): void {
    this.meta.updateTag({
      name: 'robots',
      content: indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow',
    });
  }

  /** Actualiza el atributo lang del documento para lectores de pantalla, guionado y buscadores. */
  setDocumentLanguage(lang: string): void {
    this.document.documentElement.setAttribute('lang', lang);
    this.meta.updateTag({ property: 'og:locale', content: lang === 'en' ? 'en_US' : 'es_ES' });
  }

  updateCanonicalUrl(url: string): void {
    const head = this.document.head;
    let element = this.document.querySelector<HTMLLinkElement>(`link[rel='canonical']`);
    if (!element) {
      element = this.document.createElement('link');
      element.setAttribute('rel', 'canonical');
      head.appendChild(element);
    }
    element.setAttribute('href', url);

    // hreflang: el contenido bilingüe comparte URL, por lo que ambas apuntan a la canónica.
    this.document
      .querySelectorAll<HTMLLinkElement>(`link[rel='alternate'][hreflang]`)
      .forEach((link) => link.setAttribute('href', url));

    this.meta.updateTag({ property: 'og:url', content: url });
  }

  /** Inserta o reemplaza el bloque JSON-LD específico de la página (no toca el de WebSite). */
  setJsonLd(schema: unknown, id = 'page-jsonld'): void {
    let scriptElement = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = this.document.createElement('script');
      scriptElement.type = 'application/ld+json';
      scriptElement.id = id;
      this.document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(schema);
  }
}
