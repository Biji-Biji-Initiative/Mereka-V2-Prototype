import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeriesPoint } from '../services/analytics.types';

@Component({
  selector: 'mereka-analytics-chart-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="space-y-2.5">
      <li *ngFor="let r of rows()" class="grid grid-cols-[140px_1fr_64px] items-center gap-3 text-sm">
        <span class="text-neutral-600 truncate">{{ r.label }}</span>
        <div class="h-2 rounded-full bg-neutral-100 overflow-hidden">
          <div class="h-full rounded-full" [style.width.%]="r.pct" [style.background]="color"></div>
        </div>
        <span class="text-right tabular-nums text-neutral-900">{{ r.display }}</span>
      </li>
    </ul>
  `,
})
export class ChartBarComponent {
  @Input() series: SeriesPoint[] = [];
  @Input() color = '#111827';
  @Input() format: 'count' | 'currency-m' | 'percent' = 'count';

  private readonly seriesSig = signal<SeriesPoint[]>([]);
  ngOnChanges() { this.seriesSig.set(this.series); }

  rows = computed(() => {
    const s = this.seriesSig();
    if (!s.length) return [];
    const max = Math.max(...s.map((p) => p.value), 0.0001);
    return s.map((p) => ({
      label: p.label,
      pct: (p.value / max) * 100,
      display: this.fmt(p.value),
    }));
  });

  private fmt(v: number): string {
    if (this.format === 'currency-m') return `RM ${v.toFixed(2)}M`;
    if (this.format === 'percent') return `${v.toFixed(0)}%`;
    return v.toLocaleString();
  }
}
