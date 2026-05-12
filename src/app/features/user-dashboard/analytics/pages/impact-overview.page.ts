import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent } from '../components/kpi-card.component';
import { ImpactFilterPanelComponent } from '../components/impact-filter-panel.component';
import { AnalyticsFilterBarComponent, FilterChip } from '../components/analytics-filter-bar.component';
import { ChartLineComponent } from '../components/chart-line.component';
import { ChartBarComponent } from '../components/chart-bar.component';
import { AnalyticsPageHeaderComponent } from '../components/page-header.component';
import { AnalyticsMockService } from '../services/analytics-mock.service';

// Landing page of the Analytics dashboard — composes the KPI strip, the
// impact filter panel, and trend / category charts (Figma 5208:182151,
// 5208:182152, 5208:184630, 5208:184231, 5208:184386, 5208:190137).
@Component({
  standalone: true,
  imports: [
    CommonModule,
    KpiCardComponent,
    ImpactFilterPanelComponent,
    AnalyticsFilterBarComponent,
    ChartLineComponent,
    ChartBarComponent,
    AnalyticsPageHeaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mereka-analytics-page-header
      title="Analytics dashboard"
      subtitle="A single pane of glass across every service you run on Mereka. Filter by audience, outcome, channel — and drill into any category."
      [showExport]="true"
      (export)="onExport()">
      <div slot="actions" class="flex items-center gap-1.5 h-10 px-3 rounded-full border border-neutral-200 bg-white text-sm text-neutral-700">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" stroke-linecap="round" />
        </svg>
        Last 30 days
      </div>
    </mereka-analytics-page-header>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <mereka-analytics-kpi-card *ngFor="let k of mock.impactKpis()" [card]="k" />
    </section>

    <mereka-analytics-filter-bar
      class="block mb-6"
      [chips]="chips()"
      (toggle)="toggleChip($event)"
      (reset)="resetChips()" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section class="lg:col-span-2 bg-white border border-neutral-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="font-semibold text-neutral-900">Reach over time</h2>
            <p class="text-xs text-neutral-500">Unique participants per month</p>
          </div>
          <span class="text-xs text-neutral-500">2026</span>
        </div>
        <mereka-analytics-chart-line [series]="mock.trendByMonth()" stroke="#111827" fill="#111827" />
      </section>

      <section class="bg-white border border-neutral-200 rounded-lg p-6">
        <h2 class="font-semibold text-neutral-900 mb-4">Revenue by category</h2>
        <p class="text-xs text-neutral-500 mb-3">RM millions, YTD</p>
        <mereka-analytics-chart-bar [series]="mock.revenueByCategory()" color="#a855f7" format="currency-m" />
      </section>
    </div>

    <section class="mt-6">
      <mereka-impact-filter-panel
        [groups]="mock.impactFilters()"
        (toggle)="onPanelToggle($event)"
        (clearAll)="resetChips()" />
    </section>

    <section class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div *ngFor="let h of highlights" class="bg-white border border-neutral-200 rounded-lg p-5">
        <div class="text-sm font-medium text-neutral-900">{{ h.title }}</div>
        <div class="mt-2 text-2xl font-semibold tracking-tight">{{ h.value }}</div>
        <div class="mt-1 text-xs text-neutral-500">{{ h.note }}</div>
      </div>
    </section>
  `,
})
export class ImpactOverviewPage {
  protected readonly mock = inject(AnalyticsMockService);

  protected readonly chips = signal<FilterChip[]>([
    { id: 'audience', label: 'Audience', dot: '#a855f7', count: 5 },
    { id: 'outcomes', label: 'Outcomes', dot: '#22c55e', count: 3 },
    { id: 'channels', label: 'Channels', dot: '#111827', count: 4 },
    { id: 'service-type', label: 'Service type', dot: '#3b82f6', count: 5 },
    { id: 'date', label: 'Date range', dot: '#f59e0b', count: 1 },
    { id: 'region', label: 'Region', dot: '#ef4444', count: 6 },
  ]);

  protected readonly highlights = [
    { title: 'Top performing programme', value: 'Climate Innovators', note: '92% fill rate · 4.8★' },
    { title: 'Largest audience segment', value: 'Women, 30–45', note: '34% of all participants' },
    { title: 'Fastest growing service', value: 'AI for Educators', note: '+118% MoM bookings' },
  ];

  toggleChip(id: string) {
    this.chips.update((arr) => arr.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  }
  resetChips() {
    this.chips.update((arr) => arr.map((c) => ({ ...c, active: false })));
  }
  onPanelToggle({ groupId, optionId }: { groupId: string; optionId: string }) {
    this.mock.impactFilters.update((groups) =>
      groups.map((g) =>
        g.id !== groupId ? g : { ...g, options: g.options.map((o) => o.id === optionId ? { ...o, selected: !o.selected } : o) },
      ),
    );
  }
  onExport() {
    // Placeholder — wire up to /analytics/export once the API exists.
    // eslint-disable-next-line no-console
    console.info('[analytics] export requested');
  }
}
