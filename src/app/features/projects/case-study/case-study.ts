import {
  Component,
  signal,
  computed,
  HostListener,
  OnInit,
  ChangeDetectionStrategy,
  inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  WHATSAPP_SALES_CASE_STUDY,
  ArchitectureNode,
  SimulationScenario,
  ProductionScreenshot,
  CaseStudyData
} from './case-study-data';

@Component({
  selector: 'app-case-study',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './case-study.html',
  styleUrl: './case-study.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseStudyComponent implements OnInit {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  data: CaseStudyData = WHATSAPP_SALES_CASE_STUDY;

  activeTab = signal<'gallery' | 'architecture' | 'simulator' | 'challenges'>('gallery');

  // Gallery State
  activeScreenshotId = signal<string>('appointment-booking');
  activeCategory = signal<string>('all');
  lightboxImage = signal<{ src: string; title: string; badge: string; desc: string } | null>(null);

  // Architecture State
  activeNodeId = signal<string>('messaging-ingress-service');

  // Simulator State
  activeScenarioId = signal<string>('appointment-flow');
  visibleMessagesCount = signal<number>(1);
  isTyping = signal<boolean>(false);

  // Challenges State
  activeChallengeIndex = signal<number>(0);

  filteredScreenshots = computed<ProductionScreenshot[]>(() => {
    const list = this.data.gallery || [];
    const cat = this.activeCategory();
    if (cat === 'all') return list;
    return list.filter(item => item.category.toLowerCase().includes(cat.toLowerCase()));
  });

  activeScreenshot = computed<ProductionScreenshot | undefined>(() => {
    const list = this.data.gallery || [];
    return list.find(s => s.id === this.activeScreenshotId()) || list[0];
  });

  activeScenario = computed<SimulationScenario>(() => {
    const list = this.data.scenarios || [];
    return list.find(s => s.id === this.activeScenarioId()) || list[0];
  });

  activeNode = computed<ArchitectureNode | undefined>(() => {
    const list = this.data.nodes || [];
    return list.find(n => n.id === this.activeNodeId()) || list[0];
  });

  @HostListener('window:keydown.escape')
  onEscape() {
    if (this.lightboxImage()) {
      this.closeLightbox();
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    this.runScenarioAnimation();
  }

  setTab(tab: 'gallery' | 'architecture' | 'simulator' | 'challenges') {
    this.activeTab.set(tab);
  }

  selectScreenshot(id: string) {
    this.activeScreenshotId.set(id);
  }

  filterCategory(cat: string) {
    this.activeCategory.set(cat);
    const visible = this.filteredScreenshots();
    if (visible.length && !visible.some(s => s.id === this.activeScreenshotId())) {
      this.activeScreenshotId.set(visible[0].id);
    }
  }

  openLightbox(src: string, title: string, badge: string, desc: string) {
    this.lightboxImage.set({ src, title, badge, desc });
  }

  closeLightbox() {
    this.lightboxImage.set(null);
  }

  selectNode(id: string) {
    this.activeNodeId.set(id);
  }

  selectScenario(id: string) {
    if (this.activeScenarioId() === id) return;
    this.activeScenarioId.set(id);
    this.runScenarioAnimation();
  }

  runScenarioAnimation() {
    this.visibleMessagesCount.set(1);
    this.isTyping.set(true);

    const total = this.activeScenario()?.messages?.length || 1;
    if (total <= 1) {
      this.isTyping.set(false);
      return;
    }

    setTimeout(() => {
      this.isTyping.set(false);
      this.visibleMessagesCount.set(total);
    }, 600);
  }

  selectChallenge(idx: number) {
    this.activeChallengeIndex.set(idx);
  }

  goBackToProjects() {
    this.router.navigate(['/'], { fragment: 'projects' });
  }
}
