import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailTemplate } from '../services/broadcasts.types';

type Tab = 'logo' | 'button' | 'background';

// Design panel popover (Figma 5208:172759). Logo / Button / Background tabs
// with file upload, size, alignment, and a Save/Revert footer.
@Component({
  selector: 'mereka-design-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="open" class="absolute z-30 right-0 top-12 w-[420px] bg-white border border-neutral-200 rounded-lg shadow-lg">
      <div class="px-5 py-4 flex items-center justify-between border-b border-neutral-100">
        <div class="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="9" r="1" /><circle cx="15" cy="9" r="1" /><circle cx="9" cy="15" r="1" /><circle cx="15" cy="15" r="1" /></svg>
          <h3 class="font-semibold">Design</h3>
        </div>
        <button type="button" class="text-neutral-400 hover:text-neutral-900" (click)="close.emit()" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" /></svg>
        </button>
      </div>

      <div class="px-5 py-4 flex items-center gap-2 border-b border-neutral-100">
        <button *ngFor="let t of tabs" type="button"
                class="h-8 px-3 rounded-full text-sm border transition"
                [ngClass]="tab() === t.id
                  ? 'bg-neutral-100 text-neutral-900 border-neutral-200'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'"
                (click)="tab.set(t.id)">
          {{ t.label }}
        </button>
      </div>

      <div class="p-5">
        <!-- Logo tab -->
        <div *ngIf="tab() === 'logo'">
          <label class="text-sm font-medium text-neutral-700">Logo</label>
          <div class="mt-2 h-12 px-4 rounded-md border border-neutral-200 flex items-center justify-between text-sm text-neutral-500">
            <span>JPG, PNG or GIF. Up to 4mb.</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </div>

          <label class="text-sm font-medium text-neutral-700 mt-5 block">Size</label>
          <div class="mt-2 flex items-center gap-5">
            <label *ngFor="let s of sizes" class="inline-flex items-center gap-2 text-sm">
              <input type="radio" name="logoSize" [value]="s" [(ngModel)]="design.logoSize" />
              <span class="capitalize">{{ s }}</span>
            </label>
          </div>

          <label class="text-sm font-medium text-neutral-700 mt-5 block">Alignment</label>
          <div class="mt-2 flex items-center gap-5">
            <label *ngFor="let a of aligns" class="inline-flex items-center gap-2 text-sm">
              <input type="radio" name="logoAlign" [value]="a" [(ngModel)]="design.logoAlign" />
              <span class="capitalize">{{ a }}</span>
            </label>
          </div>
        </div>

        <!-- Button tab -->
        <div *ngIf="tab() === 'button'">
          <label class="text-sm font-medium text-neutral-700">Button colour</label>
          <div class="mt-2 flex flex-wrap gap-2">
            <button *ngFor="let c of palette" type="button"
                    class="w-9 h-9 rounded-full border-2 transition"
                    [style.background]="c"
                    [ngClass]="design.buttonColor === c ? 'border-neutral-900' : 'border-neutral-200'"
                    (click)="design.buttonColor = c"></button>
          </div>
          <label class="text-sm font-medium text-neutral-700 mt-5 block">Custom</label>
          <input type="color" [(ngModel)]="design.buttonColor" class="mt-2 h-10 w-20 rounded border border-neutral-200" />
        </div>

        <!-- Background tab -->
        <div *ngIf="tab() === 'background'">
          <label class="text-sm font-medium text-neutral-700">Background</label>
          <div class="mt-2 flex flex-wrap gap-2">
            <button *ngFor="let c of backgrounds" type="button"
                    class="w-9 h-9 rounded-full border-2 transition"
                    [style.background]="c"
                    [ngClass]="design.backgroundColor === c ? 'border-neutral-900' : 'border-neutral-200'"
                    (click)="design.backgroundColor = c"></button>
          </div>
        </div>
      </div>

      <div class="px-5 py-4 border-t border-neutral-100 flex justify-end gap-2">
        <button type="button" (click)="revert.emit()"
                class="h-10 px-5 rounded-full border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
          Revert
        </button>
        <button type="button" (click)="save.emit(design)"
                class="h-10 px-5 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800">
          Save Changes
        </button>
      </div>
    </div>
  `,
})
export class DesignPanelComponent {
  @Input() open = false;
  @Input({ required: true }) design!: EmailTemplate['design'];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<EmailTemplate['design']>();
  @Output() revert = new EventEmitter<void>();

  protected readonly tab = signal<Tab>('logo');
  protected readonly tabs: { id: Tab; label: string }[] = [
    { id: 'logo', label: 'Logo' },
    { id: 'button', label: 'Button' },
    { id: 'background', label: 'Background' },
  ];
  protected readonly sizes: EmailTemplate['design']['logoSize'][] = ['small', 'medium', 'large'];
  protected readonly aligns: EmailTemplate['design']['logoAlign'][] = ['left', 'center', 'right'];
  protected readonly palette = ['#1a1623', '#9333ea', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];
  protected readonly backgrounds = ['#ffffff', '#f9fafb', '#faf5ff', '#fef3c7', '#dcfce7', '#dbeafe'];
}
