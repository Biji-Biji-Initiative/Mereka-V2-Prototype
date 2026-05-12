import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FilterChip {
  id: string;
  label: string;
  dot?: string;     // dot colour
  count?: number;
  active?: boolean;
}

// "Filter-transform-sticky" / "Filter-courses" — the sticky filter strip at the
// top of every analytics page (Figma 5208:184231, 5208:194416, 5208:194635).
@Component({
  selector: 'mereka-analytics-filter-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white border border-neutral-200 rounded-lg p-3 flex items-center gap-3 overflow-x-auto scrollbar-thin">
      <div class="flex items-center gap-2 text-sm text-neutral-600 shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke-linejoin="round" />
        </svg>
        <span>Filters:</span>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <button *ngFor="let c of chips; trackBy: trackId" type="button"
                (click)="toggle.emit(c.id)"
                class="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border text-sm transition"
                [ngClass]="c.active
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'">
          <span *ngIf="c.dot" class="w-2 h-2 rounded-full" [style.background]="c.dot"></span>
          <span>{{ c.label }}</span>
          <span *ngIf="c.count !== undefined"
                class="ml-1 text-[11px] px-1.5 rounded-full"
                [ngClass]="c.active ? 'bg-white/15 text-white' : 'bg-neutral-100 text-neutral-500'">
            {{ c.count }}
          </span>
        </button>
      </div>
      <button type="button" (click)="reset.emit()"
              class="ml-auto shrink-0 text-sm text-neutral-500 hover:text-neutral-900">Reset</button>
    </div>
  `,
})
export class AnalyticsFilterBarComponent {
  @Input() chips: FilterChip[] = [];
  @Output() toggle = new EventEmitter<string>();
  @Output() reset = new EventEmitter<void>();
  trackId(_: number, c: FilterChip) { return c.id; }
}
