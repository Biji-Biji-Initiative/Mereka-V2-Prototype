import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

const PROGRAMME_TYPES = ['Custom AI bootcamp', 'Future of Work upskilling', 'Climate / sustainability', 'Leadership / management', 'Other / not sure'] as const;
const HEADCOUNTS = ['1–10', '11–50', '51–200', '201–500', '500+'] as const;
const TIMELINES = ['ASAP (within 4 weeks)', 'Next quarter', 'Within 6 months', 'Just exploring'] as const;
const FUNDING = ['Self-funded', 'HRDC claimable', 'Government grant / MOSTI / MDEC', 'Sponsor / NGO funded', 'Not sure yet'] as const;

/**
 * /corporate/inquire — Corporate inquiry form (B2B Non-Funded entry).
 *
 * Fills §3 B2B Non-Funded gap. Mirrors what would live on
 * corporate.mereka.io as the lead-capture front door before sales picks up.
 */
@Component({
  selector: 'mereka-corporate-inquire',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen">
      <div class="max-w-[820px] mx-auto px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
          <main *ngIf="!submitted(); else thanks">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-primary-50 text-primary-700 mb-2">
              Corporate training inquiry
            </span>
            <h1 class="text-3xl font-bold text-neutral-900 tracking-tight">Tell us what you'd like to run.</h1>
            <p class="text-sm text-neutral-500 mt-1 max-w-xl">
              The Mereka team will reply within 1 business day with a scoped quotation, recommended
              format, and a timeline that fits your cohort.
            </p>

            <form class="mt-8 space-y-6" (ngSubmit)="submit()">
              <div class="grid grid-cols-2 gap-4">
                <label class="block">
                  <span class="text-sm font-semibold text-neutral-900">Your name</span>
                  <input type="text" class="mt-1.5 w-full px-3 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-neutral-400 text-sm"
                    [ngModel]="name()" (ngModelChange)="name.set($event)" name="name" required />
                </label>
                <label class="block">
                  <span class="text-sm font-semibold text-neutral-900">Work email</span>
                  <input type="email" class="mt-1.5 w-full px-3 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-neutral-400 text-sm"
                    [ngModel]="email()" (ngModelChange)="email.set($event)" name="email" required />
                </label>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <label class="block">
                  <span class="text-sm font-semibold text-neutral-900">Company</span>
                  <input type="text" class="mt-1.5 w-full px-3 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-neutral-400 text-sm"
                    [ngModel]="company()" (ngModelChange)="company.set($event)" name="company" required />
                </label>
                <label class="block">
                  <span class="text-sm font-semibold text-neutral-900">Role</span>
                  <input type="text" class="mt-1.5 w-full px-3 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-neutral-400 text-sm"
                    [ngModel]="role()" (ngModelChange)="role.set($event)" name="role" placeholder="e.g. Head of L&D" />
                </label>
              </div>

              <fieldset>
                <legend class="text-sm font-semibold text-neutral-900">What kind of programme?</legend>
                <div class="mt-2 flex flex-wrap gap-2">
                  <button *ngFor="let t of programmeTypes" type="button"
                    class="px-3 py-1.5 rounded-full text-sm transition"
                    [class.bg-neutral-900]="programmeType() === t"
                    [class.text-white]="programmeType() === t"
                    [class.bg-neutral-100]="programmeType() !== t"
                    [class.text-neutral-700]="programmeType() !== t"
                    (click)="programmeType.set(t)">{{ t }}</button>
                </div>
              </fieldset>

              <div class="grid grid-cols-2 gap-4">
                <fieldset>
                  <legend class="text-sm font-semibold text-neutral-900">Approximate cohort size</legend>
                  <select class="mt-2 w-full px-3 py-2.5 rounded-md border border-neutral-200 text-sm"
                    [ngModel]="headcount()" (ngModelChange)="headcount.set($event)" name="headcount">
                    <option *ngFor="let o of headcounts" [value]="o">{{ o }}</option>
                  </select>
                </fieldset>
                <fieldset>
                  <legend class="text-sm font-semibold text-neutral-900">When would you start?</legend>
                  <select class="mt-2 w-full px-3 py-2.5 rounded-md border border-neutral-200 text-sm"
                    [ngModel]="timeline()" (ngModelChange)="timeline.set($event)" name="timeline">
                    <option *ngFor="let o of timelines" [value]="o">{{ o }}</option>
                  </select>
                </fieldset>
              </div>

              <fieldset>
                <legend class="text-sm font-semibold text-neutral-900">Funding</legend>
                <div class="mt-2 flex flex-wrap gap-2">
                  <button *ngFor="let o of funding" type="button"
                    class="px-3 py-1.5 rounded-full text-sm transition"
                    [class.bg-neutral-900]="fundingType() === o"
                    [class.text-white]="fundingType() === o"
                    [class.bg-neutral-100]="fundingType() !== o"
                    [class.text-neutral-700]="fundingType() !== o"
                    (click)="fundingType.set(o)">{{ o }}</button>
                </div>
                <p *ngIf="fundingType().includes('grant') || fundingType().includes('funded')"
                   class="mt-2 text-xs text-info bg-info/10 rounded-md px-3 py-2">
                  Looks like B2B Funded — the team will route this to the funded-programmes desk.
                </p>
              </fieldset>

              <label class="block">
                <span class="text-sm font-semibold text-neutral-900">Anything else we should know?</span>
                <textarea rows="4" class="mt-1.5 w-full px-3 py-2.5 rounded-md border border-neutral-200 focus:outline-none focus:border-neutral-400 text-sm"
                  placeholder="Outcomes, learner profile, any constraints…"
                  [ngModel]="notes()" (ngModelChange)="notes.set($event)" name="notes"></textarea>
              </label>

              <div class="flex items-start gap-2">
                <input type="checkbox" id="consent" class="mt-1" [ngModel]="consent()" (ngModelChange)="consent.set($event)" name="consent" />
                <label for="consent" class="text-xs text-neutral-500">
                  I agree to be contacted about this inquiry. We'll never share your details with third parties.
                </label>
              </div>

              <button type="submit" [disabled]="!canSubmit()" [class.opacity-40]="!canSubmit()"
                class="px-6 py-3 rounded-full bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800">
                Send inquiry →
              </button>
            </form>
          </main>

          <ng-template #thanks>
            <div class="bg-white rounded-2xl border border-success/30 p-8 text-center md:col-span-1">
              <div class="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 class="text-xl font-bold text-neutral-900">Thanks {{ name() || 'there' }} — got it.</h2>
              <p class="text-sm text-neutral-500 mt-1">
                We'll be in touch within one business day to scope the quotation. Reference number
                <code class="bg-neutral-100 px-1.5 py-0.5 rounded text-xs">{{ ticketId() }}</code>.
              </p>
              <a routerLink="/quotations/{{ ticketId() }}" class="mt-5 inline-flex items-center justify-center px-5 py-3 rounded-full bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800">
                Preview the quotation portal →
              </a>
            </div>
          </ng-template>

          <aside class="space-y-4">
            <div class="bg-white rounded-2xl border border-neutral-200 p-5">
              <div class="text-[11px] font-bold tracking-widest text-neutral-500 mb-2">WHAT HAPPENS NEXT</div>
              <ol class="space-y-3 text-sm">
                <li class="flex gap-2"><span class="text-neutral-400 font-mono">1</span> Sales confirms the brief, scope &amp; timeline.</li>
                <li class="flex gap-2"><span class="text-neutral-400 font-mono">2</span> You receive a quotation in your inbox + the portal.</li>
                <li class="flex gap-2"><span class="text-neutral-400 font-mono">3</span> Negotiate / sign — programme is created on mereka.io.</li>
                <li class="flex gap-2"><span class="text-neutral-400 font-mono">4</span> Cohort is invited; learners begin.</li>
              </ol>
            </div>
            <div class="bg-white rounded-2xl border border-neutral-200 p-5 text-xs text-neutral-500">
              Already have a code from a sponsor?
              <a routerLink="/redeem" class="text-primary-700 font-semibold ml-1 hover:underline">Redeem it →</a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `,
})
export class CorporateInquirePage {
  readonly programmeTypes = PROGRAMME_TYPES;
  readonly headcounts = HEADCOUNTS;
  readonly timelines = TIMELINES;
  readonly funding = FUNDING;

  readonly name = signal('');
  readonly email = signal('');
  readonly company = signal('');
  readonly role = signal('');
  readonly programmeType = signal<typeof PROGRAMME_TYPES[number]>('Custom AI bootcamp');
  readonly headcount = signal<typeof HEADCOUNTS[number]>('11–50');
  readonly timeline = signal<typeof TIMELINES[number]>('Next quarter');
  readonly fundingType = signal<typeof FUNDING[number]>('Self-funded');
  readonly notes = signal('');
  readonly consent = signal(false);
  readonly submitted = signal(false);
  readonly ticketId = signal('');

  readonly canSubmit = computed(
    () => this.name().length > 1 && this.email().includes('@') && this.company().length > 1 && this.consent(),
  );

  submit(): void {
    if (!this.canSubmit()) return;
    this.ticketId.set('Q-' + Math.floor(100000 + Math.random() * 900000));
    this.submitted.set(true);
  }
}
