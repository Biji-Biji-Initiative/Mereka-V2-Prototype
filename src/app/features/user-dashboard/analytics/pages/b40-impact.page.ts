import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsPageHeaderComponent } from '../components/page-header.component';
import { KpiCardComponent } from '../components/kpi-card.component';
import { ChartBarComponent } from '../components/chart-bar.component';
import { AnalyticsMockService } from '../services/analytics-mock.service';
import { KpiCard, SeriesPoint } from '../services/analytics.types';

// B40 impact page (Figma 5208:188897, 5208:189552 — the "all programmes /
// B40 impact" frames). Highlights low-income participation outcomes.
@Component({
  standalone: true,
  imports: [CommonModule, AnalyticsPageHeaderComponent, KpiCardComponent, ChartBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mereka-analytics-page-header
      title="B40 impact"
      subtitle="Track participation, outcomes, and income uplift across the B40 segment."
      [backTo]="'/dashboard/analytics'"
      backLabel="Back to analytics" />

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <mereka-analytics-kpi-card *ngFor="let k of kpis" [card]="k" />
    </section>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section class="bg-white border border-neutral-200 rounded-lg p-6">
        <h2 class="font-semibold text-neutral-900 mb-1">B40 participation by service</h2>
        <p class="text-xs text-neutral-500 mb-4">Share of B40 participants per category</p>
        <mereka-analytics-chart-bar [series]="byCategory" color="#22c55e" format="percent" />
      </section>

      <section class="bg-white border border-neutral-200 rounded-lg p-6">
        <h2 class="font-semibold text-neutral-900 mb-1">Income uplift distribution</h2>
        <p class="text-xs text-neutral-500 mb-4">Self-reported monthly RM uplift, post-programme</p>
        <mereka-analytics-chart-bar [series]="uplift" color="#a855f7" />
      </section>
    </div>
  `,
})
export class B40ImpactPage {
  private readonly mock = inject(AnalyticsMockService);

  get kpis(): KpiCard[] {
    const s = this.mock.b40Summary();
    return [
      { label: 'B40 reach', value: `${s.reachPct.toFixed(1)}%`, delta: { value: '+2.1%', trend: 'up' }, hint: 'of all participants' },
      { label: 'Unique B40', value: s.uniqueB40.toLocaleString(), hint: 'last 12 months' },
      { label: 'Programmes with B40', value: String(s.programmesWithB40), hint: 'with verified data' },
      { label: 'Avg income uplift', value: `RM ${s.avgIncomeUplift}`, delta: { value: '+RM 38', trend: 'up' }, hint: 'monthly' },
    ];
  }

  readonly byCategory: SeriesPoint[] = [
    { label: 'Programmes', value: 28 },
    { label: 'Courses', value: 22 },
    { label: 'Experiences', value: 14 },
    { label: 'Expertise', value: 9 },
    { label: 'Gigs', value: 6 },
  ];

  readonly uplift: SeriesPoint[] = [
    { label: 'RM 0–100', value: 312 },
    { label: 'RM 100–250', value: 488 },
    { label: 'RM 250–500', value: 274 },
    { label: 'RM 500–1k', value: 142 },
    { label: 'RM 1k+', value: 68 },
  ];
}
