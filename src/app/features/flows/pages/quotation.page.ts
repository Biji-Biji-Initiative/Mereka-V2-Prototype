import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface LineItem {
  label: string;
  detail: string;
  qty: number;
  unitPrice: number;
}

type Status = 'sent' | 'in_review' | 'accepted' | 'changes_requested' | 'signed';

/**
 * /quotations/:id — Corporate client quotation review portal.
 *
 * Fills §3 B2B Non-Funded gap: receive quotation → review → accept /
 * request changes → sign agreement → trigger custom programme creation.
 */
@Component({
  selector: 'mereka-quotation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen">
      <div class="max-w-[1100px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <main>
          <header class="flex items-start justify-between gap-4 mb-6">
            <div>
              <code class="text-xs text-neutral-500 font-mono">{{ id() }}</code>
              <h1 class="text-3xl font-bold text-neutral-900 tracking-tight mt-1">Custom AI Bootcamp — 24-week cohort</h1>
              <p class="text-sm text-neutral-500 mt-1">
                Prepared for <strong>{{ client() }}</strong> · Issued {{ issuedOn() | date: 'MMM d, y' }} · Valid {{ validDays() }} days
              </p>
            </div>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
              [class.bg-info]="status() === 'sent'" [class.text-info]="status() === 'sent'" [class.bg-opacity-10]="status() === 'sent'"
              [class.bg-warning]="status() === 'in_review' || status() === 'changes_requested'"
              [class.text-warning]="status() === 'in_review' || status() === 'changes_requested'"
              [class.bg-success]="status() === 'accepted' || status() === 'signed'"
              [class.text-success]="status() === 'accepted' || status() === 'signed'">
              {{ statusLabel() }}
            </span>
          </header>

          <!-- Scope -->
          <section class="bg-white border border-neutral-200 rounded-2xl p-6 mb-6">
            <h2 class="font-bold text-neutral-900 mb-3">Programme scope</h2>
            <ul class="text-sm text-neutral-700 space-y-2">
              <li class="flex gap-2"><span class="text-success">✓</span> 4× live cohort kick-off + close-out workshops (in-person, KL or Penang)</li>
              <li class="flex gap-2"><span class="text-success">✓</span> Self-paced LMS modules — Generative AI, Prompt Engineering, Productivity with Copilot</li>
              <li class="flex gap-2"><span class="text-success">✓</span> 1:1 mentorship slots — 4 hours per learner with senior PMs / engineers</li>
              <li class="flex gap-2"><span class="text-success">✓</span> Capstone project showcase + Mereka-verified certificate</li>
              <li class="flex gap-2"><span class="text-success">✓</span> Cohort-level analytics + funder-style outcomes report</li>
            </ul>
          </section>

          <!-- Line items -->
          <section class="bg-white border border-neutral-200 rounded-2xl overflow-hidden mb-6">
            <table class="w-full text-sm">
              <thead class="text-xs text-neutral-500 bg-neutral-50">
                <tr>
                  <th class="text-left font-normal px-4 py-3">Item</th>
                  <th class="text-right font-normal px-4 py-3 w-20">Qty</th>
                  <th class="text-right font-normal px-4 py-3 w-32">Unit (RM)</th>
                  <th class="text-right font-normal px-4 py-3 w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-100">
                <tr *ngFor="let li of lineItems">
                  <td class="px-4 py-3">
                    <div class="font-medium text-neutral-900">{{ li.label }}</div>
                    <div class="text-xs text-neutral-500">{{ li.detail }}</div>
                  </td>
                  <td class="px-4 py-3 text-right tabular-nums">{{ li.qty }}</td>
                  <td class="px-4 py-3 text-right tabular-nums">{{ li.unitPrice | currency:'MYR':'symbol-narrow':'1.0-0' }}</td>
                  <td class="px-4 py-3 text-right tabular-nums font-semibold">{{ (li.qty * li.unitPrice) | currency:'MYR':'symbol-narrow':'1.0-0' }}</td>
                </tr>
              </tbody>
              <tfoot class="bg-neutral-50 text-sm">
                <tr>
                  <td colspan="3" class="px-4 py-2 text-right text-neutral-500">Subtotal</td>
                  <td class="px-4 py-2 text-right tabular-nums">{{ subtotal() | currency:'MYR':'symbol-narrow':'1.0-0' }}</td>
                </tr>
                <tr>
                  <td colspan="3" class="px-4 py-2 text-right text-neutral-500">SST 8%</td>
                  <td class="px-4 py-2 text-right tabular-nums">{{ tax() | currency:'MYR':'symbol-narrow':'1.0-0' }}</td>
                </tr>
                <tr class="font-bold text-neutral-900">
                  <td colspan="3" class="px-4 py-3 text-right">Total</td>
                  <td class="px-4 py-3 text-right tabular-nums">{{ total() | currency:'MYR':'symbol-narrow':'1.0-0' }}</td>
                </tr>
              </tfoot>
            </table>
          </section>

          <!-- Terms -->
          <section class="bg-white border border-neutral-200 rounded-2xl p-6 mb-6 text-sm text-neutral-600">
            <h2 class="font-bold text-neutral-900 mb-3">Payment terms</h2>
            <ul class="space-y-1">
              <li>• 30% deposit on PO acceptance, 70% on cohort kick-off.</li>
              <li>• Bank transfer or Purchase Order (corporate clients).</li>
              <li>• HRDC Claimable — supporting documentation provided.</li>
              <li>• Cancellation: free up to 21 days before kick-off.</li>
            </ul>
          </section>

          <!-- Conversation -->
          <section class="bg-white border border-neutral-200 rounded-2xl p-6">
            <h2 class="font-bold text-neutral-900 mb-3">Notes &amp; revisions</h2>
            <ul class="space-y-3 mb-4">
              <li *ngFor="let m of messages()" class="text-sm">
                <div class="text-xs text-neutral-400">{{ m.author }} · {{ m.at | date: 'MMM d, HH:mm' }}</div>
                <div class="text-neutral-800 mt-0.5">{{ m.body }}</div>
              </li>
              <li *ngIf="messages().length === 0" class="text-sm text-neutral-400">
                No revisions requested yet.
              </li>
            </ul>
            <textarea rows="3"
              class="w-full px-3 py-2 rounded-md border border-neutral-200 text-sm focus:outline-none focus:border-neutral-400"
              placeholder="Need a different cohort size, longer timeline, etc.?"
              [ngModel]="draft()" (ngModelChange)="draft.set($event)"></textarea>
            <div class="flex justify-end mt-2">
              <button type="button" (click)="postMessage()" [disabled]="!draft().trim()" [class.opacity-40]="!draft().trim()"
                class="px-4 py-2 rounded-full bg-neutral-100 text-neutral-900 text-sm font-medium hover:bg-neutral-200">
                Request revisions
              </button>
            </div>
          </section>
        </main>

        <!-- Action sidebar -->
        <aside class="space-y-4">
          <div class="bg-white border border-neutral-200 rounded-2xl p-5 sticky top-6">
            <div class="text-[11px] font-bold tracking-widest text-neutral-500 mb-1">Quotation total</div>
            <div class="text-3xl font-bold text-neutral-900">{{ total() | currency:'MYR':'symbol-narrow':'1.0-0' }}</div>
            <p class="text-xs text-neutral-500 mt-1">Inclusive of SST</p>

            <div class="mt-5 space-y-3" *ngIf="status() !== 'signed'">
              <button type="button" (click)="status.set('accepted')"
                class="w-full px-5 py-3 rounded-full bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800">
                Accept quotation
              </button>
              <button type="button" (click)="status.set('changes_requested'); scrollToNotes()"
                class="w-full px-5 py-2.5 rounded-full bg-white border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50">
                Request changes
              </button>
            </div>

            <div *ngIf="status() === 'accepted'" class="mt-5 space-y-3">
              <p class="text-xs text-neutral-500">Next: sign the engagement letter.</p>
              <button type="button" (click)="status.set('signed')"
                class="w-full px-5 py-3 rounded-full bg-success text-white font-semibold text-sm hover:opacity-90">
                Sign agreement (mock)
              </button>
            </div>

            <div *ngIf="status() === 'signed'" class="mt-5 space-y-3">
              <p class="text-sm text-success font-semibold">✓ Signed.</p>
              <p class="text-xs text-neutral-500">
                Sales has been notified. Custom programme will be created on mereka.io and your
                cohort invitation list collected.
              </p>
              <a routerLink="/programs/me" class="block w-full text-center px-5 py-3 rounded-full bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800">
                Go to your programmes →
              </a>
            </div>
          </div>

          <div class="bg-white border border-neutral-200 rounded-2xl p-5 text-xs text-neutral-500">
            <strong class="text-neutral-700">Need help?</strong>
            <p class="mt-1">Reply directly to this quotation or email <a class="text-primary-700" href="mailto:hello@mereka.io">hello&#64;mereka.io</a>.</p>
          </div>
        </aside>
      </div>
    </div>
  `,
})
export class QuotationPage {
  private readonly route = inject(ActivatedRoute);

  readonly id = signal(this.route.snapshot.paramMap.get('id') ?? 'Q-200548');
  readonly client = signal('Petronas Leadership Centre');
  readonly issuedOn = signal(new Date(2026, 4, 8));
  readonly validDays = signal(21);
  readonly status = signal<Status>('sent');
  readonly draft = signal('');
  readonly messages = signal<{ author: string; at: Date; body: string }[]>([]);

  readonly statusLabel = computed(() => {
    switch (this.status()) {
      case 'sent': return 'Sent — awaiting your review';
      case 'in_review': return 'In review';
      case 'changes_requested': return 'Changes requested';
      case 'accepted': return 'Accepted — please sign';
      case 'signed': return 'Signed';
    }
  });

  readonly lineItems: LineItem[] = [
    { label: 'Programme design & curriculum scoping', detail: 'One-off setup', qty: 1, unitPrice: 15000 },
    { label: 'Live workshops (in-person)', detail: '4 sessions × 6 hours', qty: 4, unitPrice: 7500 },
    { label: 'LMS course access', detail: 'Per learner, 24 weeks', qty: 30, unitPrice: 980 },
    { label: '1:1 mentorship hours', detail: '4 hours × 30 learners', qty: 120, unitPrice: 350 },
    { label: 'Cohort report & funder-style outcomes', detail: 'Programme close-out', qty: 1, unitPrice: 4500 },
  ];

  readonly subtotal = computed(() => this.lineItems.reduce((s, li) => s + li.qty * li.unitPrice, 0));
  readonly tax = computed(() => Math.round(this.subtotal() * 0.08));
  readonly total = computed(() => this.subtotal() + this.tax());

  postMessage(): void {
    const body = this.draft().trim();
    if (!body) return;
    this.messages.update((m) => [
      ...m,
      { author: 'You', at: new Date(), body },
      { author: 'Mereka Sales (auto-ack)', at: new Date(), body: 'Got it — we\'ll revise and re-issue within 1 business day.' },
    ]);
    this.draft.set('');
  }

  scrollToNotes(): void {
    if (typeof window !== 'undefined') window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
}
