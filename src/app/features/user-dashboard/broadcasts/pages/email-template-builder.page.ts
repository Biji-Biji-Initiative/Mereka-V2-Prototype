import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { BroadcastsMockService } from '../services/broadcasts-mock.service';
import {
  EmailBlock, EmailBlockType, EmailPage, EmailTemplate,
} from '../services/broadcasts.types';
import { BuilderTopbarComponent, BuilderTab } from '../components/builder-topbar.component';
import { EmailBlockComponent } from '../components/email-block.component';
import { BlockPaletteComponent } from '../components/block-palette.component';
import { DesignPanelComponent } from '../components/design-panel.component';
import { QrShareModalComponent } from '../components/qr-share-modal.component';

// Email template builder. Reuses the form-builder canvas pattern from Figma
// (5208:166800 + 166993). Three modes per tab: Content (build), Connect
// (integrations), Share (link/QR), Results (analytics).
@Component({
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    BuilderTopbarComponent, EmailBlockComponent, BlockPaletteComponent,
    DesignPanelComponent, QrShareModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="-mx-8 -mt-8 min-h-[calc(100vh-6rem)] bg-neutral-50 flex flex-col">
      <mereka-builder-topbar
        [name]="template().name"
        (nameChange)="rename($event)"
        [tab]="tab()"
        (tabChange)="tab.set($event)"
        [showDesign]="tab() === 'content'"
        (design)="designOpen.set(true)"
        (preview)="preview()"
        (publish)="publish()" />

      <!-- CONTENT TAB ====================================================== -->
      <div *ngIf="tab() === 'content'" class="flex-1 grid grid-cols-12 gap-6 p-6 relative">
        <!-- Pages rail -->
        <aside class="col-span-12 md:col-span-3 lg:col-span-2">
          <div class="bg-white border border-neutral-200 rounded-lg p-3">
            <p class="px-2 pb-2 text-[11px] uppercase tracking-widest text-neutral-400">Pages</p>
            <ul class="space-y-1">
              <li *ngFor="let p of template().pages">
                <button type="button" (click)="activePageId.set(p.id)"
                        class="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition"
                        [ngClass]="activePageId() === p.id
                          ? 'bg-neutral-100 text-neutral-900 font-medium'
                          : 'text-neutral-600 hover:bg-neutral-50'">
                  <span class="truncate">{{ p.name }}</span>
                  <button type="button" (click)="$event.stopPropagation()"
                          class="text-neutral-400 hover:text-neutral-900">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>
                  </button>
                </button>
              </li>
              <li>
                <button type="button" (click)="addPage()"
                        class="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-neutral-500 hover:bg-neutral-50">
                  <span>Add page</span>
                  <span class="w-5 h-5 rounded-full bg-neutral-100 inline-flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round" /></svg>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Canvas -->
        <main class="col-span-12 md:col-span-9 lg:col-span-7 relative">
          <div class="bg-white border border-neutral-200 rounded-lg p-8 min-h-[640px]"
               [style.background]="template().design.backgroundColor">
            <div class="flex items-start justify-end mb-4">
              <div class="w-6 h-6 rounded-sm bg-neutral-900"></div>
            </div>
            <div class="space-y-4 max-w-xl mx-auto">
              <mereka-email-block *ngFor="let b of activePage()?.blocks"
                                  [block]="b"
                                  [design]="template().design"
                                  [selected]="selectedBlockId() === b.id"
                                  (select)="selectedBlockId.set(b.id)"
                                  (remove)="removeBlock(b.id)" />
              <button type="button" (click)="addBlock('paragraph')"
                      class="w-full py-8 rounded-md border-2 border-dashed border-neutral-300 text-sm text-neutral-500 hover:border-neutral-500 hover:text-neutral-900">
                + Add a block
              </button>
            </div>
          </div>
        </main>

        <!-- Block / settings rail -->
        <aside class="col-span-12 lg:col-span-3">
          <div class="bg-white border border-neutral-200 rounded-lg p-4 space-y-5">
            <div *ngIf="!selectedBlock(); else blockSettings">
              <p class="text-sm font-medium mb-3">{{ activePage()?.name }}</p>
              <mereka-block-palette (add)="addBlock($event)" />
            </div>
            <ng-template #blockSettings>
              <ng-container *ngIf="selectedBlock() as b">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-medium capitalize">{{ b.type }} block</p>
                  <button type="button" (click)="selectedBlockId.set(null)" class="text-neutral-400 hover:text-neutral-900">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" /></svg>
                  </button>
                </div>

                <ng-container *ngIf="b.type === 'heading' || b.type === 'paragraph'">
                  <label class="block">
                    <span class="text-xs text-neutral-500">Text</span>
                    <textarea rows="3" [value]="b.text" (input)="patchBlock(b.id, { text: $any($event.target).value })"
                              class="mt-1 w-full px-3 py-2 rounded-md border border-neutral-200 text-sm"></textarea>
                  </label>
                </ng-container>

                <ng-container *ngIf="b.type === 'heading'">
                  <label class="block">
                    <span class="text-xs text-neutral-500">Size</span>
                    <select [value]="b.size" (change)="patchBlock(b.id, { size: $any($event.target).value })"
                            class="mt-1 w-full h-10 px-3 rounded-md border border-neutral-200 text-sm">
                      <option value="h1">H1 — Large</option>
                      <option value="h2">H2 — Medium</option>
                      <option value="h3">H3 — Small</option>
                    </select>
                  </label>
                </ng-container>

                <ng-container *ngIf="b.type === 'button'">
                  <label class="block">
                    <span class="text-xs text-neutral-500">Button label</span>
                    <input type="text" [value]="b.label" (input)="patchBlock(b.id, { label: $any($event.target).value })"
                           class="mt-1 w-full h-10 px-3 rounded-md border border-neutral-200 text-sm" />
                    <div class="mt-1 text-[11px] text-neutral-400 text-right">{{ b.label.length }}/25 max</div>
                  </label>
                  <label class="block">
                    <span class="text-xs text-neutral-500">Link</span>
                    <input type="url" [value]="b.href" (input)="patchBlock(b.id, { href: $any($event.target).value })"
                           class="mt-1 w-full h-10 px-3 rounded-md border border-neutral-200 text-sm" />
                  </label>
                </ng-container>

                <ng-container *ngIf="b.type === 'image'">
                  <label class="block">
                    <span class="text-xs text-neutral-500">Image or video</span>
                    <div class="mt-1 h-10 px-3 rounded-md border border-neutral-200 flex items-center justify-between text-sm text-neutral-500">
                      <span>{{ b.src ? 'example.png' : 'Upload an image' }}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </div>
                  </label>
                  <label class="block">
                    <span class="text-xs text-neutral-500">Size</span>
                    <select [value]="b.size" (change)="patchBlock(b.id, { size: $any($event.target).value })"
                            class="mt-1 w-full h-10 px-3 rounded-md border border-neutral-200 text-sm">
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </label>
                </ng-container>

                <ng-container *ngIf="hasAlign(b)">
                  <label class="block">
                    <span class="text-xs text-neutral-500">Alignment</span>
                    <select [value]="getAlign(b)" (change)="patchBlock(b.id, { align: $any($event.target).value })"
                            class="mt-1 w-full h-10 px-3 rounded-md border border-neutral-200 text-sm">
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </label>
                </ng-container>
              </ng-container>
            </ng-template>
          </div>
        </aside>

        <mereka-design-panel
          [open]="designOpen()"
          [design]="template().design"
          (close)="designOpen.set(false)"
          (save)="saveDesign($event)"
          (revert)="designOpen.set(false)" />
      </div>

      <!-- CONNECT TAB ====================================================== -->
      <div *ngIf="tab() === 'connect'" class="flex-1 p-8 max-w-4xl mx-auto w-full">
        <h2 class="text-lg font-semibold">Integrations</h2>
        <p class="text-sm text-neutral-500 mt-1">Save time and effort with these integrations for Mereka templates.</p>
        <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div *ngFor="let i of template().integrations"
               class="bg-white border border-neutral-200 rounded-lg p-5 flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-md" [style.background]="i.iconBg"></div>
              <div class="flex-1">
                <div class="font-medium">{{ i.label }}</div>
                <div class="text-xs text-neutral-500">Send template events to {{ i.label.split(' ')[0] }}.</div>
              </div>
            </div>
            <button type="button" (click)="toggleIntegration(i.id)"
                    class="self-start h-9 px-4 rounded-full text-sm border transition"
                    [ngClass]="i.connected
                      ? 'border-success text-success bg-success/5 hover:bg-success/10'
                      : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'">
              {{ i.connected ? 'Connected' : 'Connect' }}
            </button>
          </div>
        </div>
      </div>

      <!-- SHARE TAB ======================================================== -->
      <div *ngIf="tab() === 'share'" class="flex-1 p-8 max-w-3xl mx-auto w-full">
        <h2 class="text-lg font-semibold">Share</h2>
        <p class="text-sm text-neutral-500 mt-1">Get a public link, embed, or QR for this template.</p>

        <div class="mt-5 space-y-4">
          <div class="bg-white border border-neutral-200 rounded-lg p-5">
            <div class="text-xs uppercase tracking-wider text-neutral-400">Public link</div>
            <div class="mt-2 flex items-center gap-2">
              <input type="text" readonly [value]="publicLink()"
                     class="flex-1 h-10 px-3 rounded-md border border-neutral-200 text-sm bg-neutral-50" />
              <button type="button" (click)="copyLink()"
                      class="h-10 px-4 rounded-md text-sm bg-neutral-900 text-white hover:bg-neutral-800">Copy</button>
            </div>
          </div>

          <div class="bg-white border border-neutral-200 rounded-lg p-5">
            <div class="text-xs uppercase tracking-wider text-neutral-400">QR code</div>
            <p class="mt-2 text-sm text-neutral-700">Generate a downloadable QR code for print &amp; events.</p>
            <button type="button" (click)="qrOpen.set(true)"
                    class="mt-3 h-10 px-4 rounded-full text-sm border border-neutral-300 hover:bg-neutral-50">
              Generate QR
            </button>
          </div>
        </div>
      </div>

      <!-- RESULTS TAB ====================================================== -->
      <div *ngIf="tab() === 'results'" class="flex-1 p-8 max-w-5xl mx-auto w-full">
        <h2 class="text-lg font-semibold">Results</h2>
        <p class="text-sm text-neutral-500 mt-1">Engagement for emails sent using this template.</p>
        <div class="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div *ngFor="let s of resultStats" class="bg-white border border-neutral-200 rounded-lg p-5">
            <div class="text-xs text-neutral-500">{{ s.label }}</div>
            <div class="text-2xl font-semibold mt-1 tabular-nums">{{ s.value }}</div>
            <div class="text-xs text-neutral-500 mt-1">{{ s.note }}</div>
          </div>
        </div>
      </div>

      <mereka-qr-share-modal [open]="qrOpen()" [formName]="template().name"
                             (close)="qrOpen.set(false)" (download)="downloadQr()" />
    </div>
  `,
})
export class EmailTemplateBuilderPage {
  private readonly mock = inject(BroadcastsMockService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') || '')), { initialValue: '' });

  protected readonly template = signal<EmailTemplate>(this.loadOrBlank());
  protected readonly activePageId = signal<string>(this.template().pages[0]?.id ?? '');
  protected readonly selectedBlockId = signal<string | null>(null);
  protected readonly tab = signal<BuilderTab>('content');
  protected readonly designOpen = signal(false);
  protected readonly qrOpen = signal(false);

  protected readonly resultStats = [
    { label: 'Sends', value: '2,418', note: 'past 30 days' },
    { label: 'Open rate', value: '78%', note: '+4% vs prev.' },
    { label: 'Click rate', value: '32%', note: '+1% vs prev.' },
    { label: 'Unsubscribes', value: '0.4%', note: 'within target' },
  ];

  protected readonly activePage = computed<EmailPage | undefined>(() =>
    this.template().pages.find((p) => p.id === this.activePageId()),
  );
  protected readonly selectedBlock = computed<EmailBlock | undefined>(() =>
    this.activePage()?.blocks.find((b) => b.id === this.selectedBlockId()),
  );

  ngOnInit() {
    // Re-load if the route id changes (e.g. opening a different template).
    const id = this.id();
    if (id && id !== 'new' && this.template().id !== id) {
      this.template.set(this.loadOrBlank());
      this.activePageId.set(this.template().pages[0]?.id ?? '');
    }
  }

  private loadOrBlank(): EmailTemplate {
    const id = this.route.snapshot.paramMap.get('id') || '';
    if (id === 'new' || !id) return this.blankTemplate();
    return this.mock.emailTemplate(id) ?? this.blankTemplate();
  }

  private blankTemplate(): EmailTemplate {
    return {
      id: 'new',
      name: 'My New Form',
      subject: '',
      preheader: '',
      pages: [
        {
          id: 'p1', name: 'Welcome screen',
          blocks: [
            { id: 'b1', type: 'heading',   text: 'Hi! Welcome to…',        size: 'h1',     align: 'center' },
            { id: 'b2', type: 'paragraph', text: 'Description (Optional)', align: 'center' },
            { id: 'b3', type: 'button',    label: 'Start', href: '#',      align: 'center' },
          ],
        },
      ],
      design: { logoSize: 'small', logoAlign: 'left', buttonColor: '#1a1623', backgroundColor: '#ffffff' },
      integrations: [
        { id: 'clickup', label: 'ClickUp Integration',       connected: false, iconBg: '#e9d5ff' },
        { id: 'sheets',  label: 'Google Sheets Integration', connected: false, iconBg: '#bbf7d0' },
      ],
      updatedAt: new Date().toISOString(),
    };
  }

  rename(name: string) {
    this.template.update((t) => ({ ...t, name }));
  }
  saveDesign(design: EmailTemplate['design']) {
    this.template.update((t) => ({ ...t, design: { ...design } }));
    this.designOpen.set(false);
  }
  toggleIntegration(id: string) {
    this.template.update((t) => ({
      ...t,
      integrations: t.integrations.map((i) => i.id === id ? { ...i, connected: !i.connected } : i),
    }));
  }

  addPage() {
    const nextNum = this.template().pages.length + 1;
    this.template.update((t) => ({
      ...t,
      pages: [...t.pages, { id: `p${Date.now()}`, name: `Page ${nextNum}`, blocks: [] }],
    }));
  }

  addBlock(type: EmailBlockType) {
    const block = this.makeBlock(type);
    this.template.update((t) => ({
      ...t,
      pages: t.pages.map((p) => p.id !== this.activePageId() ? p : { ...p, blocks: [...p.blocks, block] }),
    }));
    this.selectedBlockId.set(block.id);
  }

  removeBlock(id: string) {
    this.template.update((t) => ({
      ...t,
      pages: t.pages.map((p) => p.id !== this.activePageId() ? p : { ...p, blocks: p.blocks.filter((b) => b.id !== id) }),
    }));
    if (this.selectedBlockId() === id) this.selectedBlockId.set(null);
  }

  patchBlock(id: string, patch: Partial<EmailBlock>) {
    this.template.update((t) => ({
      ...t,
      pages: t.pages.map((p) => p.id !== this.activePageId() ? p : {
        ...p,
        blocks: p.blocks.map((b) => b.id !== id ? b : ({ ...b, ...patch } as EmailBlock)),
      }),
    }));
  }

  hasAlign(b: EmailBlock): boolean {
    return b.type === 'heading' || b.type === 'paragraph' || b.type === 'image' || b.type === 'button';
  }
  getAlign(b: EmailBlock): string {
    return this.hasAlign(b) ? (b as { align: string }).align : 'left';
  }

  private makeBlock(type: EmailBlockType): EmailBlock {
    const id = `b${Date.now()}`;
    switch (type) {
      case 'heading':   return { id, type, text: 'New heading', size: 'h2', align: 'left' };
      case 'paragraph': return { id, type, text: 'New paragraph. Click to edit.', align: 'left' };
      case 'image':     return { id, type, src: '', alt: '', size: 'medium', align: 'center' };
      case 'button':    return { id, type, label: 'Button', href: '#', align: 'center' };
      case 'divider':   return { id, type };
      case 'spacer':    return { id, type, height: 24 };
      case 'columns':   return { id, type, left: [], right: [] };
    }
  }

  preview() { /* placeholder */ }
  publish() {
    // Placeholder — POST to /api/templates when API lives.
    // eslint-disable-next-line no-console
    console.info('[email-template] publish', this.template());
    this.router.navigateByUrl('/dashboard/broadcasts/templates/email');
  }

  publicLink() {
    return `https://mereka.io/t/${this.template().id}`;
  }
  copyLink() {
    if (navigator.clipboard) navigator.clipboard.writeText(this.publicLink());
  }
  downloadQr() {
    // eslint-disable-next-line no-console
    console.info('[email-template] download QR for', this.template().id);
    this.qrOpen.set(false);
  }
}
