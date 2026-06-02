import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class HeroComponent {
  state = inject(PortfolioStateService);
  private platformId = inject(PLATFORM_ID);

  scrollTo(sectionId: string, event: Event) {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        this.state.setActiveSection(sectionId);
        
        element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });
      }
    }
  }
}
