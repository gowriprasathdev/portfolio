import {
  Component,
  signal,
  computed,
  effect,
  HostListener,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ThemeService } from '../../../core/services/theme.service';
import {
  WHATSAPP_SALES_CASE_STUDY,
  ArchitectureNode,
  ArchitectureFlow,
  ProductionScreenshot,
  PipelineTraceStage,
  CaseStudyData,
  getMermaidArchitectureCode
} from './case-study-data';
import {
  INVENTORY_ETL_CASE_STUDY,
  getInventoryEtlMermaidCode
} from './inventory-etl-case-study-data';
import {
  SOCIAL_POSTER_CASE_STUDY,
  getSocialPosterMermaidCode
} from './social-poster-case-study-data';

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
  private sanitizer = inject(DomSanitizer);
  themeService = inject(ThemeService);

  dataSignal = signal<CaseStudyData>(WHATSAPP_SALES_CASE_STUDY);
  get data(): CaseStudyData {
    return this.dataSignal();
  }

  Math = Math;

  // Pipeline Trace State
  activePipelineTraceId = signal<string>('model-parsing');
  copiedSnippetKey = signal<string | null>(null);

  activePipelineTrace = computed<PipelineTraceStage | undefined>(() => {
    const list = this.dataSignal().pipelineTraces || [];
    return list.find(t => t.id === this.activePipelineTraceId()) || list[0];
  });

  // Dynamically themed Mermaid syntax
  mermaidCode = computed(() => {
    const isLight = this.themeService.theme() === 'light';
    if (this.dataSignal().id === 'inventory-etl-pipeline') {
      return getInventoryEtlMermaidCode(isLight ? 'light' : 'dark');
    }
    if (this.dataSignal().id === 'social-poster-publisher') {
      return getSocialPosterMermaidCode(isLight ? 'light' : 'dark');
    }
    return getMermaidArchitectureCode(isLight ? 'light' : 'dark');
  });

  private lastRenderedTheme: 'light' | 'dark' | null = null;
  private lastRenderedCaseStudyId: string | null = null;

  constructor() {
    this.initCaseStudyFromUrl();
    effect(() => {
      // Track theme & case study changes
      const currentTheme = this.themeService.theme();
      const currentCaseStudyId = this.dataSignal().id;
      if (
        isPlatformBrowser(this.platformId) &&
        this.activeTab() === 'architecture' &&
        this.archViewMode() === 'mermaid' &&
        (this.lastRenderedTheme !== currentTheme || this.lastRenderedCaseStudyId !== currentCaseStudyId)
      ) {
        this.renderMermaid();
      }
    });
  }

  private initCaseStudyFromUrl() {
    this.mermaidSvg.set(null);
    this.lastRenderedCaseStudyId = null;
    const url = this.router.url;
    if (url.includes('inventory-etl-pipeline')) {
      this.dataSignal.set(INVENTORY_ETL_CASE_STUDY);
      this.activeNodeId.set('faas-ingress-daemon');
      this.activePipelineTraceId.set('model-parsing');
      this.selectedFlowId.set('all');
    } else if (url.includes('social-poster-publisher') || url.includes('social-poster') || url.includes('promotional-poster')) {
      this.dataSignal.set(SOCIAL_POSTER_CASE_STUDY);
      this.activeNodeId.set('poster-studio-ui');
      this.activePipelineTraceId.set('asset-framing');
      this.selectedFlowId.set('all');
    } else {
      this.dataSignal.set(WHATSAPP_SALES_CASE_STUDY);
      this.activeNodeId.set('ingress-gateway');
      this.selectedFlowId.set('all');
    }
  }

  // Active Main Navigation Tab (Simulator & Old Topology removed)
  activeTab = signal<'gallery' | 'architecture' | 'challenges'>('gallery');

  // Gallery State
  activeScreenshotId = signal<string>('general-inquiry');
  activeSubImageIndex = signal<number>(0);
  activeCategory = signal<string>('all');
  lightboxImage = signal<{ src: string; title: string; badge: string; desc: string } | null>(null);

  // Architecture Diagram State
  archViewMode = signal<'diagram' | 'mermaid'>('diagram');
  selectedFlowId = signal<string>('all');
  activeNodeId = signal<string>('ingress-gateway');
  zoomLevel = signal<number>(1);
  mermaidZoomLevel = signal<number>(1);
  copiedMermaid = signal<boolean>(false);
  mermaidSvg = signal<SafeHtml | null>(null);
  isMermaidRendering = signal<boolean>(false);

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

  // Architecture Computeds
  activeFlow = computed<ArchitectureFlow>(() => {
    const flows = this.data.flows || [];
    return flows.find(f => f.id === this.selectedFlowId()) || flows[0];
  });

  activeFlowNodesSet = computed<Set<string>>(() => {
    return new Set(this.activeFlow().activeNodeIds || []);
  });

  activeNode = computed<ArchitectureNode>(() => {
    const list = this.data.nodes || [];
    return list.find(n => n.id === this.activeNodeId()) || list[1]; // default to ingress-gateway
  });

  // Nodes grouped by Architectural Tier
  tier1Nodes = computed<ArchitectureNode[]>(() => {
    return this.data.nodes.filter(n => n.layer === 'Ingress & Decoupling' && n.category === 'Edge');
  });

  tier2Nodes = computed<ArchitectureNode[]>(() => {
    return this.data.nodes.filter(n => n.layer === 'Ingress & Decoupling' && n.category !== 'Edge');
  });

  tier3Nodes = computed<ArchitectureNode[]>(() => {
    return this.data.nodes.filter(n => n.layer === 'Processing & Orchestration');
  });

  tier4Nodes = computed<ArchitectureNode[]>(() => {
    return this.data.nodes.filter(n => n.layer === 'Cognitive & AI Tier');
  });

  tier5Nodes = computed<ArchitectureNode[]>(() => {
    return this.data.nodes.filter(n => n.layer === 'Data & Persistence');
  });

  tier6Nodes = computed<ArchitectureNode[]>(() => {
    return this.data.nodes.filter(n => n.layer === 'Outbound & Client Egress');
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
  }

  setTab(tab: 'gallery' | 'architecture' | 'challenges') {
    this.activeTab.set(tab);
    if (tab === 'architecture' && this.archViewMode() === 'mermaid') {
      if (!this.mermaidSvg() || this.lastRenderedTheme !== this.themeService.theme() || this.lastRenderedCaseStudyId !== this.dataSignal().id) {
        this.renderMermaid();
      }
    }
  }

  // Pipeline Trace Methods
  selectPipelineTrace(id: string) {
    this.activePipelineTraceId.set(id);
  }

  copySnippet(code: string, key: string) {
    if (isPlatformBrowser(this.platformId) && navigator?.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        this.copiedSnippetKey.set(key);
        setTimeout(() => this.copiedSnippetKey.set(null), 2000);
      });
    }
  }

  // Gallery methods
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

  // Architecture Diagram Methods
  setArchViewMode(mode: 'diagram' | 'mermaid') {
    this.archViewMode.set(mode);
    if (mode === 'mermaid') {
      if (!this.mermaidSvg() || this.lastRenderedTheme !== this.themeService.theme() || this.lastRenderedCaseStudyId !== this.dataSignal().id) {
        this.renderMermaid();
      }
    }
  }

  selectFlow(flowId: string) {
    this.selectedFlowId.set(flowId);
    // If current selected node is not in this flow, select the first active node
    const flow = this.data.flows.find(f => f.id === flowId);
    if (flow && flow.activeNodeIds.length > 0 && !flow.activeNodeIds.includes(this.activeNodeId())) {
      this.activeNodeId.set(flow.activeNodeIds[0]);
    }
  }

  selectNode(id: string) {
    this.activeNodeId.set(id);
  }

  isNodeActiveInFlow(nodeId: string): boolean {
    if (this.selectedFlowId() === 'all') return true;
    return this.activeFlowNodesSet().has(nodeId);
  }

  zoomIn() {
    this.zoomLevel.update(z => Math.min(1.4, Number((z + 0.1).toFixed(2))));
  }

  zoomOut() {
    this.zoomLevel.update(z => Math.max(0.7, Number((z - 0.1).toFixed(2))));
  }

  resetZoom() {
    this.zoomLevel.set(1);
  }

  zoomInMermaid() {
    this.mermaidZoomLevel.update(z => Math.min(1.5, Number((z + 0.1).toFixed(2))));
  }

  zoomOutMermaid() {
    this.mermaidZoomLevel.update(z => Math.max(0.6, Number((z - 0.1).toFixed(2))));
  }

  resetMermaidZoom() {
    this.mermaidZoomLevel.set(1);
  }

  copyMermaidCode() {
    if (isPlatformBrowser(this.platformId) && navigator?.clipboard) {
      navigator.clipboard.writeText(this.mermaidCode()).then(() => {
        this.copiedMermaid.set(true);
        setTimeout(() => this.copiedMermaid.set(false), 2500);
      });
    }
  }

  async renderMermaid() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.isMermaidRendering.set(true);
    try {
      const isLight = this.themeService.theme() === 'light';
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: isLight ? 'default' : 'dark',
        securityLevel: 'loose',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        flowchart: {
          htmlLabels: true,
          useMaxWidth: false,
          curve: 'basis',
          nodeSpacing: 45,
          rankSpacing: 45,
          padding: 16
        },
        themeVariables: isLight
          ? {
              darkMode: false,
              background: '#ffffff',
              mainBkg: '#ffffff',
              nodeBorder: '#0d9488',
              clusterBkg: '#f8fafc',
              clusterBorder: 'rgba(13, 148, 136, 0.25)',
              titleColor: '#0f172a',
              textColor: '#0f172a',
              lineColor: '#0d9488',
              fontSize: '12px'
            }
          : {
              darkMode: true,
              background: '#0a0e17',
              mainBkg: '#121824',
              nodeBorder: '#41d1c2',
              clusterBkg: '#0d131f',
              clusterBorder: 'rgba(65, 209, 194, 0.25)',
              titleColor: '#f1f5f9',
              textColor: '#f1f5f9',
              lineColor: '#41d1c2',
              fontSize: '12px'
            }
      });
      const id = 'mermaid-render-' + Date.now();
      const { svg } = await mermaid.render(id, this.mermaidCode());
      this.mermaidSvg.set(this.sanitizer.bypassSecurityTrustHtml(svg));
      this.lastRenderedTheme = isLight ? 'light' : 'dark';
      this.lastRenderedCaseStudyId = this.dataSignal().id;
    } catch (err) {
      console.error('Error rendering Mermaid diagram:', err);
    } finally {
      this.isMermaidRendering.set(false);
    }
  }

  selectChallenge(idx: number) {
    this.activeChallengeIndex.set(idx);
  }

  goBackToProjects() {
    this.router.navigate(['/'], { fragment: 'projects' });
  }
}
