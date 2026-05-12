import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsPageHeaderComponent } from '../components/page-header.component';
import { AnalyticsMockService } from '../services/analytics-mock.service';

const LABELS: Record<string, string> = {
  reach: 'Reach',
  revenue: 'Revenue',
  rating: 'Rating',
  fill: 'Fill rate',
  jobs: 'Jobs',
};

// Correlation matrix heatmap (Figma 5208:193240, 5208:195694) — colour mapped
// from -1 (red) to +1 (green).
@Component({
  standalone: true,
  imports: [CommonModule, AnalyticsPageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mereka-analytics-page-header
      title="Correlations"
      subtitle="Where does one metric move with another? Hover any cell to see the underlying coefficient."
      [backTo]="'/dashboard/analytics'"
      backLabel="Back to analytics" />

    <div class="bg-white border border-neutral-200 rounded-lg p-6 overflow-x-auto">
      <table class="text-sm">
        <thead>
          <tr>
            <th class="w-32"></th>
            <th *ngFor="let c of columns()" class="px-3 py-2 text-xs font-medium uppercase tracking-wider text-neutral-500 text-center">
              {{ label(c) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of rows()">
            <th class="text-left pr-3 py-2 text-xs font-medium uppercase tracking-wider text-neutral-500">{{ label(r) }}</th>
            <td *ngFor="let c of columns()"
                class="w-16 h-16 text-center align-middle"
                [title]="cell(r, c).toFixed(2)">
              <div class="w-14 h-14 rounded-md inline-flex items-center justify-center font-medium text-sm"
                   [style.background]="bg(cell(r, c))"
                   [style.color]="Math.abs(cell(r, c)) > 0.4 ? 'white' : '#111'">
                {{ cell(r, c).toFixed(2) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mt-4 flex items-center gap-3 text-xs text-neutral-500">
        <span>-1</span>
        <div class="h-2 w-48 rounded-full"
             style="background: linear-gradient(to right, #ef4444, #f3f4f6, #22c55e)"></div>
        <span>+1</span>
      </div>
    </div>
  `,
})
export class CorrelationsPage {
  protected readonly Math = Math;
  private readonly mock = inject(AnalyticsMockService);

  protected readonly rows = computed(() => [...new Set(this.mock.correlationMatrix().map((c) => c.rowId))]);
  protected readonly columns = computed(() => [...new Set(this.mock.correlationMatrix().map((c) => c.colId))]);

  label(id: string) { return LABELS[id] ?? id; }

  cell(r: string, c: string): number {
    return this.mock.correlationMatrix().find((x) => x.rowId === r && x.colId === c)?.value ?? 0;
  }

  bg(v: number): string {
    // Lerp red → grey → green
    const t = (v + 1) / 2; // 0..1
    const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
    if (t < 0.5) {
      const k = t * 2;
      return `rgb(${lerp(239, 243)}, ${lerp(68, 244)}, ${lerp(68, 246)})`.replace(/\d+(?=\))/g, (n) => `${Math.round(Number(n))}`);
    }
    const k = (t - 0.5) * 2;
    return `rgb(${Math.round(243 - 209 * k)}, ${Math.round(244 - 47 * k)}, ${Math.round(246 - 152 * k)})`;
  }
}
