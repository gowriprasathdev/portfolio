import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  
  // Expose a read-only signal for the theme state
  private themeSignal = signal<'light' | 'dark'>('dark');
  theme = this.themeSignal.asReadonly();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (storedTheme) {
        this.setTheme(storedTheme);
      } else {
        // Fallback to media query preference
        const prefersLight = typeof window !== 'undefined' && 
                             typeof window.matchMedia === 'function' && 
                             window.matchMedia('(prefers-color-scheme: light)').matches;
        this.setTheme(prefersLight ? 'light' : 'dark');
      }
    }
  }

  toggleTheme() {
    const nextTheme = this.themeSignal() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  private setTheme(theme: 'light' | 'dark') {
    this.themeSignal.set(theme);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      
      // Update color-scheme meta if appropriate for browser rendering
      document.documentElement.style.colorScheme = theme;
    }
  }
}
