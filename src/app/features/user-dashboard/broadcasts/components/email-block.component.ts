import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailBlock, EmailTemplate } from '../services/broadcasts.types';

// Renders one block in the email canvas. `selected` adds a focus outline and a
// floating handle when the user is editing.
@Component({
  selector: 'mereka-email-block',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative group rounded-md transition"
         [ngClass]="selected ? 'ring-2 ring-neutral-900' : 'hover:ring-1 hover:ring-neutral-300'"
         (click)="select.emit()">

      <ng-container [ngSwitch]="block.type">
        <ng-container *ngSwitchCase="'heading'">
          <ng-container *ngIf="block.type === 'heading'">
            <h1 *ngIf="block.size === 'h1'" class="text-3xl font-semibold" [style.textAlign]="block.align">{{ block.text }}</h1>
            <h2 *ngIf="block.size === 'h2'" class="text-2xl font-semibold" [style.textAlign]="block.align">{{ block.text }}</h2>
            <h3 *ngIf="block.size === 'h3'" class="text-xl font-semibold"  [style.textAlign]="block.align">{{ block.text }}</h3>
          </ng-container>
        </ng-container>

        <p *ngSwitchCase="'paragraph'" class="text-base leading-relaxed text-neutral-700"
           [style.textAlign]="block.type === 'paragraph' ? block.align : 'left'">
          {{ block.type === 'paragraph' ? block.text : '' }}
        </p>

        <div *ngSwitchCase="'image'" [style.textAlign]="block.type === 'image' ? block.align : 'left'">
          <div [ngClass]="imageSize(block)"
               class="inline-block bg-neutral-200 rounded-md flex items-center justify-center text-neutral-400 text-xs">
            <ng-container *ngIf="block.type === 'image'">
              <img *ngIf="block.src" [src]="block.src" [alt]="block.alt" class="rounded-md object-cover w-full h-full" />
              <span *ngIf="!block.src">image placeholder</span>
            </ng-container>
          </div>
        </div>

        <div *ngSwitchCase="'button'" [style.textAlign]="block.type === 'button' ? block.align : 'left'">
          <a *ngIf="block.type === 'button'"
             class="inline-flex items-center justify-center h-11 px-6 rounded-full text-sm font-medium text-white pointer-events-none"
             [style.background]="design?.buttonColor || '#1a1623'">
            {{ block.label }}
          </a>
        </div>

        <hr *ngSwitchCase="'divider'" class="border-neutral-200 my-2" />

        <div *ngSwitchCase="'spacer'" [style.height.px]="block.type === 'spacer' ? block.height : 16"></div>

        <div *ngSwitchCase="'columns'" class="grid grid-cols-2 gap-4">
          <div class="space-y-3">
            <mereka-email-block *ngFor="let c of (block.type === 'columns' ? block.left : [])" [block]="c" [design]="design" />
          </div>
          <div class="space-y-3">
            <mereka-email-block *ngFor="let c of (block.type === 'columns' ? block.right : [])" [block]="c" [design]="design" />
          </div>
        </div>
      </ng-container>

      <button *ngIf="selected" type="button"
              (click)="remove.emit(); $event.stopPropagation()"
              class="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-neutral-900 text-white inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" /></svg>
      </button>
    </div>
  `,
})
export class EmailBlockComponent {
  @Input({ required: true }) block!: EmailBlock;
  @Input() design?: EmailTemplate['design'];
  @Input() selected = false;
  @Output() select = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  imageSize(b: EmailBlock): string {
    if (b.type !== 'image') return '';
    return { small: 'w-32 h-24', medium: 'w-72 h-48', large: 'w-full max-w-md h-72' }[b.size];
  }
}
