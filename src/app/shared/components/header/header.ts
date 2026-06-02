import { Component, inject, signal, HostListener, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PortfolioStateService } from '../../../core/services/portfolio-state.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  state = inject(PortfolioStateService);
  private platformId = inject(PLATFORM_ID);

  isMobileMenuOpen = signal<boolean>(false);
  isScrolled = signal<boolean>(false);

  navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Credentials' },
    { id: 'contact', label: 'Contact' }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled.set(window.scrollY > 20);
    }
  }

  @HostListener('window:keydown.escape', [])
  onEscape() {
    this.closeMobileMenu();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
    
    if (isPlatformBrowser(this.platformId)) {
      if (this.isMobileMenuOpen()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  closeMobileMenu() {
    if (this.isMobileMenuOpen()) {
      this.isMobileMenuOpen.set(false);
      if (isPlatformBrowser(this.platformId)) {
        document.body.style.overflow = '';
      }
    }
  }

  scrollTo(sectionId: string, event: Event) {
    event.preventDefault();
    this.closeMobileMenu();

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

        // Set active section state
        this.state.setActiveSection(sectionId);

        // Move keyboard focus to section for accessibility
        element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });
      }
    }
  }
}
