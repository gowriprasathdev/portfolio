import {
  Component,
  signal,
  computed,
  HostListener,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
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
  activeScreenshotId = signal<string>('general-inquiry');
  activeSubImageIndex = signal<number>(0);
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
    const cat = this.activeCategory().toLowerCase();
    if (cat === 'all') return list;

    return list.filter(item => {
      const itemCat = item.category.toLowerCase();
      const itemId = item.id.toLowerCase();
      const itemTitle = item.title.toLowerCase();

      if (cat === 'inquiry' || cat === 'general') {
        return itemCat.includes('general') || itemCat.includes('inquiry') || itemId.includes('inquiry');
      }
      if (cat === 'appointment') {
        return itemCat.includes('appointment') || itemId.includes('appointment');
      }
      if (cat === 'voice' || cat === 'vernacular' || cat === 'multilingual') {
        return itemCat.includes('voice') || itemCat.includes('multilingual') || itemId.includes('voice') || itemId.includes('vernacular');
      }
      if (cat === 'deposit' || cat === 'payment' || cat === 'ocr') {
        return itemCat.includes('payment') || itemCat.includes('deposit') || itemCat.includes('ocr') || itemId.includes('deposit');
      }
      if (cat === 'broadcast') {
        return itemCat.includes('broadcast') || itemId.includes('broadcast');
      }

      return itemCat.includes(cat) || itemId.includes(cat) || itemTitle.includes(cat);
    });
  });

  activeScreenshot = computed<ProductionScreenshot | undefined>(() => {
    const visible = this.filteredScreenshots();
    if (visible.length > 0) {
      const match = visible.find(s => s.id === this.activeScreenshotId());
      return match || visible[0];
    }
    const list = this.data.gallery || [];
    return list.find(s => s.id === this.activeScreenshotId()) || list[0];
  });

  currentImageSrc = computed<string>(() => {
    const cur = this.activeScreenshot();
    if (!cur) return '';
    if (cur.galleryImages && cur.galleryImages.length > 0) {
      const idx = Math.min(this.activeSubImageIndex(), cur.galleryImages.length - 1);
      return cur.galleryImages[Math.max(0, idx)].src;
    }
    return cur.imageSrc;
  });

  currentImageCaption = computed<string>(() => {
    const cur = this.activeScreenshot();
    if (!cur) return '';
    if (cur.galleryImages && cur.galleryImages.length > 0) {
      const idx = Math.min(this.activeSubImageIndex(), cur.galleryImages.length - 1);
      return cur.galleryImages[Math.max(0, idx)].caption;
    }
    return cur.description;
  });

  activeScenario = computed<SimulationScenario>(() => {
    const list = this.data.scenarios || [];
    return list.find(s => s.id === this.activeScenarioId()) || list[0];
  });

  activeNode = computed<ArchitectureNode | undefined>(() => {
    const list = this.data.nodes || [];
    return list.find(n => n.id === this.activeNodeId()) || list[0];
  });

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.lightboxImage()) {
      if (event.key === 'Escape') {
        this.closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        this.prevLightboxImage();
      } else if (event.key === 'ArrowRight') {
        this.nextLightboxImage();
      }
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
    this.activeSubImageIndex.set(0);
  }

  filterCategory(cat: string) {
    this.activeCategory.set(cat);
    this.activeSubImageIndex.set(0);
    const visible = this.filteredScreenshots();
    if (visible.length > 0 && !visible.some(s => s.id === this.activeScreenshotId())) {
      this.activeScreenshotId.set(visible[0].id);
    }
  }

  selectSubImage(idx: number) {
    this.activeSubImageIndex.set(idx);
  }

  prevSubImage() {
    const cur = this.activeScreenshot();
    const total = cur?.galleryImages?.length || 1;
    this.activeSubImageIndex.update(idx => (idx - 1 + total) % total);
  }

  nextSubImage() {
    const cur = this.activeScreenshot();
    const total = cur?.galleryImages?.length || 1;
    this.activeSubImageIndex.update(idx => (idx + 1) % total);
  }

  openLightbox(src: string, title: string, badge: string, desc: string) {
    this.lightboxImage.set({ src, title, badge, desc });
  }

  prevLightboxImage() {
    const cur = this.activeScreenshot();
    const total = cur?.galleryImages?.length || 1;
    if (total <= 1) return;
    this.prevSubImage();
    const newSrc = this.currentImageSrc();
    const newCaption = this.currentImageCaption();
    if (cur) {
      this.lightboxImage.set({
        src: newSrc,
        title: cur.title,
        badge: cur.badge,
        desc: newCaption
      });
    }
  }

  nextLightboxImage() {
    const cur = this.activeScreenshot();
    const total = cur?.galleryImages?.length || 1;
    if (total <= 1) return;
    this.nextSubImage();
    const newSrc = this.currentImageSrc();
    const newCaption = this.currentImageCaption();
    if (cur) {
      this.lightboxImage.set({
        src: newSrc,
        title: cur.title,
        badge: cur.badge,
        desc: newCaption
      });
    }
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
