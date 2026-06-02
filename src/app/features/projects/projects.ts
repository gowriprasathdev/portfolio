import { Component, inject, computed } from '@angular/core';
import { PortfolioStateService } from '../../core/services/portfolio-state.service';
import { ProjectItem } from '../../core/models/portfolio-data.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectsComponent {
  state = inject(PortfolioStateService);

  // Compute a list of unique tags from projects for filtering
  filterCategories = computed(() => {
    const data = this.state.portfolioData();
    if (!data) return ['All'];
    
    // Extract all tags, count occurrences to find top categories
    const tagCounts: { [key: string]: number } = {};
    data.projects.forEach(p => {
      p.tags.forEach(t => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });

    // Sort by count and take top 4 tags
    const topTags = Object.keys(tagCounts)
      .sort((a, b) => tagCounts[b] - tagCounts[a])
      .slice(0, 4);

    return ['All', ...topTags];
  });

  // Compute the list of projects matching the current filter category
  filteredProjects = computed<ProjectItem[]>(() => {
    const data = this.state.portfolioData();
    if (!data) return [];
    
    const activeCategory = this.state.selectedProjectCategory();
    if (activeCategory === 'All') {
      return data.projects;
    }
    
    return data.projects.filter(p => p.tags.includes(activeCategory));
  });

  selectCategory(category: string) {
    this.state.setProjectCategory(category);
  }
}
