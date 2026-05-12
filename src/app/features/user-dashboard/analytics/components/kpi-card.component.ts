import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCard } from '../services/analytics.types';

@Component({
  selector: 'mereka-analytics-kpi-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white border border-neutral-200 rounded-lg p-5 h-full flex flex-col">
      <div class="text-sm text-neutral-500">{{ card.label }}</div>
      <div class="mt-2 flex items-baseline gap-2">
        <div class="text-3xl font-semibold tracking-tight">{{ card.value }}</div>
        <span *ngIf="card.delta as d"
              class="text-xs font-medium px-1.5 py-0.5 rounded"
              [ngClass]="{
                'bg-success/10 text-success': d.trend === 'up',
                'bg-error/10 text-error': d.trend === 'down',
                'bg-neutral-100 text-neutral-500': d.trend === 'flat'
              }">{{ d.value }}</span>
      </div>
      <div *ngIf="card.hint" class="mt-auto pt-3 text-xs text-neutral-500">{{ card.hint }}</div>
    </div>
  `,
})
export class KpiCardComponent {
  @Input({ required: true }) card!: KpiCard;
}
