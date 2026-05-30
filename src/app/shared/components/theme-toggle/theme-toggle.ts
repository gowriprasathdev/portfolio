import { Component, inject } from '@angular/core';
import { PortfolioStateService } from '../../../core/services/portfolio-state.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button 
      (click)="state.toggleTheme()" 
      class="theme-btn" 
      [attr.aria-label]="state.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
      type="button">
      <span class="sr-only">Toggle theme</span>
      
      <!-- Moon Icon (shows when theme is light) -->
      @if (state.theme() === 'light') {
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-moon">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      } @else {
        <!-- Sun Icon (shows when theme is dark) -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-sun">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2"/>
          <path d="M12 20v2"/>
          <path d="m4.93 4.93 1.41 1.41"/>
          <path d="m17.66 17.66 1.41 1.41"/>
          <path d="M2 12h2"/>
          <path d="M20 12h2"/>
          <path d="m6.34 17.66-1.41 1.41"/>
          <path d="m19.07 4.93-1.41 1.41"/>
        </svg>
      }
    </button>
  `,
  styles: [`
    .theme-btn {
      background: none;
      border: 1px solid var(--border-color);
      border-radius: 50%;
      width: 42px;
      height: 42px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-primary);
      transition: var(--transition);
      box-shadow: var(--shadow-sm);
    }
    
    .theme-btn:hover, .theme-btn:focus {
      background-color: var(--accent-muted);
      border-color: var(--accent);
      color: var(--accent);
      transform: scale(1.05);
      box-shadow: 0 0 10px rgba(var(--accent-rgb), 0.2);
    }

    svg {
      transition: transform 0.5s ease;
    }

    .theme-btn:hover svg {
      transform: rotate(20deg);
    }
  `]
})
export class ThemeToggleComponent {
  state = inject(PortfolioStateService);
}
