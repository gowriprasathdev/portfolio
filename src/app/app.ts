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
  
  private observer?: IntersectionObserver;

  constructor() {
    // Dynamically update SEO tags when portfolio data is loaded
    effect(() => {
      const data = this.state.portfolioData();
      if (data) {
        this.seo.updateMetaTags({
          title: `${data.personal.name} | ${data.personal.title}`,
          description: data.personal.bio,
          keywords: [
            data.personal.name,
            data.personal.title,
            'Developer Portfolio',
            'Angular 21 Expert',
            'Full Stack Developer Portfolio'
          ],
          image: data.personal.avatar,
          url: 'https://franciscodev.com.br'
        });

        this.seo.injectStructuredData({
          name: data.personal.name,
          title: data.personal.title,
          bio: data.personal.bio,
          avatar: data.personal.avatar,
          email: data.personal.email,
          location: data.personal.location,
          socials: data.personal.socials
        });
      }
    });
  }

  ngOnInit() {
    this.setupScrollSpy();
  }

  private setupScrollSpy() {
    if (isPlatformBrowser(this.platformId)) {
      const options = {
        root: null,
        rootMargin: '-30% 0px -50% 0px', // Trigger scroll action when section matches middle viewport
        threshold: 0
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.state.setActiveSection(entry.target.id);
          }
        });
      }, options);

      // Section elements to monitor
      const sections = ['home', 'about', 'experience', 'projects', 'certifications', 'contact'];
      setTimeout(() => {
        sections.forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            this.observer?.observe(el);
          }
        });
      }, 500); // Give the DOM some time to render
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
