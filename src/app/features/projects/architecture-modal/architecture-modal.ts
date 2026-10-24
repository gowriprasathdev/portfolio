import {
  Component,
  input,
  output,
  signal,
  computed,
  HostListener,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CaseStudyData,
  WHATSAPP_SALES_CASE_STUDY,
  ArchitectureNode,
  SimulationScenario
} from './architecture-data';

@Component({
  selector: 'app-architecture-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './architecture-modal.html',
  styleUrl: './architecture-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchitectureModalComponent implements OnInit {
  data = input<CaseStudyData>(WHATSAPP_SALES_CASE_STUDY);
  closeModal = output<void>();

  activeTab = signal<'simulator' | 'architecture' | 'challenges' | 'metrics'>('simulator');
  activeScenarioId = signal<string>('smart-search');
  visibleMessagesCount = signal<number>(1);
  isTyping = signal<boolean>(false);
  activeNodeId = signal<string>('recon-social-service');

  activeScenario = computed<SimulationScenario>(() => {
    const list = this.data().scenarios;
    return list.find(s => s.id === this.activeScenarioId()) || list[0];
  });

  activeNode = computed<ArchitectureNode | null>(() => {
    return this.data().nodes.find(n => n.id === this.activeNodeId()) || this.data().nodes[0];
  });

  @HostListener('window:keydown.escape')
  onEscape() {
    this.closeModal.emit();
  }

  ngOnInit() {
    this.runScenarioAnimation();
  }

  setTab(tab: 'simulator' | 'architecture' | 'challenges' | 'metrics') {
    this.activeTab.set(tab);
  }

  selectScenario(id: string) {
    if (this.activeScenarioId() === id) return;
    this.activeScenarioId.set(id);
    this.runScenarioAnimation();
  }

  runScenarioAnimation() {
    this.visibleMessagesCount.set(1);
    this.isTyping.set(true);

    const total = this.activeScenario().messages.length;
    if (total <= 1) {
      this.isTyping.set(false);
      return;
    }

    setTimeout(() => {
      this.isTyping.set(false);
      this.visibleMessagesCount.set(total);
    }, 600);
  }

  selectNode(id: string) {
    this.activeNodeId.set(id);
  }
}
