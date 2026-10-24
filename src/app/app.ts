import { Component, OnInit, OnDestroy, inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PortfolioStateService } from './core/services/portfolio-state.service';
import { SEOService } from './core/services/seo.service';

// Import shell UI components
import { HeaderComponent } from './shared/components/header/header';
import { FooterComponent } from './shared/components/footer/footer';

// Import feature sections
import { HeroComponent } from './features/hero/hero';
import { AboutComponent } from './features/about/about';
import { ExperienceComponent } from './features/experience/experience';
import { ProjectsComponent } from './features/projects/projects';
import { CertificationsComponent } from './features/certifications/certifications';
import { ContactComponent } from './features/contact/contact';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    CertificationsComponent,
    ContactComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  state = inject(PortfolioStateService);
  private seo = inject(SEOService);
  private platformId = inject(PLATFORM_ID);

  private scrollListener?: () => void;

  constructor() {
    // Dynamically update SEO and AEO schema tags when portfolio data is loaded
    effect(() => {
      const data = this.state.portfolioData();
      if (data) {
        const canonicalUrl = 'https://gowriprasathdev.github.io/portfolio/';
        const fullName = data.personal.fullName || 'Gowri Prasath Shanmugasundaram';

        this.seo.updateMetaTags({
          title: `${fullName} | ${data.personal.title}`,
          description: data.personal.bio,
          keywords: [
            fullName,
            data.personal.name,
            'Gowri Prasath Shanmugasundaram',
            'Gowri Prasath S',
            'Shanmugasundaram Gowri Prasath',
            'S Gowri Prasath',
            'gowriprasathdev',
            data.personal.title,
            'Senior Software Developer',
            'Golang Microservices',
            'Angular Expert',
            'Cloud Native Architecture',
            'Full Stack Developer Portfolio',
            'Agentic AI Systems',
            'Generative AI',
            'Golang AI Engine',
            'Multimodal Vision AI',
            'Autonomous Tool Calling',
            'LLM Microservices'
          ],
          image: data.personal.avatar,
          url: canonicalUrl,
          type: 'profile'
        });

        // Injects comprehensive ProfilePage + Person + CreativeWork/SoftwareSourceCode @graph
        // Projects are omitted from Schema/AI bots when showProjects is false
        this.seo.injectPortfolioGraphSchema(data, canonicalUrl, this.state.showProjects());
      }
    });
  }

  ngOnInit() {
    this.setupScrollSpy();
  }

  private setupScrollSpy() {
    if (isPlatformBrowser(this.platformId)) {
      const getSections = () => [
        'home',
        'about',
        'experience',
        ...(this.state.showProjects() ? ['projects'] : []),
        'certifications',
        'contact'
      ];

      let ticking = false;

      const updateActiveSection = () => {
        const sections = getSections();
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        // 1. Bottom-of-page check: If user scrolled near the bottom, activate the last section ('contact')
        if (scrollY + windowHeight >= docHeight - 80) {
          const lastSection = sections[sections.length - 1];
          if (lastSection) {
            this.state.setActiveSection(lastSection);
            return;
          }
        }

        // 2. Section offset check: Header height (80px) + 40px buffer
        const headerOffset = 120;
        let activeId = sections[0];

        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            // If the section top has scrolled past or reached the header threshold
            if (rect.top <= headerOffset) {
              activeId = id;
            }
          }
        }

        if (activeId) {
          this.state.setActiveSection(activeId);
        }
      };

      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateActiveSection();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      this.scrollListener = onScroll;

      // Run initial check once DOM is ready
      setTimeout(updateActiveSection, 150);
    }
  }

  ngOnDestroy() {
    if (this.scrollListener && isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.scrollListener);
    }
  }
}
