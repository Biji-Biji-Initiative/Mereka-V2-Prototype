import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsPageHeaderComponent } from '../components/page-header.component';
import { ServiceTableComponent } from '../components/service-table.component';
import { AnalyticsFilterBarComponent, FilterChip } from '../components/analytics-filter-bar.component';
import { AnalyticsMockService } from '../services/analytics-mock.service';
import { ServiceCategory, ServiceRow } from '../services/analytics.types';

// Generic All-{category} list page — driven by route data so a single component
// powers /programme, /courses, /experience, /expertise, /gig (Figma frames
// 5208:186993, 5208:191977, 5208:190155, 5208:188224 and the matching
// "all" variants).
@Component({
  standalone: true,
  imports: [CommonModule, AnalyticsPageHeaderComponent, ServiceTableComponent, AnalyticsFilterBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mereka-analytics-page-header
      [title]="title"
      [subtitle]="subtitle"
      [backTo]="'/dashboard/analytics'"
      backLabel="Back to analytics"
      [showSearch]="true"
      [searchPlaceholder]="'Search ' + nameLabel.toLowerCase() + ' by name, focus, or lead…'"
      [showExport]="true"
      (searchChange)="search.set($event)"
      (export)="onExport()" />

    <mereka-analytics-filter-bar
      class="block mb-6"
      [chips]="chips()"
      (toggle)="toggleChip($event)"
      (reset)="resetChips()" />

    <mereka-service-table
      [rows]="filtered()"
      [nameLabel]="nameLabel"
      (rowClick)="openDetail($event)" />

    <div class="mt-4 flex items-center justify-between text-sm text-neutral-500">
      <span>Showing 1–{{ filtered().length }} of {{ filtered().length }}</span>
      <div class="flex items-center gap-1">
        <button type="button"
                class="w-8 h-8 rounded-full border border-neutral-200 text-neutral-500 hover:bg-neutral-50 inline-flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <button *ngFor="let p of [1,2,3]"
                type="button"
                class="w-8 h-8 rounded-full text-sm inline-flex items-center justify-center"
                [ngClass]="p === 1 ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-50'">
          {{ p }}
        </button>
        <button type="button"
                class="w-8 h-8 rounded-full border border-neutral-200 text-neutral-500 hover:bg-neutral-50 inline-flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
      </div>
    </div>

    <button type="button"
            class="fixed bottom-6 right-6 inline-flex items-center gap-2 h-10 px-4 rounded-full bg-neutral-900 text-white text-sm shadow-md hover:bg-neutral-800">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke-linejoin="round" /></svg>
      Filter
    </button>
  `,
})
export class CategoryListPage {
  @Input() category!: ServiceCategory;
  @Input() title!: string;
  @Input() subtitle = 'Browse the full catalogue. Click any row to open details.';
  @Input() nameLabel = 'Service';

  private readonly mock = inject(AnalyticsMockService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly search = signal('');
  protected readonly chips = signal<FilterChip[]>([
    { id: 'mode-hybrid', label: 'Hybrid', dot: '#a855f7' },
    { id: 'mode-online', label: 'Online', dot: '#3b82f6' },
    { id: 'mode-physical', label: 'Physical', dot: '#22c55e' },
    { id: 'rating-high', label: '4★ and above', dot: '#f59e0b' },
    { id: 'fill-high', label: 'High fill rate', dot: '#22c55e' },
  ]);

  protected readonly all = computed<ServiceRow[]>(() => this.mock.rowsFor(this.category));

  protected readonly filtered = computed<ServiceRow[]>(() => {
    const q = this.search().trim().toLowerCase();
    const active = this.chips().filter((c) => c.active).map((c) => c.id);
    return this.all().filter((r) => {
      if (q && !`${r.name} ${r.owner}`.toLowerCase().includes(q)) return false;
      for (const id of active) {
        if (id === 'mode-hybrid' && r.mode !== 'Hybrid') return false;
        if (id === 'mode-online' && r.mode !== 'Online' && r.mode !== 'Virtual') return false;
        if (id === 'mode-physical' && r.mode !== 'Physical') return false;
        if (id === 'rating-high' && r.rating < 4) return false;
        if (id === 'fill-high' && r.fillRate < 80) return false;
      }
      return true;
    });
  });

  toggleChip(id: string) {
    this.chips.update((arr) => arr.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  }
  resetChips() {
    this.chips.update((arr) => arr.map((c) => ({ ...c, active: false })));
  }
  openDetail(row: ServiceRow) {
    this.router.navigate([row.id], { relativeTo: this.route });
  }
  onExport() {
    // eslint-disable-next-line no-console
    console.info(`[analytics] export ${this.category}`);
  }
}
