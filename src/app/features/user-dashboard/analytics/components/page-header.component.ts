import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mereka-analytics-page-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-6">
      <a *ngIf="backTo" [routerLink]="backTo"
         class="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ backLabel || 'Back' }}
      </a>
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div class="min-w-0">
          <h1 class="text-[28px] leading-tight font-semibold text-neutral-900">{{ title }}</h1>
          <p *ngIf="subtitle" class="text-sm text-neutral-500 mt-1">{{ subtitle }}</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <div *ngIf="showSearch" class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" stroke-linecap="round" />
            </svg>
            <input type="search"
                   [placeholder]="searchPlaceholder"
                   (input)="searchChange.emit($any($event.target).value)"
                   class="h-10 pl-9 pr-4 rounded-full border border-neutral-200 bg-white text-sm w-[320px] focus:outline-none focus:border-neutral-400" />
          </div>
          <button *ngIf="showExport"
                  type="button"
                  (click)="export.emit()"
                  class="h-10 px-4 inline-flex items-center gap-2 bg-neutral-900 text-white text-sm rounded-md hover:bg-neutral-800">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Export
          </button>
          <ng-content select="[slot=actions]"></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class AnalyticsPageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() backTo?: string;
  @Input() backLabel?: string;
  @Input() showSearch = false;
  @Input() showExport = false;
  @Input() searchPlaceholder = 'Search…';

  @Output() searchChange = new EventEmitter<string>();
  @Output() export = new EventEmitter<void>();
}
