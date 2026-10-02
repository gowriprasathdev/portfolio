import { Component, inject, PLATFORM_ID, signal, effect, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class HeroComponent implements OnDestroy {
  state = inject(PortfolioStateService);
  private platformId = inject(PLATFORM_ID);

  displayedName = signal<string>('');
  isTypingDone = signal<boolean>(false);
  private typeTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      const data = this.state.portfolioData();
      if (data?.personal?.name) {
        if (isPlatformBrowser(this.platformId)) {
          this.startTyping(data.personal.name);
        } else {
          this.displayedName.set(data.personal.name);
          this.isTypingDone.set(true);
        }
      }
    });
  }

  private startTyping(fullName: string) {
    if (this.typeTimeout) clearTimeout(this.typeTimeout);
    this.displayedName.set('');
    this.isTypingDone.set(false);

    let index = 0;
    const typeChar = () => {
      if (index <= fullName.length) {
        this.displayedName.set(fullName.slice(0, index));
        index++;
        if (index <= fullName.length) {
          this.typeTimeout = setTimeout(typeChar, 110);
        } else {
          this.isTypingDone.set(true);
        }
      }
    };
    typeChar();
  }

  retype() {
    const data = this.state.portfolioData();
    if (data?.personal?.name && isPlatformBrowser(this.platformId)) {
      this.startTyping(data.personal.name);
    }
  }

  ngOnDestroy() {
    if (this.typeTimeout) {
      clearTimeout(this.typeTimeout);
    }
  }

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
