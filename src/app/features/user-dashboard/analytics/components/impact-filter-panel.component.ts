import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpactFilterGroup } from '../services/analytics.types';

// "filter-impact overview" — the expanded multi-group filter card on the Impact
// Overview page (Figma 5208:184386, 5208:184382-184385).
@Component({
  selector: 'mereka-impact-filter-panel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white border border-neutral-200 rounded-lg">
      <div class="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
        <div class="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke-linejoin="round" />
          </svg>
          Filters
        </div>
        <button type="button" class="text-xs text-neutral-500 hover:text-neutral-900" (click)="clearAll.emit()">Clear all</button>
      </div>
      <div class="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div *ngFor="let g of groups">
          <div class="text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">{{ g.label }}</div>
          <ul class="space-y-1.5">
            <li *ngFor="let o of g.options">
              <button type="button"
                      (click)="toggle.emit({ groupId: g.id, optionId: o.id })"
                      class="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition"
                      [ngClass]="o.selected
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-700 hover:bg-neutral-50'">
                <span class="w-2 h-2 rounded-full" [style.background]="o.color || '#6b7280'"></span>
                <span class="flex-1 text-left">{{ o.label }}</span>
                <span class="text-xs" [ngClass]="o.selected ? 'text-white/70' : 'text-neutral-400'">{{ o.count }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div class="px-5 py-4 border-t border-neutral-100 flex justify-end gap-2">
        <button type="button" class="h-8 px-3 rounded-md text-sm text-neutral-600 hover:bg-neutral-50" (click)="cancel.emit()">Cancel</button>
        <button type="button" class="h-8 px-4 rounded-md text-sm bg-neutral-900 text-white hover:bg-neutral-800" (click)="apply.emit()">Apply</button>
      </div>
    </div>
  `,
})
export class ImpactFilterPanelComponent {
  @Input() groups: ImpactFilterGroup[] = [];
  @Output() toggle = new EventEmitter<{ groupId: string; optionId: string }>();
  @Output() clearAll = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() apply = new EventEmitter<void>();
}
