import { Injectable } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SeoService } from '../services/seo.service';

@Injectable({ providedIn: 'root' })
export class CustomTitleStrategy extends TitleStrategy {
  constructor(
    private readonly title: Title,
    private readonly seoService: SeoService
  ) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    const fullTitle = title !== undefined ? `${title} | Amazonas Jungle` : 'Amazonas Jungle';
    
    this.title.setTitle(fullTitle);

    // Attempt to extract description and image from the deepest route data
    let route = routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const description = route.data['description'] || 'Explora la Amazonía: su increíble fauna, flora medicinal, pueblos originarios y reservas naturales.';
    const ogImage = route.data['ogImage'] || 'https://selva-amazonas.com/assets/images/og-image.jpg';

    // Meta tags
    this.seoService.updateMetaTags(fullTitle, description, ogImage);

    // Canonical URL
    const canonicalUrl = `https://selva-amazonas.com${routerState.url.split('?')[0]}`;
    this.seoService.updateCanonicalUrl(canonicalUrl);

    // JSON-LD (WebPage schema)
    this.seoService.setJsonLd({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": fullTitle,
      "description": description,
      "url": canonicalUrl,
      "publisher": {
        "@type": "Organization",
        "name": "Amazonas Jungle"
      }
    });
  }
}
