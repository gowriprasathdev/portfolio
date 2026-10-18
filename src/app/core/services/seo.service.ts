import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { PortfolioData, PersonalInfo, ProjectItem, SkillCategory } from '../models/portfolio-data.model';

export interface MetaConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'profile' | 'article';
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);

  private readonly SCHEMA_ID = 'seo-structured-data';

  updateTitle(title: string): void {
    this.titleService.setTitle(title);
  }

  updateMetaTags(config: MetaConfig): void {
    // Basic standard tags
    this.titleService.setTitle(config.title);
    this.metaService.updateTag({ name: 'description', content: config.description });

    if (config.keywords && config.keywords.length > 0) {
      this.metaService.updateTag({ name: 'keywords', content: config.keywords.join(', ') });
    }

    // OpenGraph Tags
    this.metaService.updateTag({ property: 'og:title', content: config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    this.metaService.updateTag({ property: 'og:type', content: config.type || 'website' });
    if (config.image) {
      this.metaService.updateTag({ property: 'og:image', content: config.image });
    }
    if (config.url) {
      this.metaService.updateTag({ property: 'og:url', content: config.url });
    }

    // Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: config.title });
    this.metaService.updateTag({ name: 'twitter:description', content: config.description });
    if (config.image) {
      this.metaService.updateTag({ name: 'twitter:image', content: config.image });
    }
  }

  /**
   * Injects a comprehensive Schema.org @graph linking ProfilePage, Person,
   * and optionally CreativeWork / SoftwareSourceCode entities for AI Answer Engine Optimization (AEO).
   * @param portfolioData The full portfolio data object
   * @param canonicalUrl Canonical site URL
   * @param includeProjects If false, omits all project schemas and references from AI bots
   */
  injectPortfolioGraphSchema(
    portfolioData: PortfolioData,
    canonicalUrl: string,
    includeProjects: boolean = false
  ): void {
    const { personal, skills, projects, experience } = portfolioData;

    // Flatten all skills for AI entity matching ('knowsAbout')
    const flattenedSkills = skills ? skills.flatMap(s => s.items) : [];

    // Current employer if available
    const currentExperience = experience?.find(e => e.isCurrent);

    // 1. Person entity
    const personEntity: Record<string, any> = {
      '@type': 'Person',
      '@id': `${canonicalUrl}#person`,
      'name': personal.name,
      'jobTitle': personal.title,
      'description': personal.bio,
      'image': personal.avatar,
      'email': `mailto:${personal.email}`,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': personal.location
      },
      'sameAs': personal.socials.map(s => s.url),
      'knowsAbout': flattenedSkills
    };

    if (currentExperience) {
      personEntity['worksFor'] = {
        '@type': 'Organization',
        'name': currentExperience.company,
        ...(currentExperience.companyUrl && { 'url': currentExperience.companyUrl })
      };
    }

    // 2. CreativeWork & SoftwareSourceCode entities for projects (only included if includeProjects === true)
    const programmingLanguageKeywords = [
      'Go', 'Golang', 'TypeScript', 'JavaScript', 'Java', 'Angular', 'SQL',
      'Python', 'C#', 'Bash', 'HTML', 'CSS'
    ];

    const projectEntities = includeProjects && projects
      ? projects.map(project => {
          const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const isCode = Boolean(project.githubUrl);

          const languages = project.tags.filter(tag =>
            programmingLanguageKeywords.some(lang => tag.toLowerCase().includes(lang.toLowerCase()))
          );

          return {
            '@type': isCode ? 'SoftwareSourceCode' : 'CreativeWork',
            '@id': `${canonicalUrl}#project-${slug}`,
            'name': project.title,
            'headline': project.subtitle,
            'description': project.description,
            'keywords': project.tags.join(', '),
            'author': {
              '@id': `${canonicalUrl}#person`
            },
            'creator': {
              '@id': `${canonicalUrl}#person`
            },
            ...(project.githubUrl && {
              'codeRepository': project.githubUrl,
              'programmingLanguage': languages.length > 0 ? languages : undefined
            }),
            ...(project.liveUrl && {
              'url': project.liveUrl
            }),
            'applicationCategory': 'DeveloperApplication'
          };
        })
      : [];

    // 3. ProfilePage representing the portfolio document
    const profilePageEntity: Record<string, any> = {
      '@type': 'ProfilePage',
      '@id': `${canonicalUrl}#webpage`,
      'url': canonicalUrl,
      'name': `${personal.name} | ${personal.title}`,
      'description': personal.bio,
      'mainEntity': {
        '@id': `${canonicalUrl}#person`
      }
    };

    if (projectEntities.length > 0) {
      profilePageEntity['hasPart'] = projectEntities.map(p => ({ '@id': p['@id'] }));
    }

    const graphSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        profilePageEntity,
        personEntity,
        ...projectEntities
      ]
    };

    this.injectJsonLd(graphSchema);
  }

  /**
   * Backward-compatible helper for basic personal info
   */
  injectStructuredData(personalInfo: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    email: string;
    location: string;
    socials: { name: string; url: string }[];
  }): void {
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

    this.injectJsonLd(schema);
  }

  /**
   * Safely injects or updates a JSON-LD script tag in the document <head>.
   * SSR-safe: executes during prerendering and runtime hydration.
   */
  injectJsonLd(schema: Record<string, any>): void {
    let scriptTag = this.document.getElementById(this.SCHEMA_ID) as HTMLScriptElement;

    if (!scriptTag) {
      scriptTag = this.document.createElement('script');
      scriptTag.id = this.SCHEMA_ID;
      scriptTag.type = 'application/ld+json';
      this.document.head.appendChild(scriptTag);
    }

    scriptTag.text = JSON.stringify(schema, null, 2);
  }
}

