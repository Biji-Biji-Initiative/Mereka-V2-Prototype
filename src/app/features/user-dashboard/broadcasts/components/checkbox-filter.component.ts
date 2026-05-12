import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CheckboxOption {
  id: string;
  label: string;
  selected?: boolean;
}

// Filter dropdown with checkboxes + Clear/Apply (Figma 5208:170057 — All/
// Whatsapp/Email/Onboarding/Promotion/Reminder).
@Component({
  selector: 'mereka-checkbox-filter',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-72 bg-white border border-neutral-200 rounded-lg shadow-md overflow-hidden">
      <div *ngIf="title" class="px-4 py-3 text-sm font-medium text-neutral-700 border-b border-neutral-100">{{ title }}</div>
      <ul class="py-2">
        <li *ngFor="let o of options">
          <button type="button" (click)="toggle.emit(o.id)"
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-neutral-50">
            <span class="w-4 h-4 rounded border flex items-center justify-center"
                  [ngClass]="o.selected ? 'bg-neutral-900 border-neutral-900' : 'border-neutral-300'">
              <svg *ngIf="o.selected" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                <path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span class="flex-1 text-left">{{ o.label }}</span>
          </button>
        </li>
      </ul>
      <div class="px-4 py-3 border-t border-neutral-100 flex justify-end gap-2">
        <button type="button" class="text-sm text-neutral-500 hover:text-neutral-900" (click)="clear.emit()">Clear filter</button>
        <button type="button" class="h-8 px-3 rounded-full text-sm bg-neutral-900 text-white hover:bg-neutral-800" (click)="apply.emit()">Apply filter</button>
      </div>
    </div>
  `,
})
export class CheckboxFilterComponent {
  @Input() title?: string;
  @Input() options: CheckboxOption[] = [];
  @Output() toggle = new EventEmitter<string>();
  @Output() apply = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();
}
