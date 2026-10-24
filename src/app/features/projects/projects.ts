import { Component, inject, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { ProjectItem } from '../../core/models/portfolio-data.model';
import { ArchitectureModalComponent } from './architecture-modal/architecture-modal';
import { WHATSAPP_SALES_CASE_STUDY, CaseStudyData } from './architecture-modal/architecture-data';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ArchitectureModalComponent],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectsComponent {
  state = inject(PortfolioStateService);

  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLDivElement>;

  currentIndex = signal<number>(0);
  selectedCaseStudy = signal<CaseStudyData | null>(null);

  projects = computed<ProjectItem[]>(() => {
    return this.state.portfolioData()?.projects || [];
  });

  openArchitecture(project: ProjectItem) {
    if (project.architectureId === 'whatsapp-sales') {
      this.selectedCaseStudy.set(WHATSAPP_SALES_CASE_STUDY);
    }
  }

  closeArchitecture() {
    this.selectedCaseStudy.set(null);
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
    const gap = 28; // matching 1.75rem grid gap
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
