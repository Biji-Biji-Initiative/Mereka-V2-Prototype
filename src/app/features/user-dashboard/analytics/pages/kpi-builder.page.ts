import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsPageHeaderComponent } from '../components/page-header.component';
import { AnalyticsMockService } from '../services/analytics-mock.service';
import { KpiBuilderField } from '../services/analytics.types';

// KPI builder (Figma 5208:196561, 5208:196481, 5208:196521 — the Input-type
// pickers). Drag-style picker simulated with click-to-add and click-to-remove.
@Component({
  standalone: true,
  imports: [CommonModule, AnalyticsPageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mereka-analytics-page-header
      title="KPI builder"
      subtitle="Compose custom KPIs from any field across services. Drag — or click — to add fields to your card."
      [backTo]="'/dashboard/analytics'"
      backLabel="Back to analytics" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section class="lg:col-span-2 bg-white border border-neutral-200 rounded-lg p-6">
        <h2 class="font-semibold text-neutral-900 mb-3">Available fields</h2>
        <div *ngFor="let g of groups()" class="mb-5">
          <div class="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">{{ g.label }}</div>
          <div class="flex flex-wrap gap-2">
            <button *ngFor="let f of g.items"
                    type="button"
                    (click)="add(f)"
                    [disabled]="picked().some(p => p.id === f.id)"
                    class="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
                    [ngClass]="picked().some(p => p.id === f.id)
                      ? 'bg-neutral-100 text-neutral-500 border-neutral-200'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'">
              <span>+</span>
              {{ f.label }}
            </button>
          </div>
        </div>
      </section>

      <section class="bg-white border border-neutral-200 rounded-lg p-6">
        <h2 class="font-semibold text-neutral-900 mb-1">Your KPI</h2>
        <p class="text-xs text-neutral-500 mb-4">Combined value: <span class="font-medium text-neutral-900">{{ picked().length ? composedValue() : '—' }}</span></p>
        <div *ngIf="!picked().length" class="text-sm text-neutral-500 py-10 text-center border border-dashed rounded-md">
          Add at least one field to preview your custom KPI.
        </div>
        <ul *ngIf="picked().length" class="space-y-2 mb-4">
          <li *ngFor="let p of picked()"
              class="flex items-center justify-between gap-2 bg-neutral-50 border border-neutral-200 rounded-md px-3 py-2 text-sm">
            <span class="truncate">{{ p.label }}</span>
            <button type="button" class="text-neutral-400 hover:text-error" (click)="remove(p.id)" aria-label="Remove">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" /></svg>
            </button>
          </li>
        </ul>
        <button type="button"
                [disabled]="!picked().length"
                class="w-full h-10 rounded-md bg-neutral-900 text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800">
          Save KPI
        </button>
      </section>
    </div>
  `,
})
export class KpiBuilderPage {
  private readonly mock = inject(AnalyticsMockService);

  protected readonly picked = signal<KpiBuilderField[]>([]);

  protected readonly groups = computed(() => {
    const all = this.mock.kpiBuilderFields();
    const byGroup = new Map<string, KpiBuilderField[]>();
    for (const f of all) {
      (byGroup.get(f.group) ?? byGroup.set(f.group, []).get(f.group))!.push(f);
    }
    return [
      { id: 'engagement',   label: 'Engagement',   items: byGroup.get('engagement')   ?? [] },
      { id: 'monetisation', label: 'Monetisation', items: byGroup.get('monetisation') ?? [] },
      { id: 'audience',     label: 'Audience',     items: byGroup.get('audience')     ?? [] },
      { id: 'outcomes',     label: 'Outcomes',     items: byGroup.get('outcomes')     ?? [] },
    ];
  });

  protected readonly composedValue = computed(() => {
    if (!this.picked().length) return '—';
    // Mock combined value just sums hashed field IDs so the preview reacts.
    const n = this.picked().reduce((s, f) => s + f.id.length * 73, 0);
    return n.toLocaleString();
  });

  add(f: KpiBuilderField) {
    if (this.picked().some((p) => p.id === f.id)) return;
    this.picked.update((arr) => [...arr, f]);
  }
  remove(id: string) {
    this.picked.update((arr) => arr.filter((p) => p.id !== id));
  }
}
