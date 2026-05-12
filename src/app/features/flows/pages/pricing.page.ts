import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Plan {
  code: 'scale' | 'soar' | 'campaign';
  name: string;
  tagline: string;
  who: string;
  monthly: { malaysia: number; international: number };
  highlight?: boolean;
  features: { label: string; included: boolean }[];
}

/**
 * /plans — Scale vs Soar comparison + Campaign callout.
 * Fills §11 Plans/Paywall gap from the E2E flow doc.
 *
 * Region pricing matches the dual-Stripe-account architecture
 * documented in §11 (malaysia / atlas).
 */
@Component({
  selector: 'mereka-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen">
      <div class="max-w-[1100px] mx-auto px-6 py-16">
        <header class="text-center mb-10">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-primary-700 bg-primary-50 mb-3">
            Plans &amp; Pricing
          </span>
          <h1 class="text-4xl font-bold tracking-tight text-neutral-900">Pick the plan that grows with you</h1>
          <p class="text-neutral-500 mt-2 max-w-xl mx-auto">
            Both plans include a 14-day Mereka guarantee. Switch or cancel anytime.
          </p>
          <div class="inline-flex bg-white border border-neutral-200 rounded-full p-1 text-sm mt-6">
            <button
              type="button"
              class="px-4 py-1.5 rounded-full transition"
              [class.bg-neutral-900]="region() === 'malaysia'"
              [class.text-white]="region() === 'malaysia'"
              [class.text-neutral-600]="region() !== 'malaysia'"
              (click)="region.set('malaysia')"
            >🇲🇾 Malaysia</button>
            <button
              type="button"
              class="px-4 py-1.5 rounded-full transition"
              [class.bg-neutral-900]="region() === 'international'"
              [class.text-white]="region() === 'international'"
              [class.text-neutral-600]="region() !== 'international'"
              (click)="region.set('international')"
            >🌍 International</button>
          </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article *ngFor="let p of paidPlans"
            class="bg-white rounded-2xl p-7 ring-1 transition"
            [class.ring-neutral-200]="!p.highlight"
            [class.ring-2]="p.highlight"
            [class.ring-neutral-900]="p.highlight">
            <header class="flex items-baseline justify-between mb-1">
              <h2 class="text-xl font-bold text-neutral-900">{{ p.name }}</h2>
              <span *ngIf="p.highlight" class="text-[10px] font-semibold uppercase tracking-widest bg-neutral-900 text-white px-2 py-0.5 rounded-full">Most popular</span>
            </header>
            <p class="text-sm text-neutral-500">{{ p.tagline }}</p>
            <p class="text-xs text-neutral-400 mt-1 italic">For {{ p.who }}</p>
            <div class="mt-5 mb-5 flex items-baseline gap-1">
              <span class="text-4xl font-bold text-neutral-900">{{ currency() }} {{ region() === 'malaysia' ? p.monthly.malaysia : p.monthly.international }}</span>
              <span class="text-sm text-neutral-500">/ month</span>
            </div>
            <a routerLink="/onboarding/hub" [queryParams]="{ plan: p.code, region: region() }"
              class="block text-center w-full px-5 py-2.5 rounded-full font-semibold text-sm transition"
              [class.bg-neutral-900]="p.highlight"
              [class.text-white]="p.highlight"
              [class.bg-neutral-100]="!p.highlight"
              [class.text-neutral-900]="!p.highlight"
              [class.hover:bg-neutral-200]="!p.highlight">
              Choose {{ p.name }}
            </a>
            <ul class="mt-6 space-y-2.5 text-sm">
              <li *ngFor="let f of p.features" class="flex items-start gap-2"
                [class.text-neutral-700]="f.included"
                [class.text-neutral-400]="!f.included">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="mt-0.5 shrink-0"
                  [class.text-success]="f.included">
                  <polyline *ngIf="f.included" points="20 6 9 17 4 12"/>
                  <line *ngIf="!f.included" x1="18" y1="6" x2="6" y2="18"/>
                  <line *ngIf="!f.included" x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                <span [class.line-through]="!f.included">{{ f.label }}</span>
              </li>
            </ul>
          </article>
        </div>

        <!-- Campaign callout — PLANNED in doc §11 -->
        <div class="mt-10 rounded-2xl p-6 text-white relative overflow-hidden"
          style="background: linear-gradient(115deg, #2c2c40 0%, #2f4f74 50%, #1d5470 100%);">
          <div class="flex flex-col md:flex-row md:items-center gap-4">
            <div class="flex-1">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-white/20 text-white mb-2">
                Funded / Sponsored
              </span>
              <h3 class="text-2xl font-bold">Got a campaign or grant code?</h3>
              <p class="text-white/85 mt-1 max-w-lg text-sm">
                Government grants, corporate sponsors, and Mereka campaigns can unlock a full plan free of charge — just enter the code you received.
              </p>
            </div>
            <a routerLink="/redeem" class="inline-flex items-center justify-center bg-white text-neutral-900 px-6 py-3 rounded-full text-sm font-semibold hover:bg-neutral-100 shrink-0">
              Redeem code →
            </a>
          </div>
        </div>

        <p class="text-center text-xs text-neutral-400 mt-10 max-w-2xl mx-auto">
          Pricing displayed for {{ region() === 'malaysia' ? 'Malaysian residents (FPX + card)' : 'international customers (card / e-wallet)' }}.
          Backend auto-routes to the matching Stripe account on checkout.
        </p>
      </div>
    </div>
  `,
})
export class PricingPage {
  readonly region = signal<'malaysia' | 'international'>('malaysia');
  readonly currency = computed(() => (this.region() === 'malaysia' ? 'RM' : 'USD'));

  readonly paidPlans: Plan[] = [
    {
      code: 'scale',
      name: 'Scale',
      tagline: 'Expert profile + your own business hub.',
      who: 'solo experts, consultants, small teams',
      monthly: { malaysia: 89, international: 22 },
      highlight: true,
      features: [
        { label: 'Expert profile (visible on Mereka marketplace)', included: true },
        { label: 'Branded hub page with custom slug', included: true },
        { label: 'Create unlimited Experiences', included: true },
        { label: 'Create unlimited Expertise sessions', included: true },
        { label: 'Post jobs + receive proposals', included: true },
        { label: 'Receive payouts via Stripe Connect', included: true },
        { label: 'HR Corp Claimable badge support', included: true },
        { label: 'Funder reporting exports', included: false },
      ],
    },
    {
      code: 'soar',
      name: 'Soar',
      tagline: 'Hub-only — for organisations, makerspaces, sponsors.',
      who: 'organisations, makerspaces, coworking spaces',
      monthly: { malaysia: 199, international: 49 },
      features: [
        { label: 'Branded hub page with custom slug', included: true },
        { label: 'Create unlimited Experiences', included: true },
        { label: 'Post jobs + receive proposals', included: true },
        { label: 'Receive payouts via Stripe Connect', included: true },
        { label: 'Multi-admin / role-based access', included: true },
        { label: 'Funder reporting exports', included: true },
        { label: 'Expert profile', included: false },
        { label: 'Create Expertise sessions', included: false },
      ],
    },
  ];
}
