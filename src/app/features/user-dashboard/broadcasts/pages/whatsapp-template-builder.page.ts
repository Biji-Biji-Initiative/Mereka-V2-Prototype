import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { BroadcastsMockService } from '../services/broadcasts-mock.service';
import {
  WaButton, WaButtonType, WaHeaderType, WhatsappTemplate,
} from '../services/broadcasts.types';
import { WhatsappPreviewComponent } from '../components/whatsapp-preview.component';

// WhatsApp template builder. Three columns: form (left), live phone preview
// (right), variables/buttons rail (bottom).
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, WhatsappPreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-6">
      <a routerLink=".." class="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" /></svg>
        Back to WhatsApp templates
      </a>
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-semibold">{{ template().name || 'New template' }}</h1>
          <p class="text-sm text-neutral-500 mt-1">Build a reusable message that Mereka can send through WhatsApp Business.</p>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" (click)="saveDraft()"
                  class="h-10 px-4 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-50">Save draft</button>
          <button type="button" (click)="submit()"
                  class="h-10 px-4 rounded-full bg-neutral-900 text-white text-sm hover:bg-neutral-800">Submit for review</button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Form column -->
      <section class="lg:col-span-2 space-y-5">
        <div class="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
          <h2 class="font-semibold">Template details</h2>
          <label class="block">
            <span class="text-sm font-medium">Name</span>
            <input type="text" [(ngModel)]="model.name" (ngModelChange)="patch({ name: $event })"
                   placeholder="snake_case_template_name"
                   class="mt-1 w-full h-11 px-3 rounded-md border border-neutral-200 text-sm font-mono" />
          </label>
          <div class="grid grid-cols-2 gap-3">
            <label class="block">
              <span class="text-sm font-medium">Category</span>
              <select [(ngModel)]="model.category" (ngModelChange)="patch({ category: $event })"
                      class="mt-1 w-full h-11 px-3 rounded-md border border-neutral-200 text-sm">
                <option value="MARKETING">Marketing</option>
                <option value="UTILITY">Utility</option>
                <option value="AUTHENTICATION">Authentication</option>
              </select>
            </label>
            <label class="block">
              <span class="text-sm font-medium">Language</span>
              <select [(ngModel)]="model.language" (ngModelChange)="patch({ language: $event })"
                      class="mt-1 w-full h-11 px-3 rounded-md border border-neutral-200 text-sm">
                <option value="en_US">English (US)</option>
                <option value="ms_MY">Bahasa Malaysia</option>
                <option value="id_ID">Bahasa Indonesia</option>
              </select>
            </label>
          </div>
        </div>

        <div class="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
          <h2 class="font-semibold">Header</h2>
          <div class="flex flex-wrap gap-2">
            <button *ngFor="let h of headerTypes" type="button"
                    (click)="patch({ headerType: h })"
                    class="h-9 px-3 rounded-full text-sm border transition"
                    [ngClass]="model.headerType === h
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'">
              {{ h === 'none' ? 'None' : (h | titlecase) }}
            </button>
          </div>
          <label *ngIf="model.headerType === 'text'" class="block">
            <span class="text-sm font-medium">Header text</span>
            <input type="text" [(ngModel)]="model.headerText" (ngModelChange)="patch({ headerText: $event })"
                   maxlength="60"
                   class="mt-1 w-full h-11 px-3 rounded-md border border-neutral-200 text-sm" />
            <span class="text-[11px] text-neutral-400 mt-1 block text-right">{{ (model.headerText || '').length }}/60</span>
          </label>
        </div>

        <div class="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
          <h2 class="font-semibold">Body</h2>
          <textarea rows="6" [(ngModel)]="model.body" (ngModelChange)="patch({ body: $event })"
                    class="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm font-mono"
                    placeholder="Hi {{1}}, ..."></textarea>
          <p class="text-xs text-neutral-500">Use <span class="font-mono">{{ '{{1}}' }}</span>, <span class="font-mono">{{ '{{2}}' }}</span> or named variables like <span class="font-mono">{{ '{{cohort_name}}' }}</span>.</p>
        </div>

        <div class="bg-white border border-neutral-200 rounded-lg p-5 space-y-3">
          <h2 class="font-semibold">Footer</h2>
          <input type="text" [(ngModel)]="model.footer" (ngModelChange)="patch({ footer: $event })"
                 maxlength="60"
                 class="w-full h-11 px-3 rounded-md border border-neutral-200 text-sm"
                 placeholder="Optional footer (max 60 chars)" />
        </div>

        <div class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="flex items-center justify-between mb-3">
            <h2 class="font-semibold">Buttons</h2>
            <span class="text-xs text-neutral-500">{{ model.buttons.length }}/3</span>
          </div>
          <ul class="space-y-2">
            <li *ngFor="let b of model.buttons" class="flex items-center gap-2">
              <select [(ngModel)]="b.type" (ngModelChange)="updateButton(b.id, { type: $event })"
                      class="h-10 px-3 rounded-md border border-neutral-200 text-sm">
                <option value="cta-url">CTA · URL</option>
                <option value="cta-phone">CTA · Phone</option>
                <option value="quick-reply">Quick reply</option>
              </select>
              <input type="text" [(ngModel)]="b.label" (ngModelChange)="updateButton(b.id, { label: $event })"
                     placeholder="Button label" maxlength="25"
                     class="flex-1 h-10 px-3 rounded-md border border-neutral-200 text-sm" />
              <input *ngIf="b.type !== 'quick-reply'" type="text"
                     [(ngModel)]="b.value" (ngModelChange)="updateButton(b.id, { value: $event })"
                     [placeholder]="b.type === 'cta-url' ? 'https://…' : '+60…'"
                     class="flex-[1.5] h-10 px-3 rounded-md border border-neutral-200 text-sm" />
              <button type="button" (click)="removeButton(b.id)"
                      class="w-10 h-10 inline-flex items-center justify-center rounded-md text-neutral-400 hover:text-error hover:bg-neutral-50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" /></svg>
              </button>
            </li>
          </ul>
          <button *ngIf="model.buttons.length < 3" type="button" (click)="addButton()"
                  class="mt-3 h-9 px-3 inline-flex items-center gap-1.5 rounded-full text-sm border border-neutral-300 hover:bg-neutral-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round" /></svg>
            Add button
          </button>
        </div>

        <div class="bg-white border border-neutral-200 rounded-lg p-5">
          <h2 class="font-semibold mb-3">Variables &amp; sample values</h2>
          <ul class="space-y-2">
            <li *ngFor="let v of model.variables" class="grid grid-cols-[120px_1fr_auto] items-center gap-2">
              <input type="text" [(ngModel)]="v.name" class="h-10 px-3 rounded-md border border-neutral-200 text-sm font-mono" />
              <input type="text" [(ngModel)]="v.sample" class="h-10 px-3 rounded-md border border-neutral-200 text-sm" />
              <button type="button" (click)="removeVar(v.name)"
                      class="w-10 h-10 inline-flex items-center justify-center rounded-md text-neutral-400 hover:text-error hover:bg-neutral-50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" /></svg>
              </button>
            </li>
          </ul>
          <button type="button" (click)="addVar()"
                  class="mt-3 h-9 px-3 inline-flex items-center gap-1.5 rounded-full text-sm border border-neutral-300 hover:bg-neutral-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round" /></svg>
            Add variable
          </button>
        </div>
      </section>

      <!-- Preview column -->
      <aside class="lg:col-span-1">
        <div class="lg:sticky lg:top-6">
          <div class="text-xs uppercase tracking-wider text-neutral-400 mb-3 text-center">Live preview</div>
          <mereka-whatsapp-preview [template]="model" />
        </div>
      </aside>
    </div>
  `,
})
export class WhatsappTemplateBuilderPage {
  private readonly mock = inject(BroadcastsMockService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') || '')), { initialValue: '' });

  protected readonly template = signal<WhatsappTemplate>(this.loadOrBlank());
  // Mutation-friendly alias used by ngModels.
  protected get model(): WhatsappTemplate { return this.template(); }

  protected readonly headerTypes: WaHeaderType[] = ['none', 'text', 'image', 'video', 'document'];

  ngOnInit() {
    const id = this.id();
    if (id && id !== 'new' && this.template().id !== id) {
      this.template.set(this.loadOrBlank());
    }
  }

  private loadOrBlank(): WhatsappTemplate {
    const id = this.route.snapshot.paramMap.get('id') || '';
    if (id === 'new' || !id) {
      return {
        id: 'new',
        name: 'new_template',
        language: 'en_US',
        category: 'UTILITY',
        status: 'draft',
        headerType: 'none',
        body: 'Hi {{1}}, …',
        footer: '',
        buttons: [],
        variables: [{ name: '1', sample: 'Aisha' }],
        updatedAt: new Date().toISOString(),
      };
    }
    return this.mock.whatsappTemplate(id) ?? this.loadOrBlank();
  }

  patch(p: Partial<WhatsappTemplate>) {
    this.template.update((t) => ({ ...t, ...p }));
  }

  addButton() {
    if (this.template().buttons.length >= 3) return;
    const b: WaButton = { id: `b${Date.now()}`, type: 'cta-url', label: '', value: '' };
    this.template.update((t) => ({ ...t, buttons: [...t.buttons, b] }));
  }
  updateButton(id: string, patch: Partial<WaButton>) {
    this.template.update((t) => ({ ...t, buttons: t.buttons.map((b) => b.id === id ? { ...b, ...patch } : b) }));
  }
  removeButton(id: string) {
    this.template.update((t) => ({ ...t, buttons: t.buttons.filter((b) => b.id !== id) }));
  }

  addVar() {
    this.template.update((t) => ({ ...t, variables: [...t.variables, { name: 'new_var', sample: '' }] }));
  }
  removeVar(name: string) {
    this.template.update((t) => ({ ...t, variables: t.variables.filter((v) => v.name !== name) }));
  }

  saveDraft() {
    // eslint-disable-next-line no-console
    console.info('[whatsapp-template] save draft', this.template());
  }
  submit() {
    // eslint-disable-next-line no-console
    console.info('[whatsapp-template] submit for review', this.template());
    this.router.navigateByUrl('/dashboard/broadcasts/templates/whatsapp');
  }
}
