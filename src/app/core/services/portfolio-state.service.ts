import { Injectable, inject, signal } from '@angular/core';
import { PortfolioData } from '../models/portfolio-data.model';
import { PortfolioDataService } from './portfolio-data.service';
import { ThemeService } from './theme.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioStateService {
  private dataService = inject(PortfolioDataService);
  private themeService = inject(ThemeService);

  // Read-only state wrappers for the Theme Service
  theme = this.themeService.theme;
  toggleTheme = () => this.themeService.toggleTheme();

  // Core application state signals
  portfolioData = signal<PortfolioData | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Navigation scroll spy state
  activeSection = signal<string>('home');

  // Interactive component filters
  selectedProjectCategory = signal<string>('All');

  constructor() {
    this.loadPortfolioData();
  }

  private loadPortfolioData() {
    this.loading.set(true);
    this.dataService.getPortfolioData().subscribe({
      next: (data) => {
        this.portfolioData.set(data);
        this.error.set(null);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load portfolio data:', err);
        this.error.set('Failed to load portfolio content. Please try again.');
        this.loading.set(false);
      }
    });
  }

  setActiveSection(section: string) {
    if (this.activeSection() !== section) {
      this.activeSection.set(section);
    }
  }

  setProjectCategory(category: string) {
    this.selectedProjectCategory.set(category);
  }
}
