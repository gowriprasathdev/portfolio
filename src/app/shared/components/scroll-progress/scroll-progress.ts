import {
  Component,
  signal,
  computed,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
  ChangeDetectionStrategy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  templateUrl: './scroll-progress.html',
  styleUrl: './scroll-progress.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollProgressComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  scrollPercentage = signal<number>(0);
  isVisible = signal<boolean>(false);
  isHovered = signal<boolean>(false);

  // Circumference of SVG circle: 2 * PI * r = 2 * PI * 18 ≈ 113.1
  readonly radius = 18;
  readonly circumference = 2 * Math.PI * 18;

  dashOffset = computed(() => {
    const pct = this.scrollPercentage();
    return this.circumference - (pct / 100) * this.circumference;
  });

  private scrollHandler?: () => void;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateScroll();
      let ticking = false;

      this.scrollHandler = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            this.updateScroll();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', this.scrollHandler, { passive: true });
      window.addEventListener('resize', this.scrollHandler, { passive: true });
    }
  }

  ngOnDestroy() {
    if (this.scrollHandler && isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.scrollHandler);
      window.removeEventListener('resize', this.scrollHandler);
    }
  }

  private updateScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (docHeight <= 0) {
      this.scrollPercentage.set(0);
      this.isVisible.set(false);
      return;
    }

    const pct = Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100)));
    this.scrollPercentage.set(pct);
    this.isVisible.set(scrollTop > 40);
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
