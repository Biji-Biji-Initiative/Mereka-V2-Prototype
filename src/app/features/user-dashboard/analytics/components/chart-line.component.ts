import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeriesPoint } from '../services/analytics.types';

// Lightweight SVG line chart so the Analytics pages have a real visual without
// pulling in a chart library. Designed to mirror the trend cards in Figma
// (5208:182152, 5208:184630, 5208:186993).
@Component({
  selector: 'mereka-analytics-chart-line',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.viewBox]="'0 0 ' + W + ' ' + H" preserveAspectRatio="none" class="w-full h-44">
      <path *ngFor="let g of grid()" [attr.d]="g" stroke="#f3f4f6" stroke-width="1" fill="none" />
      <path [attr.d]="area()" [attr.fill]="fill" opacity="0.15" />
      <path [attr.d]="line()" [attr.stroke]="stroke" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <ng-container *ngFor="let p of pts(); let i = index">
        <circle [attr.cx]="p.x" [attr.cy]="p.y" r="3" [attr.fill]="stroke" />
      </ng-container>
    </svg>
    <div class="grid grid-cols-12 mt-2 text-[10px] text-neutral-400">
      <div *ngFor="let s of series" class="col-span-1 text-center truncate">{{ s.label }}</div>
    </div>
  `,
})
export class ChartLineComponent {
  protected readonly W = 600;
  protected readonly H = 160;
  @Input() series: SeriesPoint[] = [];
  @Input() stroke = '#111827';
  @Input() fill = '#111827';

  private readonly seriesSig = signal<SeriesPoint[]>([]);
  ngOnChanges() { this.seriesSig.set(this.series); }

  pts = computed(() => {
    const s = this.seriesSig();
    if (!s.length) return [];
    const max = Math.max(...s.map((p) => p.value), 1);
    const dx = this.W / Math.max(s.length - 1, 1);
    return s.map((p, i) => ({ x: i * dx, y: this.H - (p.value / max) * (this.H - 16) - 8 }));
  });
  line = computed(() => this.pts().map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' '));
  area = computed(() => {
    const pts = this.pts();
    if (!pts.length) return '';
    return `M${pts[0].x},${this.H} ` +
      pts.map((p) => `L${p.x},${p.y}`).join(' ') +
      ` L${pts[pts.length - 1].x},${this.H} Z`;
  });
  grid = computed(() => [0.25, 0.5, 0.75].map((r) => `M0,${this.H * r} L${this.W},${this.H * r}`));
}
