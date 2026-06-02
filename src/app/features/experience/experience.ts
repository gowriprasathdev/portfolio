import { Component, inject } from '@angular/core';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  templateUrl: './experience.html',
  styleUrl: './experience.css'
})
export class ExperienceComponent {
  state = inject(PortfolioStateService);
}
