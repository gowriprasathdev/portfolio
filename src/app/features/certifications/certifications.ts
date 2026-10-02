import { Component, inject } from '@angular/core';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

@Component({
  selector: 'app-certifications',
  standalone: true,
  templateUrl: './certifications.html',
  styleUrl: './certifications.css'
})
export class CertificationsComponent {
  state = inject(PortfolioStateService);
}
