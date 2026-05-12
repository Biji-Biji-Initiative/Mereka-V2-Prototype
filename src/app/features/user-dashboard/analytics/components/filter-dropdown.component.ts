import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FilterDropdownItem {
  id: string;
  label: string;
  iconPath?: string; // optional SVG path-d
  selected?: boolean;
}

// "filter-all" / "filter-selected" / "Input-type" / "result-selection" — the
// 220×326 / 220×160 dropdown menus on Impact Overview (Figma 5208:196436,
// 5208:196601, 5208:196561, 5208:196481, 5208:196521, 5208:196646, 5208:196669,
// 5208:196692). One component covers all four because they share structure:
// a header chip, a scrollable list, and an Apply footer.
@Component({
  selector: 'mereka-filter-dropdown',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-56 bg-white border border-neutral-200 rounded-lg shadow-md overflow-hidden">
      <div class="px-3 py-2.5 text-sm font-medium text-neutral-700 border-b border-neutral-100 flex items-center justify-between">
        <span>{{ title }}</span>
        <button type="button" class="text-neutral-400 hover:text-neutral-700" (click)="close.emit()" aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" />
          </svg>
        </button>
      </div>
      <ul class="max-h-60 overflow-y-auto scrollbar-thin py-1">
        <li *ngFor="let it of items">
          <button type="button"
                  (click)="pick.emit(it.id)"
                  class="w-full flex items-center gap-2 px-3 py-2 text-sm transition"
                  [ngClass]="it.selected ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700 hover:bg-neutral-50'">
            <span *ngIf="showCheckbox"
                  class="w-4 h-4 rounded border flex items-center justify-center"
                  [ngClass]="it.selected ? 'bg-neutral-900 border-neutral-900' : 'border-neutral-300'">
              <svg *ngIf="it.selected" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                <path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span class="flex-1 text-left truncate">{{ it.label }}</span>
          </button>
        </li>
      </ul>
      <div *ngIf="showApply" class="flex items-center justify-between gap-2 px-3 py-2 border-t border-neutral-100">
        <span class="text-xs text-neutral-500">{{ selectedCount }} selected</span>
        <button type="button" class="h-7 px-3 rounded-md text-xs bg-neutral-900 text-white hover:bg-neutral-800" (click)="apply.emit()">
          Apply
        </button>
      </div>
    </div>
  `,
})
export class FilterDropdownComponent {
  @Input({ required: true }) title!: string;
  @Input() items: FilterDropdownItem[] = [];
  @Input() showCheckbox = true;
  @Input() showApply = true;

  @Output() pick = new EventEmitter<string>();
  @Output() apply = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  get selectedCount(): number {
    return this.items.filter((i) => i.selected).length;
  }
}
