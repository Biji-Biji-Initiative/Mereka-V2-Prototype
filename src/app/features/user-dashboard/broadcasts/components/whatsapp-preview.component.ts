import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsappTemplate } from '../services/broadcasts.types';

@Component({
  selector: 'mereka-whatsapp-preview',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto w-[320px] bg-neutral-900 rounded-[36px] p-2 shadow-xl">
      <div class="rounded-[28px] overflow-hidden bg-[#e5ddd5]">
        <div class="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-white/20 inline-flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zM2 22a10 10 0 0120 0H2z" /></svg>
          </div>
          <div>
            <div class="text-sm font-medium">Mereka</div>
            <div class="text-[10px] opacity-70">business account</div>
          </div>
        </div>
        <div class="p-4 space-y-2 min-h-[400px]">
          <div class="bg-white rounded-md p-3 shadow-sm text-sm max-w-[260px]">
            <div *ngIf="template.headerType === 'image' || template.headerType === 'video'"
                 class="w-full h-32 rounded-md bg-neutral-200 mb-2 flex items-center justify-center text-xs text-neutral-500">
              {{ template.headerType }} header
            </div>
            <div *ngIf="template.headerType === 'document'"
                 class="flex items-center gap-2 mb-2 px-2 py-2 rounded-md bg-neutral-100 text-xs text-neutral-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" stroke-linejoin="round" /></svg>
              document.pdf
            </div>
            <div *ngIf="template.headerType === 'text' && template.headerText" class="font-semibold text-[13px] mb-1">
              {{ renderVars(template.headerText) }}
            </div>
            <p class="whitespace-pre-wrap">{{ renderVars(template.body) }}</p>
            <div *ngIf="template.footer" class="mt-2 text-[10px] text-neutral-500">{{ template.footer }}</div>
            <div class="mt-1 text-[10px] text-neutral-400 text-right">9:41 AM ✓✓</div>
          </div>
          <div *ngIf="template.buttons.length" class="space-y-1 max-w-[260px]">
            <ng-container *ngFor="let b of template.buttons">
              <a *ngIf="b.type === 'cta-url'"
                 class="block text-center text-[#0a85ff] bg-white rounded-md py-2 text-xs font-medium border-t border-neutral-100">
                ↗ {{ b.label }}
              </a>
              <a *ngIf="b.type === 'cta-phone'"
                 class="block text-center text-[#0a85ff] bg-white rounded-md py-2 text-xs font-medium border-t border-neutral-100">
                ☎ {{ b.label }}
              </a>
              <button *ngIf="b.type === 'quick-reply'" type="button"
                      class="block w-full text-center text-[#0a85ff] bg-white rounded-md py-2 text-xs font-medium border-t border-neutral-100">
                {{ b.label }}
              </button>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class WhatsappPreviewComponent {
  @Input({ required: true }) template!: WhatsappTemplate;

  renderVars(text: string): string {
    return text.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
      const v = this.template.variables.find((x) => x.name === key);
      return v?.sample ?? `{{${key}}}`;
    });
  }
}
