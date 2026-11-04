import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  SeoService,
} from '../services/seo.service';

/**
 * Estrategia de títulos que, además del <title>, sincroniza en cada navegación:
 * descripción, Open Graph/Twitter, URL canónica, directiva robots y JSON-LD
 * (WebPage o el tipo indicado en `data.schemaType`, más su BreadcrumbList).
 */
@Injectable({ providedIn: 'root' })
export class CustomTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly seoService = inject(SeoService);

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} · Enciclopedia visual de la Amazonía`;
    this.title.setTitle(fullTitle);

    // Ruta más profunda y cadena de rutas para las migas de pan
    const chain: ActivatedRouteSnapshot[] = [];
    let route = routerState.root;
    chain.push(route);
    while (route.firstChild) {
      route = route.firstChild;
      chain.push(route);
    }

    const data = route.data ?? {};
    const description: string = data['description'] || DEFAULT_DESCRIPTION;
    const ogImage: string = data['ogImage'] || DEFAULT_OG_IMAGE;
    const path = routerState.url.split(/[?#]/)[0];
    const canonicalUrl = `${SITE_URL}${path === '/' ? '/' : path.replace(/\/$/, '')}`;

    this.seoService.updateMetaTags(fullTitle, description, ogImage);
    this.seoService.updateCanonicalUrl(canonicalUrl);
    this.seoService.setIndexable(!data['noindex']);

    const breadcrumbs = this.buildBreadcrumbs(chain);
    const page: Record<string, unknown> = {
      '@type': data['schemaType'] || 'WebPage',
      name: title || SITE_NAME,
      headline: title || SITE_NAME,
      description,
      url: canonicalUrl,
      image: ogImage,
      inLanguage: 'es',
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/` },
      ...(data['jsonLd'] || {}),
    };

    this.seoService.setJsonLd({
      '@context': 'https://schema.org',
      '@graph': breadcrumbs.length > 1 ? [page, this.breadcrumbSchema(breadcrumbs)] : [page],
    });
  }

  private buildBreadcrumbs(chain: ActivatedRouteSnapshot[]): { name: string; url: string }[] {
    const crumbs: { name: string; url: string }[] = [{ name: 'Inicio', url: `${SITE_URL}/` }];
    let url = '';
    for (const snap of chain) {
      const segment = snap.url.map((s) => s.path).join('/');
      if (segment) url += `/${segment}`;
      const name = snap.routeConfig?.title;
      if (segment && typeof name === 'string' && !crumbs.some((c) => c.name === name)) {
        crumbs.push({ name, url: `${SITE_URL}${url}` });
      }
    }
    return crumbs;
  }

  private breadcrumbSchema(crumbs: { name: string; url: string }[]) {
    return {
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: c.url,
      })),
    };
  }
}
