import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

export type BuilderTab = 'content' | 'connect' | 'share' | 'results';

// Top bar of the email/form builder (Figma 5208:166800). Shows the back arrow,
// editable template name, four-tab nav, and the Design/Preview/Publish actions.
@Component({
  selector: 'mereka-builder-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bg-white border-b border-neutral-200">
      <div class="flex items-center gap-4 px-6 h-16">
        <a [routerLink]="backTo" class="text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </a>
        <input type="text" [(ngModel)]="name" (ngModelChange)="nameChange.emit($event)"
               class="text-lg font-semibold text-neutral-900 bg-transparent border-0 focus:outline-none focus:ring-0 min-w-0 max-w-md" />

        <div class="flex-1 flex justify-center">
          <div class="inline-flex items-center gap-1 bg-white">
            <button *ngFor="let t of tabs" type="button" (click)="tabChange.emit(t.id)"
                    class="h-9 px-4 rounded-full text-sm transition"
                    [ngClass]="tab === t.id
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-50'">
              {{ t.label }}
            </button>
          </div>
        </div>

        <button *ngIf="showDesign" type="button" (click)="design.emit()"
                class="inline-flex items-center gap-2 h-9 px-3 rounded-full border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-50">
          <span class="w-4 h-4 rounded-full bg-gradient-to-br from-pink-200 to-purple-300 inline-block"></span>
          Design
        </button>
        <button type="button" (click)="preview.emit()"
                class="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          Preview
        </button>
        <button type="button" (click)="publish.emit()"
                class="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-neutral-900 text-white text-sm hover:bg-neutral-800">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11l18-8-8 18-2-8-8-2z" /></svg>
          {{ publishLabel }}
        </button>
      </div>
    </header>
  `,
})
export class BuilderTopbarComponent {
  @Input({ required: true }) name!: string;
  @Input() backTo = '/dashboard/broadcasts';
  @Input() tab: BuilderTab = 'content';
  @Input() showDesign = true;
  @Input() publishLabel = 'Publish';

  @Output() nameChange = new EventEmitter<string>();
  @Output() tabChange = new EventEmitter<BuilderTab>();
  @Output() design = new EventEmitter<void>();
  @Output() preview = new EventEmitter<void>();
  @Output() publish = new EventEmitter<void>();

  readonly tabs: { id: BuilderTab; label: string }[] = [
    { id: 'content', label: 'Content' },
    { id: 'connect', label: 'Connect' },
    { id: 'share',   label: 'Share' },
    { id: 'results', label: 'Results' },
  ];
}
