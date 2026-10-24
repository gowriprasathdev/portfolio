import { Component, inject, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { ProjectItem } from '../../core/models/portfolio-data.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectsComponent {
  state = inject(PortfolioStateService);
  private router = inject(Router);

  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLDivElement>;

  currentIndex = signal<number>(0);

  projects = computed<ProjectItem[]>(() => {
    return this.state.portfolioData()?.projects || [];
  });

  openArchitecture(architectureId?: string, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const target = architectureId === 'whatsapp-sales' ? 'whatsapp-ai-sales' : (architectureId || 'whatsapp-ai-sales');
    this.router.navigate(['/projects', target]);
  }

  nextSlide() {
    const max = this.projects().length - 1;
    if (max <= 0) return;
    const nextIdx = this.currentIndex() >= max ? 0 : this.currentIndex() + 1;
    this.goToSlide(nextIdx);
  }

  prevSlide() {
    const max = this.projects().length - 1;
    if (max <= 0) return;
    const prevIdx = this.currentIndex() <= 0 ? max : this.currentIndex() - 1;
    this.goToSlide(prevIdx);
  }

  goToSlide(index: number) {
    this.currentIndex.set(index);
    this.scrollToCurrentIndex();
  }

  onTrackScroll() {
    if (!this.carouselTrack) return;
    const track = this.carouselTrack.nativeElement;
    const firstCard = track.firstElementChild as HTMLElement;
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 28;
    const scrollPos = track.scrollLeft;
    const calculatedIndex = Math.round(scrollPos / (cardWidth + gap));

    if (calculatedIndex >= 0 && calculatedIndex < this.projects().length && calculatedIndex !== this.currentIndex()) {
      this.currentIndex.set(calculatedIndex);
    }
  }

  private scrollToCurrentIndex() {
    if (!this.carouselTrack) return;
    const track = this.carouselTrack.nativeElement;
    const targetCard = track.children[this.currentIndex()] as HTMLElement;
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }
}
