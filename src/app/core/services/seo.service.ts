import { Injectable, Inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(private meta: Meta, @Inject(DOCUMENT) private document: Document) {}

  updateMetaTags(title: string, description?: string, imageUrl?: string): void {
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ property: 'twitter:description', content: description });
    }

    if (title) {
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ property: 'twitter:title', content: title });
    }

    if (imageUrl) {
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
      this.meta.updateTag({ property: 'twitter:image', content: imageUrl });
    }
  }

  updateCanonicalUrl(url: string) {
    const head = this.document.getElementsByTagName('head')[0];
    let element: HTMLLinkElement | null = this.document.querySelector(`link[rel='canonical']`) || null;
    if (!element) {
      element = this.document.createElement('link') as HTMLLinkElement;
      element.setAttribute('rel', 'canonical');
      head.appendChild(element);
    }
    element.setAttribute('href', url);
    
    // Update og:url as well
    this.meta.updateTag({ property: 'og:url', content: url });
  }

  setJsonLd(schema: any) {
    const scriptType = 'application/ld+json';
    let scriptElement: HTMLScriptElement | null = this.document.querySelector(`script[type="${scriptType}"]`);
    
    if (!scriptElement) {
      scriptElement = this.document.createElement('script');
      scriptElement.type = scriptType;
      this.document.head.appendChild(scriptElement);
    }
    scriptElement.text = JSON.stringify(schema);
  }
}
