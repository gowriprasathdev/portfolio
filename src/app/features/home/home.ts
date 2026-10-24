import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';

// Feature sections
import { HeroComponent } from '../hero/hero';
import { AboutComponent } from '../about/about';
import { ExperienceComponent } from '../experience/experience';
import { ProjectsComponent } from '../projects/projects';
import { CertificationsComponent } from '../certifications/certifications';
import { ContactComponent } from '../contact/contact';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    CertificationsComponent,
    ContactComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  state = inject(PortfolioStateService);
}
