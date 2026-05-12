import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// QR share modal (Figma 5208:174996). Renders a placeholder QR — the real
// thing will be generated server-side once the share API exists.
@Component({
  selector: 'mereka-qr-share-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" (click)="close.emit()">
      <div class="relative bg-white rounded-lg shadow-lg w-full max-w-xl p-8" (click)="$event.stopPropagation()">
        <button type="button" class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900" (click)="close.emit()" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" /></svg>
        </button>
        <h2 class="text-lg font-semibold mb-1">"{{ formName }}" QR code</h2>
        <p class="text-sm text-neutral-500 mb-6">Scan the QR code to open your form.</p>
        <div class="flex justify-center mb-6">
          <div class="w-56 h-56 rounded-md border border-neutral-200 p-3 bg-white">
            <svg viewBox="0 0 32 32" class="w-full h-full">
              <rect width="32" height="32" fill="white" />
              <g fill="black">
                <rect *ngFor="let p of pattern" [attr.x]="p.x" [attr.y]="p.y" width="1" height="1" />
              </g>
              <g fill="black">
                <rect x="0"  y="0"  width="7" height="7" /><rect x="1"  y="1"  width="5" height="5" fill="white" /><rect x="2" y="2" width="3" height="3" />
                <rect x="25" y="0"  width="7" height="7" /><rect x="26" y="1"  width="5" height="5" fill="white" /><rect x="27" y="2" width="3" height="3" />
                <rect x="0"  y="25" width="7" height="7" /><rect x="1"  y="26" width="5" height="5" fill="white" /><rect x="2" y="27" width="3" height="3" />
              </g>
            </svg>
          </div>
        </div>
        <div class="flex gap-3">
          <button type="button" (click)="close.emit()"
                  class="flex-1 h-11 rounded-full border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
            Cancel
          </button>
          <button type="button" (click)="download.emit()"
                  class="flex-1 h-11 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 inline-flex items-center justify-center gap-2">
            Download QR code
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class QrShareModalComponent {
  @Input() open = false;
  @Input() formName = '';
  @Output() close = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();

  // Deterministic pseudo-random pattern so the placeholder QR looks like a QR.
  readonly pattern = Array.from({ length: 240 }, (_, i) => ({
    x: (i * 7 + 3) % 32,
    y: (i * 11 + 5) % 32,
  })).filter((p) => !this.inFinder(p.x, p.y));

  private inFinder(x: number, y: number) {
    return (x < 8 && y < 8) || (x > 24 && y < 8) || (x < 8 && y > 24);
  }
}
