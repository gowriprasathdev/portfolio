import { Component, inject } from '@angular/core';
import { PortfolioStateService } from '../../../core/services/portfolio-state.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  state = inject(PortfolioStateService);
  currentYear = new Date().getFullYear();
}
