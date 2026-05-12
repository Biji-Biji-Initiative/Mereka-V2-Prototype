import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailBlockType } from '../services/broadcasts.types';

interface PaletteItem {
  type: EmailBlockType;
  label: string;
  iconPath: string;
}

@Component({
  selector: 'mereka-block-palette',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <p class="text-[11px] uppercase tracking-widest text-neutral-400 mb-2">Add block</p>
      <div class="grid grid-cols-2 gap-2">
        <button *ngFor="let p of items" type="button" (click)="add.emit(p.type)"
                class="flex flex-col items-center gap-1.5 p-3 rounded-md border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-neutral-700">
            <path [attr.d]="p.iconPath" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="text-xs text-neutral-700">{{ p.label }}</span>
        </button>
      </div>
    </div>
  `,
})
export class BlockPaletteComponent {
  @Output() add = new EventEmitter<EmailBlockType>();

  readonly items: PaletteItem[] = [
    { type: 'heading',   label: 'Heading',   iconPath: 'M4 6v12M14 6v12M4 12h10' },
    { type: 'paragraph', label: 'Text',      iconPath: 'M4 6h16M4 12h16M4 18h10' },
    { type: 'image',     label: 'Image',     iconPath: 'M4 4h16v16H4zM4 16l4-4 4 4 4-4 4 4M9 9a1 1 0 100-2 1 1 0 000 2z' },
    { type: 'button',    label: 'Button',    iconPath: 'M4 9h16v6H4zM8 12h8' },
    { type: 'divider',   label: 'Divider',   iconPath: 'M3 12h18' },
    { type: 'spacer',    label: 'Spacer',    iconPath: 'M12 5v14M5 5h14M5 19h14' },
    { type: 'columns',   label: 'Columns',   iconPath: 'M4 4v16h7V4zM13 4v16h7V4z' },
  ];
}
