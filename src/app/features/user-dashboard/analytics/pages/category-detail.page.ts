import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AnalyticsPageHeaderComponent } from '../components/page-header.component';
import { KpiCardComponent } from '../components/kpi-card.component';
import { ChartLineComponent } from '../components/chart-line.component';
import { ChartBarComponent } from '../components/chart-bar.component';
import { AnalyticsMockService } from '../services/analytics-mock.service';
import { KpiCard, ServiceCategory, ServiceRow, SeriesPoint } from '../services/analytics.types';

// Individual analytics page for a single service. One component covers all
// categories (Figma 5208:190155 = experiences/individual, 5208:191977 =
// gigs/individual etc.) — wiring through the category Input keeps URLs clean.
@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, AnalyticsPageHeaderComponent, KpiCardComponent, ChartLineComponent, ChartBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="row() as r; else missing">
      <mereka-analytics-page-header
        [title]="r.name"
        [subtitle]="r.type + ' · ' + r.mode + ' · ' + r.location"
        [backTo]="backTo"
        [backLabel]="'Back to ' + backLabel" />

      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <mereka-analytics-kpi-card *ngFor="let k of kpis()" [card]="k" />
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section class="lg:col-span-2 bg-white border border-neutral-200 rounded-lg p-6">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h2 class="font-semibold text-neutral-900">Bookings &amp; revenue</h2>
              <p class="text-xs text-neutral-500">Past 12 weeks</p>
            </div>
          </div>
          <mereka-analytics-chart-line [series]="bookingTrend()" stroke="#111827" fill="#111827" />
        </section>

        <section class="bg-white border border-neutral-200 rounded-lg p-6">
          <h2 class="font-semibold text-neutral-900 mb-3">Audience mix</h2>
          <mereka-analytics-chart-bar [series]="audienceMix" color="#a855f7" format="percent" />
        </section>
      </div>

      <section class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white border border-neutral-200 rounded-lg p-6">
          <h2 class="font-semibold text-neutral-900 mb-3">Reviews summary</h2>
          <div class="flex items-center gap-4">
            <div class="text-4xl font-semibold tabular-nums">{{ r.rating | number:'1.1-1' }}</div>
            <div class="text-warning text-2xl">★★★★★</div>
            <div class="text-sm text-neutral-500">{{ r.tickets }} responses</div>
          </div>
          <ul class="mt-4 space-y-2 text-sm">
            <li *ngFor="let s of ratingBuckets()" class="grid grid-cols-[40px_1fr_40px] items-center gap-2">
              <span class="text-neutral-500">{{ s.label }}★</span>
              <div class="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div class="h-full bg-warning rounded-full" [style.width.%]="s.pct"></div>
              </div>
              <span class="text-right text-neutral-500">{{ s.pct }}%</span>
            </li>
          </ul>
        </div>

        <div class="bg-white border border-neutral-200 rounded-lg p-6">
          <h2 class="font-semibold text-neutral-900 mb-3">Conversion funnel</h2>
          <ul class="space-y-2 text-sm">
            <li *ngFor="let f of funnel" class="grid grid-cols-[120px_1fr_60px] items-center gap-2">
              <span class="text-neutral-600">{{ f.label }}</span>
              <div class="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full" [style.width.%]="f.pct" [style.background]="'#111827'"></div>
              </div>
              <span class="text-right tabular-nums">{{ f.count | number }}</span>
            </li>
          </ul>
        </div>
      </section>
    </ng-container>

    <ng-template #missing>
      <div class="bg-white border border-neutral-200 rounded-lg p-10 text-center">
        <p class="text-neutral-500">Service not found.</p>
        <a [routerLink]="backTo" class="inline-block mt-3 text-sm text-neutral-900 underline">Back to {{ backLabel }}</a>
      </div>
    </ng-template>
  `,
})
export class CategoryDetailPage {
  @Input() category!: ServiceCategory;
  @Input() backTo!: string;
  @Input() backLabel!: string;

  private readonly mock = inject(AnalyticsMockService);
  private readonly route = inject(ActivatedRoute);

  protected readonly id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') || '')), {
    initialValue: '',
  });

  protected readonly row = computed<ServiceRow | undefined>(() =>
    this.mock.detail(this.category, this.id()),
  );

  protected readonly kpis = computed<KpiCard[]>(() => {
    const r = this.row();
    if (!r) return [];
    return [
      { label: 'Tickets sold', value: String(r.tickets), delta: { value: '+12%', trend: 'up' }, hint: 'vs prior cohort' },
      { label: 'Fill rate', value: `${r.fillRate}%`, delta: { value: r.fillRate >= 80 ? '+4%' : '-3%', trend: r.fillRate >= 80 ? 'up' : 'down' } },
      { label: 'Avg rating', value: r.rating.toFixed(1), hint: `${Math.round(r.tickets * 0.6)} reviews` },
      { label: 'Revenue', value: `RM ${r.revenue.toLocaleString()}`, delta: { value: '+RM 4.2k', trend: 'up' } },
    ];
  });

  protected readonly bookingTrend = signal<SeriesPoint[]>(
    Array.from({ length: 12 }, (_, i) => ({
      label: `W${i + 1}`,
      value: Math.round(40 + Math.sin(i / 1.6) * 18 + i * 3),
    })),
  );

  protected readonly audienceMix: SeriesPoint[] = [
    { label: 'Women', value: 42 },
    { label: 'Youth', value: 31 },
    { label: 'B40', value: 18 },
    { label: 'Rural', value: 9 },
  ];

  protected readonly funnel = [
    { label: 'Views', pct: 100, count: 12480 },
    { label: 'Clicks', pct: 38, count: 4744 },
    { label: 'Sign-ups', pct: 14, count: 1742 },
    { label: 'Bookings', pct: 6, count: 752 },
  ];

  protected readonly ratingBuckets = computed(() => {
    const r = this.row();
    if (!r) return [];
    const base = r.rating;
    return [
      { label: 5, pct: Math.round(base * 14) },
      { label: 4, pct: 22 },
      { label: 3, pct: 8 },
      { label: 2, pct: 3 },
      { label: 1, pct: 1 },
    ];
  });
}
