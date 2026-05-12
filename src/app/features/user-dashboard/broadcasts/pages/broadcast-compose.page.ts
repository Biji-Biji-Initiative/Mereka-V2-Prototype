import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BroadcastsMockService } from '../services/broadcasts-mock.service';
import { BroadcastChannel, Cohort } from '../services/broadcasts.types';
import { ChannelBadgeComponent } from '../components/channel-badge.component';

type Step = 'channel' | 'audience' | 'content' | 'preview' | 'schedule';

// Four-step compose wizard (Figma 5208:176013 + ancillary frames). Audience
// picker has the cohort/recipient pattern from the design.
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ChannelBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-12 gap-6">
      <aside class="col-span-12 md:col-span-3">
        <a routerLink=".." class="inline-flex items-center text-neutral-500 hover:text-neutral-900 text-sm mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </a>
        <h2 class="text-xl font-semibold mb-4">Create message</h2>
        <ul class="space-y-1">
          <li *ngFor="let s of steps; let i = index">
            <button type="button" (click)="goTo(s.id)"
                    class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition"
                    [ngClass]="step() === s.id
                      ? 'bg-neutral-900 text-white'
                      : isReachable(i)
                        ? 'text-neutral-700 hover:bg-neutral-50'
                        : 'text-neutral-300 cursor-not-allowed'"
                    [disabled]="!isReachable(i)">
              <span class="w-5 h-5 rounded-full inline-flex items-center justify-center text-[11px] font-medium"
                    [ngClass]="step() === s.id ? 'bg-white/15 text-white' : 'bg-neutral-100 text-neutral-500'">
                {{ i + 1 }}
              </span>
              {{ s.label }}
            </button>
          </li>
        </ul>
      </aside>

      <section class="col-span-12 md:col-span-9 bg-white border border-neutral-200 rounded-lg p-6">
        <!-- Channel step -->
        <div *ngIf="step() === 'channel'">
          <h3 class="text-lg font-semibold">Channel</h3>
          <p class="text-sm text-neutral-500 mt-1">Pick how this broadcast will be delivered.</p>
          <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            <button *ngFor="let c of channels" type="button"
                    (click)="form.channel = c.id"
                    class="text-left p-4 rounded-lg border-2 transition"
                    [ngClass]="form.channel === c.id ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300'">
              <mereka-channel-badge [channel]="c.id" />
              <div class="mt-3 font-medium">{{ c.title }}</div>
              <div class="text-xs text-neutral-500 mt-1">{{ c.note }}</div>
            </button>
          </div>
        </div>

        <!-- Audience step -->
        <div *ngIf="step() === 'audience'">
          <h3 class="text-lg font-semibold">Audience</h3>
          <p class="text-sm text-neutral-500 mt-1">Choose which group of users will receive this broadcast.</p>

          <div class="mt-5 grid grid-cols-2 gap-4">
            <label class="block">
              <span class="text-sm font-medium">Service category</span>
              <select [(ngModel)]="form.serviceCategory"
                      class="mt-1 w-full h-11 px-3 rounded-md border border-neutral-200 text-sm">
                <option value="">Select programme or experience</option>
                <option *ngFor="let c of ['programme','experience','course','expertise','gig']" [value]="c">{{ c | titlecase }}</option>
              </select>
            </label>
            <label class="block">
              <span class="text-sm font-medium">Cohort</span>
              <select (change)="addCohort($any($event.target).value)"
                      class="mt-1 w-full h-11 px-3 rounded-md border border-neutral-200 text-sm">
                <option value="">Select cohort</option>
                <option *ngFor="let c of mock.cohorts()" [value]="c.id" [disabled]="form.cohortIds.includes(c.id)">
                  {{ c.name }} · {{ c.cohortLabel }}
                </option>
              </select>
            </label>
          </div>

          <div *ngIf="form.cohortIds.length" class="mt-6">
            <div class="text-sm font-medium mb-2">Cohorts ({{ form.cohortIds.length }})</div>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let c of selectedCohorts()" class="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-50 border border-neutral-200 text-xs">
                <strong class="uppercase tracking-wide">{{ c.name }}</strong>
                <span class="text-neutral-500 capitalize">{{ c.serviceCategory }} · {{ c.cohortLabel }}</span>
                <button type="button" (click)="removeCohort(c.id)" class="text-neutral-400 hover:text-neutral-900">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" /></svg>
                </button>
              </span>
            </div>
          </div>

          <div class="mt-6">
            <div class="text-sm font-medium mb-2">Recipient list ({{ recipients().length }})</div>
            <div class="relative mb-3">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" stroke-linecap="round" /></svg>
              <input type="search" placeholder="Search email" [(ngModel)]="recipientSearch"
                     class="w-full h-10 pl-9 pr-4 rounded-md border border-neutral-200 text-sm" />
            </div>
            <div class="flex flex-wrap gap-2 max-h-72 overflow-y-auto scrollbar-thin">
              <span *ngFor="let r of recipients()" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-xs">
                <span class="truncate max-w-[200px]">{{ r.email }}</span>
                <button type="button" class="text-neutral-400 hover:text-neutral-900">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" /></svg>
                </button>
              </span>
              <p *ngIf="!recipients().length" class="text-sm text-neutral-500">No cohort selected yet. Pick one above to populate recipients.</p>
            </div>
          </div>
        </div>

        <!-- Content step -->
        <div *ngIf="step() === 'content'">
          <h3 class="text-lg font-semibold">Content</h3>
          <p class="text-sm text-neutral-500 mt-1">Pick a template or compose from scratch.</p>

          <div *ngIf="form.channel === 'email'" class="mt-5 space-y-3">
            <label class="block">
              <span class="text-sm font-medium">Email template</span>
              <select [(ngModel)]="form.templateId" class="mt-1 w-full h-11 px-3 rounded-md border border-neutral-200 text-sm">
                <option value="">— None (write from scratch) —</option>
                <option *ngFor="let t of mock.emailTemplates()" [value]="t.id">{{ t.name }}</option>
              </select>
            </label>
            <label class="block">
              <span class="text-sm font-medium">Subject</span>
              <input type="text" [(ngModel)]="form.subject" class="mt-1 w-full h-11 px-3 rounded-md border border-neutral-200 text-sm" placeholder="A clear, specific subject line" />
            </label>
            <label class="block">
              <span class="text-sm font-medium">Preheader</span>
              <input type="text" [(ngModel)]="form.preheader" class="mt-1 w-full h-11 px-3 rounded-md border border-neutral-200 text-sm" />
            </label>
            <a routerLink="/dashboard/broadcasts/templates/email"
               class="inline-flex items-center gap-1.5 text-sm text-neutral-700 underline">
              Open email template builder →
            </a>
          </div>

          <div *ngIf="form.channel === 'whatsapp'" class="mt-5 space-y-3">
            <label class="block">
              <span class="text-sm font-medium">WhatsApp template</span>
              <select [(ngModel)]="form.templateId" class="mt-1 w-full h-11 px-3 rounded-md border border-neutral-200 text-sm">
                <option value="">Select an approved template…</option>
                <option *ngFor="let t of mock.whatsappTemplates()" [value]="t.id" [disabled]="t.status !== 'approved'">
                  {{ t.name }} ({{ t.status }})
                </option>
              </select>
            </label>
            <p class="text-xs text-neutral-500">WhatsApp only allows pre-approved templates. Build new ones in the WhatsApp template builder.</p>
            <a routerLink="/dashboard/broadcasts/templates/whatsapp"
               class="inline-flex items-center gap-1.5 text-sm text-neutral-700 underline">
              Open WhatsApp template builder →
            </a>
          </div>

          <div *ngIf="form.channel === 'in_app'" class="mt-5 space-y-3">
            <label class="block">
              <span class="text-sm font-medium">Title</span>
              <input type="text" [(ngModel)]="form.subject" class="mt-1 w-full h-11 px-3 rounded-md border border-neutral-200 text-sm" />
            </label>
            <label class="block">
              <span class="text-sm font-medium">Body</span>
              <textarea [(ngModel)]="form.preheader" rows="4" class="mt-1 w-full px-3 py-2 rounded-md border border-neutral-200 text-sm"></textarea>
            </label>
          </div>
        </div>

        <!-- Preview step -->
        <div *ngIf="step() === 'preview'">
          <h3 class="text-lg font-semibold">Preview</h3>
          <p class="text-sm text-neutral-500 mt-1">Review the broadcast as recipients will see it.</p>

          <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2 bg-neutral-50 rounded-md border border-neutral-200 p-6">
              <div *ngIf="form.channel === 'email'">
                <div class="text-xs text-neutral-500">Subject</div>
                <div class="font-medium">{{ form.subject || 'No subject yet' }}</div>
                <div class="mt-2 text-xs text-neutral-500">Preheader</div>
                <div class="text-sm text-neutral-700">{{ form.preheader || '—' }}</div>
                <div class="mt-6 p-6 bg-white rounded-md text-sm text-neutral-700 border border-neutral-100">
                  <p>Hi {{'{'}}first_name{{'}'}},</p>
                  <p class="mt-3">This is a preview of the email body. Open the template builder to compose the full content.</p>
                  <p class="mt-3 text-neutral-500">— Sent via Mereka Broadcasts</p>
                </div>
              </div>
              <div *ngIf="form.channel === 'whatsapp'" class="flex items-start justify-center">
                <div class="w-72 bg-[#e5ddd5] rounded-2xl p-4 shadow-sm">
                  <div class="bg-white rounded-md p-3 shadow text-sm">
                    <p>Hi Aisha, this is a reminder that AI Accelerator kicks off tomorrow at 7pm MYT. We can't wait to see you there!</p>
                    <div class="mt-2 text-[10px] text-neutral-400 text-right">9:00 AM ✓✓</div>
                  </div>
                </div>
              </div>
              <div *ngIf="form.channel === 'in_app'" class="bg-white rounded-md p-4 border border-neutral-200">
                <div class="font-medium">{{ form.subject || 'Notification title' }}</div>
                <p class="text-sm text-neutral-600 mt-1">{{ form.preheader || 'Notification body…' }}</p>
              </div>
            </div>
            <aside class="space-y-2 text-sm">
              <div class="text-xs uppercase tracking-wider text-neutral-400">Summary</div>
              <div><strong>Channel:</strong> <span class="capitalize">{{ form.channel }}</span></div>
              <div><strong>Cohorts:</strong> {{ form.cohortIds.length }}</div>
              <div><strong>Recipients:</strong> {{ recipients().length }}</div>
              <div><strong>Template:</strong> {{ form.templateId || '—' }}</div>
            </aside>
          </div>
        </div>

        <!-- Schedule step -->
        <div *ngIf="step() === 'schedule'">
          <h3 class="text-lg font-semibold">Schedule</h3>
          <p class="text-sm text-neutral-500 mt-1">Send immediately or schedule for later.</p>

          <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            <button type="button" (click)="form.sendMode = 'now'"
                    class="text-left p-4 rounded-lg border-2 transition"
                    [ngClass]="form.sendMode === 'now' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300'">
              <div class="font-medium">Send now</div>
              <div class="text-xs text-neutral-500 mt-1">Delivery starts within a minute.</div>
            </button>
            <button type="button" (click)="form.sendMode = 'schedule'"
                    class="text-left p-4 rounded-lg border-2 transition"
                    [ngClass]="form.sendMode === 'schedule' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300'">
              <div class="font-medium">Schedule for later</div>
              <div class="text-xs text-neutral-500 mt-1">Pick a date and time.</div>
            </button>
          </div>

          <div *ngIf="form.sendMode === 'schedule'" class="mt-4 grid grid-cols-2 gap-3">
            <label class="block">
              <span class="text-sm font-medium">Date</span>
              <input type="date" [(ngModel)]="form.scheduleDate" class="mt-1 w-full h-11 px-3 rounded-md border border-neutral-200 text-sm" />
            </label>
            <label class="block">
              <span class="text-sm font-medium">Time</span>
              <input type="time" [(ngModel)]="form.scheduleTime" class="mt-1 w-full h-11 px-3 rounded-md border border-neutral-200 text-sm" />
            </label>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
          <button *ngIf="step() !== 'channel'" type="button" (click)="prev()"
                  class="h-10 px-4 inline-flex items-center gap-1.5 text-sm text-neutral-700 hover:text-neutral-900">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" /></svg>
            Back
          </button>
          <button *ngIf="step() === 'channel'" type="button" routerLink=".."
                  class="h-10 px-4 inline-flex items-center gap-1.5 text-sm text-neutral-700 hover:text-neutral-900">
            Cancel
          </button>
          <button *ngIf="step() !== 'schedule'" type="button" (click)="next()"
                  class="h-11 px-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  [disabled]="!canAdvance()">
            Save &amp; Continue
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <button *ngIf="step() === 'schedule'" type="button" (click)="send()"
                  class="h-11 px-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800">
            {{ form.sendMode === 'now' ? 'Send broadcast' : 'Schedule broadcast' }}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11l18-8-8 18-2-8-8-2z" /></svg>
          </button>
        </div>
      </section>
    </div>
  `,
})
export class BroadcastComposePage {
  protected readonly mock = inject(BroadcastsMockService);
  private readonly router = inject(Router);

  protected readonly step = signal<Step>('channel');
  protected readonly stepOrder: Step[] = ['channel', 'audience', 'content', 'preview', 'schedule'];
  protected readonly steps = [
    { id: 'channel'  as Step, label: 'Channel' },
    { id: 'audience' as Step, label: 'Audience' },
    { id: 'content'  as Step, label: 'Content' },
    { id: 'preview'  as Step, label: 'Preview' },
    { id: 'schedule' as Step, label: 'Schedule' },
  ];

  protected readonly channels: { id: BroadcastChannel; title: string; note: string }[] = [
    { id: 'email',    title: 'Email',     note: 'Best for long-form, formatted content.' },
    { id: 'whatsapp', title: 'WhatsApp',  note: 'High-engagement, requires approved templates.' },
    { id: 'in_app',   title: 'In-app',    note: 'Shows in the Mereka notification centre.' },
  ];

  protected form = {
    channel: 'email' as BroadcastChannel,
    serviceCategory: '',
    cohortIds: [] as string[],
    templateId: '',
    subject: '',
    preheader: '',
    sendMode: 'now' as 'now' | 'schedule',
    scheduleDate: '',
    scheduleTime: '',
  };

  protected recipientSearch = '';
  protected readonly selectedCohorts = computed<Cohort[]>(() =>
    this.mock.cohorts().filter((c) => this.form.cohortIds.includes(c.id)),
  );

  protected readonly recipients = computed(() => {
    if (!this.form.cohortIds.length) return [];
    const q = this.recipientSearch.trim().toLowerCase();
    return this.mock.recipients()
      .slice(0, this.form.cohortIds.length * 12)
      .filter((r) => !q || r.email.toLowerCase().includes(q));
  });

  addCohort(id: string) {
    if (!id || this.form.cohortIds.includes(id)) return;
    this.form.cohortIds = [...this.form.cohortIds, id];
  }
  removeCohort(id: string) {
    this.form.cohortIds = this.form.cohortIds.filter((x) => x !== id);
  }

  isReachable(idx: number): boolean {
    return idx <= this.stepOrder.indexOf(this.step());
  }
  goTo(s: Step) {
    if (this.isReachable(this.stepOrder.indexOf(s))) this.step.set(s);
  }
  prev() {
    const i = this.stepOrder.indexOf(this.step());
    if (i > 0) this.step.set(this.stepOrder[i - 1]);
  }
  next() {
    const i = this.stepOrder.indexOf(this.step());
    if (i < this.stepOrder.length - 1 && this.canAdvance()) this.step.set(this.stepOrder[i + 1]);
  }
  canAdvance(): boolean {
    if (this.step() === 'channel') return !!this.form.channel;
    if (this.step() === 'audience') return this.form.cohortIds.length > 0;
    if (this.step() === 'content') return !!this.form.subject || !!this.form.templateId;
    return true;
  }
  send() {
    // Placeholder — wire to /api/broadcasts when backend exists.
    // eslint-disable-next-line no-console
    console.info('[broadcast] send', this.form);
    this.router.navigateByUrl('/dashboard/broadcasts');
  }
}
