import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  updateTitle(title: string) {
    this.titleService.setTitle(title);
  }

  updateMetaTags(config: {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
    url?: string;
  }) {
    // Basic standard tags
    this.titleService.setTitle(config.title);
    this.metaService.updateTag({ name: 'description', content: config.description });
    
    if (config.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: config.keywords.join(', ') });
    }

    // OpenGraph Tags
    this.metaService.updateTag({ property: 'og:title', content: config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    if (config.image) {
      this.metaService.updateTag({ property: 'og:image', content: config.image });
    }
    if (config.url) {
      this.metaService.updateTag({ property: 'og:url', content: config.url });
    }
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: config.title });
    this.metaService.updateTag({ name: 'twitter:description', content: config.description });
    if (config.image) {
      this.metaService.updateTag({ name: 'twitter:image', content: config.image });
    }
  }

  injectStructuredData(personalInfo: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    email: string;
    location: string;
    socials: { name: string; url: string }[];
  }) {
    // Only run this during SSR or initial page load to avoid duplicate scripts on navigation
    const schemaId = 'seo-structured-data';
    const existingScript = this.document.getElementById(schemaId);
    
    if (existingScript) {
      existingScript.remove();
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': personalInfo.name,
      'jobTitle': personalInfo.title,
      'description': personalInfo.bio,
      'image': personalInfo.avatar,
      'email': personalInfo.email,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': personalInfo.location
      },
      'sameAs': personalInfo.socials.map(s => s.url)
    };

    const script = this.document.createElement('script');
    script.setAttribute('id', schemaId);
    script.setAttribute('type', 'application/ld+json');
    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }
}
