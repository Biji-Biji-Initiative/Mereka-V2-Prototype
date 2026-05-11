import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'mereka-hub-analytics', standalone: true, imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">Hub analytics</h1>
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div *ngFor="let k of kpis" class="bg-white border border-neutral-200 rounded-lg p-5">
        <div class="text-xs text-neutral-500">{{ k.label }}</div>
        <div class="text-2xl font-semibold mt-1">{{ k.value }}</div>
      </div>
    </section>
    <section class="bg-white border border-neutral-200 rounded-lg p-6">
      <h2 class="font-semibold mb-4">Bookings by month</h2>
      <ul class="space-y-2">
        <li *ngFor="let m of months" class="grid grid-cols-[60px_1fr_60px] items-center gap-3 text-sm">
          <span class="text-neutral-500">{{ m.label }}</span>
          <div class="h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div class="h-full bg-success" [style.width.%]="m.pct"></div>
          </div>
          <span class="text-right tabular-nums">{{ m.count }}</span>
        </li>
      </ul>
    </section>
  `,
})
export class HubAnalyticsPage {
  readonly kpis = [
    { label: 'Visitors (30d)', value: '12,420' },
    { label: 'Conversion', value: '4.1%' },
    { label: 'Avg basket', value: 'MYR 312' },
    { label: 'Cancellation rate', value: '2.8%' },
  ];
  readonly months = [
    { label: 'Jan', count: 220, pct: 46 },
    { label: 'Feb', count: 268, pct: 56 },
    { label: 'Mar', count: 314, pct: 66 },
    { label: 'Apr', count: 402, pct: 84 },
    { label: 'May', count: 476, pct: 100 },
  ];
}
