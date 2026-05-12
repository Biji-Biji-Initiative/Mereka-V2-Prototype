import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface MockCampaign {
  code: string;
  sponsor: string;
  type: 'organisation' | 'individual';
  grants: string;
  expiry: string;
}

const MOCK_CAMPAIGNS: MockCampaign[] = [
  { code: 'AIKU2026', sponsor: 'Microsoft Malaysia', type: 'individual', grants: 'Free Scale plan + AI Fluency programme access', expiry: '2026-12-31' },
  { code: 'GREENKL', sponsor: 'Green School KL — MOSTI grant', type: 'organisation', grants: 'Free Soar plan for the Climate Resilience cohort', expiry: '2026-09-30' },
];

/**
 * /redeem — Campaign code redemption.
 * §11 Plans/Paywall — Campaign flow is marked PLANNED in the doc; this is the
 * client-side prototype: code entry → confirmation → next step (org or individual).
 */
@Component({
  selector: 'mereka-redeem',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen">
      <div class="max-w-[640px] mx-auto px-6 py-16">
        <a routerLink="/plans" class="text-sm text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1 mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to plans
        </a>

        <div class="bg-white rounded-2xl border border-neutral-200 p-8" *ngIf="!matched(); else confirm">
          <h1 class="text-2xl font-bold text-neutral-900">Redeem your campaign code</h1>
          <p class="text-sm text-neutral-500 mt-1">
            Enter the code from your sponsor, grant body, or Mereka campaign email. We'll auto-apply the
            matching plan when you complete onboarding.
          </p>

          <label class="block mt-6">
            <span class="text-sm font-semibold text-neutral-900">Campaign code</span>
            <input
              type="text"
              class="mt-2 w-full px-4 py-3 rounded-md border border-neutral-200 focus:outline-none focus:border-neutral-400 text-sm uppercase tracking-widest font-mono"
              placeholder="E.G. AIKU2026"
              [ngModel]="code()"
              (ngModelChange)="code.set($event.toUpperCase())"
              (keydown.enter)="check()"
            />
          </label>

          <button type="button" (click)="check()"
            class="mt-4 w-full px-5 py-3 rounded-full bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800">
            Check code
          </button>

          <p *ngIf="error()" class="text-sm text-error mt-3 text-center">{{ error() }}</p>

          <div class="mt-8 pt-6 border-t border-neutral-100">
            <p class="text-xs text-neutral-500 mb-2">Try one of these demo codes:</p>
            <div class="flex flex-wrap gap-2">
              <button *ngFor="let c of demoCodes" type="button" (click)="code.set(c); check()"
                class="text-xs font-mono px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full hover:bg-neutral-200">
                {{ c }}
              </button>
            </div>
          </div>
        </div>

        <ng-template #confirm>
          <div class="bg-white rounded-2xl border border-success/30 p-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <div class="text-xs text-neutral-500">Code accepted</div>
                <div class="font-mono font-bold text-neutral-900">{{ matched()!.code }}</div>
              </div>
            </div>
            <h2 class="text-xl font-bold mt-4 text-neutral-900">Sponsored by {{ matched()!.sponsor }}</h2>
            <p class="text-sm text-neutral-600 mt-2">{{ matched()!.grants }}</p>
            <p class="text-xs text-neutral-400 mt-2">Active until {{ matched()!.expiry }}</p>

            <ul class="mt-6 space-y-2 text-sm text-neutral-700">
              <li class="flex items-start gap-2">
                <span class="text-success mt-0.5">✓</span>
                Your account will be marked <code class="bg-neutral-100 px-1 rounded text-xs">planCode: 'campaign'</code>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-success mt-0.5">✓</span>
                Stripe checkout will be skipped during onboarding
              </li>
              <li class="flex items-start gap-2">
                <span class="text-success mt-0.5">✓</span>
                Access expires {{ matched()!.expiry }} — upgrade prompt afterwards
              </li>
            </ul>

            <a [routerLink]="matched()!.type === 'organisation' ? '/onboarding/hub' : '/onboarding/learner'"
              [queryParams]="{ campaign: matched()!.code }"
              class="mt-6 inline-flex items-center justify-center w-full px-5 py-3 rounded-full bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800">
              Continue to {{ matched()!.type === 'organisation' ? 'hub onboarding' : 'learner onboarding' }} →
            </a>
            <button type="button" (click)="reset()" class="mt-3 w-full text-center text-xs text-neutral-500 hover:text-neutral-900">
              Use a different code
            </button>
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class RedeemPage {
  readonly code = signal('');
  readonly error = signal<string | null>(null);
  readonly matched = signal<MockCampaign | null>(null);
  readonly demoCodes = MOCK_CAMPAIGNS.map((c) => c.code);

  check(): void {
    this.error.set(null);
    const c = this.code().trim();
    if (!c) {
      this.error.set('Please enter a code.');
      return;
    }
    const found = MOCK_CAMPAIGNS.find((m) => m.code === c);
    if (!found) {
      this.error.set("That code isn't recognised. Double-check with your sponsor.");
      return;
    }
    this.matched.set(found);
  }

  reset(): void {
    this.matched.set(null);
    this.code.set('');
    this.error.set(null);
  }
}
