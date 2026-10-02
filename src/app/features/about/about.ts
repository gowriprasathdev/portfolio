import { Component, inject } from '@angular/core';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent {
  state = inject(PortfolioStateService);
}
