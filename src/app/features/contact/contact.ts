import { Component, inject } from '@angular/core';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  state = inject(PortfolioStateService);
}
