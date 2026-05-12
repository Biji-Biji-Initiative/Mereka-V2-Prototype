import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Campaign {
  code: string;
  sponsor: string;
  audience: 'organisation' | 'individual';
  plan: 'scale' | 'soar' | 'campaign';
  expiry: Date;
  limit: number;
  redeemed: number;
  status: 'draft' | 'active' | 'expired';
}

/**
 * /admin/campaigns — Internal admin surface for the Campaign plan flow.
 *
 * Fills §11 Plans/Paywall — Campaign admin (PLANNED in doc).
 * Lets ops create/inspect campaign codes that bypass Stripe checkout
 * during onboarding (`planCode: 'campaign'`, `subscription.status: 'active'`,
 * `expiryDate: campaign end date`).
 */
@Component({
  selector: 'mereka-admin-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen">
      <div class="max-w-[1200px] mx-auto px-6 py-10">
        <header class="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-warning/10 text-warning mb-1">
              Admin · campaigns
            </span>
            <h1 class="text-3xl font-bold text-neutral-900 tracking-tight">Campaigns &amp; sponsored access</h1>
            <p class="text-sm text-neutral-500 mt-1 max-w-2xl">
              Create codes that grant a free plan or programme access. Codes bypass Stripe checkout and
              expire on a set date. Backed by the planned <code class="bg-neutral-100 px-1 rounded text-xs">Campaign</code> model in mereka-backend-v2.
            </p>
          </div>
          <button type="button" (click)="openNew.set(true)"
            class="inline-flex items-center gap-2 px-5 h-10 rounded-full bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            New campaign
          </button>
        </header>

        <!-- Stats -->
        <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white border border-neutral-200 rounded-2xl p-5">
            <div class="text-xs text-neutral-500">Active campaigns</div>
            <div class="text-2xl font-bold mt-1">{{ activeCount() }}</div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-5">
            <div class="text-xs text-neutral-500">Codes redeemed</div>
            <div class="text-2xl font-bold mt-1">{{ totalRedeemed() | number }}</div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-5">
            <div class="text-xs text-neutral-500">Capacity utilised</div>
            <div class="text-2xl font-bold mt-1">{{ utilisationPct() }}%</div>
          </div>
          <div class="bg-white border border-neutral-200 rounded-2xl p-5">
            <div class="text-xs text-neutral-500">Expiring next 30 days</div>
            <div class="text-2xl font-bold mt-1">{{ expiringSoon() }}</div>
          </div>
        </section>

        <!-- Filters -->
        <div class="flex flex-wrap items-center gap-2 mb-4 text-sm">
          <button *ngFor="let f of filters" type="button"
            class="px-3 py-1.5 rounded-full transition"
            [class.bg-neutral-900]="filter() === f"
            [class.text-white]="filter() === f"
            [class.bg-white]="filter() !== f"
            [class.text-neutral-700]="filter() !== f"
            [class.border]="filter() !== f"
            [class.border-neutral-200]="filter() !== f"
            (click)="filter.set(f)">{{ f | titlecase }}</button>
          <span class="text-xs text-neutral-400 ml-auto">Showing {{ visible().length }} of {{ campaigns().length }}</span>
        </div>

        <!-- Table -->
        <section class="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <table class="w-full text-sm">
            <thead class="text-xs text-neutral-500 bg-neutral-50">
              <tr>
                <th class="text-left font-normal px-4 py-3">Code</th>
                <th class="text-left font-normal px-4 py-3">Sponsor</th>
                <th class="text-left font-normal px-4 py-3">Audience</th>
                <th class="text-left font-normal px-4 py-3">Plan</th>
                <th class="text-left font-normal px-4 py-3">Usage</th>
                <th class="text-left font-normal px-4 py-3">Expiry</th>
                <th class="text-right font-normal px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr *ngFor="let c of visible()" class="hover:bg-neutral-50">
                <td class="px-4 py-3 font-mono font-semibold text-neutral-900">{{ c.code }}</td>
                <td class="px-4 py-3">{{ c.sponsor }}</td>
                <td class="px-4 py-3 text-neutral-500 capitalize">{{ c.audience }}</td>
                <td class="px-4 py-3 text-neutral-500 capitalize">{{ c.plan }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-20 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div class="h-full" [class.bg-success]="(c.redeemed / c.limit) < 0.8" [class.bg-warning]="(c.redeemed / c.limit) >= 0.8"
                        [style.width.%]="(c.redeemed / c.limit) * 100"></div>
                    </div>
                    <span class="tabular-nums text-xs text-neutral-500">{{ c.redeemed }} / {{ c.limit }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-neutral-500 text-xs">{{ c.expiry | date: 'MMM d, y' }}</td>
                <td class="px-4 py-3 text-right">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize"
                    [class.bg-success]="c.status === 'active'" [class.text-white]="c.status === 'active'"
                    [class.bg-neutral-200]="c.status === 'draft'" [class.text-neutral-700]="c.status === 'draft'"
                    [class.bg-neutral-700]="c.status === 'expired'" [class.text-white]="c.status === 'expired'">
                    {{ c.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- New campaign modal -->
        <div *ngIf="openNew()" class="fixed inset-0 z-50 bg-neutral-900/40 flex items-center justify-center p-4" (click)="openNew.set(false)">
          <form class="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4" (click)="$event.stopPropagation()" (ngSubmit)="createCampaign()">
            <header class="flex items-center justify-between">
              <h3 class="text-lg font-bold">Create campaign</h3>
              <button type="button" (click)="openNew.set(false)" class="text-neutral-400 hover:text-neutral-700" aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </header>
            <label class="block">
              <span class="text-sm font-semibold">Code</span>
              <input type="text" required class="mt-1 w-full px-3 py-2 rounded-md border border-neutral-200 text-sm uppercase tracking-widest font-mono"
                [ngModel]="newCode()" (ngModelChange)="newCode.set($event.toUpperCase())" name="code" placeholder="E.G. AIKU2026" />
            </label>
            <label class="block">
              <span class="text-sm font-semibold">Sponsor</span>
              <input type="text" required class="mt-1 w-full px-3 py-2 rounded-md border border-neutral-200 text-sm"
                [ngModel]="newSponsor()" (ngModelChange)="newSponsor.set($event)" name="sponsor" placeholder="Microsoft Malaysia / MOSTI / …" />
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="block">
                <span class="text-sm font-semibold">Audience</span>
                <select class="mt-1 w-full px-3 py-2 rounded-md border border-neutral-200 text-sm"
                  [ngModel]="newAudience()" (ngModelChange)="newAudience.set($event)" name="audience">
                  <option value="organisation">Organisation</option>
                  <option value="individual">Individual</option>
                </select>
              </label>
              <label class="block">
                <span class="text-sm font-semibold">Plan unlocked</span>
                <select class="mt-1 w-full px-3 py-2 rounded-md border border-neutral-200 text-sm"
                  [ngModel]="newPlan()" (ngModelChange)="newPlan.set($event)" name="plan">
                  <option value="campaign">Campaign (custom)</option>
                  <option value="scale">Scale</option>
                  <option value="soar">Soar</option>
                </select>
              </label>
              <label class="block">
                <span class="text-sm font-semibold">Limit</span>
                <input type="number" min="1" required class="mt-1 w-full px-3 py-2 rounded-md border border-neutral-200 text-sm"
                  [ngModel]="newLimit()" (ngModelChange)="newLimit.set(+$event)" name="limit" />
              </label>
              <label class="block">
                <span class="text-sm font-semibold">Expiry</span>
                <input type="date" required class="mt-1 w-full px-3 py-2 rounded-md border border-neutral-200 text-sm"
                  [ngModel]="newExpiry()" (ngModelChange)="newExpiry.set($event)" name="expiry" />
              </label>
            </div>
            <div class="flex justify-end gap-2 pt-2">
              <button type="button" (click)="openNew.set(false)" class="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-900">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-full bg-neutral-900 text-white text-sm font-semibold">Create campaign</button>
            </div>
          </form>
        </div>

        <p class="text-xs text-neutral-400 mt-6">
          Wires to the planned <code class="bg-neutral-100 px-1 rounded">/api/v1/campaigns</code> endpoint and the <a routerLink="/redeem" class="text-primary-700 hover:underline">/redeem</a> user surface.
        </p>
      </div>
    </div>
  `,
})
export class AdminCampaignsPage {
  readonly filters: ('all' | 'active' | 'draft' | 'expired')[] = ['all', 'active', 'draft', 'expired'];
  readonly filter = signal<typeof this.filters[number]>('all');
  readonly openNew = signal(false);

  readonly newCode = signal('');
  readonly newSponsor = signal('');
  readonly newAudience = signal<'organisation' | 'individual'>('individual');
  readonly newPlan = signal<'scale' | 'soar' | 'campaign'>('campaign');
  readonly newLimit = signal(100);
  readonly newExpiry = signal('');

  readonly campaigns = signal<Campaign[]>([
    { code: 'AIKU2026', sponsor: 'Microsoft Malaysia', audience: 'individual', plan: 'campaign', expiry: new Date(2026, 11, 31), limit: 500, redeemed: 287, status: 'active' },
    { code: 'GREENKL', sponsor: 'Green School KL — MOSTI grant', audience: 'organisation', plan: 'soar', expiry: new Date(2026, 8, 30), limit: 12, redeemed: 8, status: 'active' },
    { code: 'PETRON25', sponsor: 'Petronas Leadership Centre', audience: 'individual', plan: 'scale', expiry: new Date(2026, 6, 15), limit: 200, redeemed: 195, status: 'active' },
    { code: 'AGAPELABS', sponsor: 'Agape Labs Sponsorship', audience: 'organisation', plan: 'soar', expiry: new Date(2025, 11, 31), limit: 5, redeemed: 5, status: 'expired' },
    { code: 'DRAFT-COHORT-7', sponsor: 'TBD', audience: 'individual', plan: 'campaign', expiry: new Date(2026, 11, 31), limit: 100, redeemed: 0, status: 'draft' },
  ]);

  readonly visible = computed(() => {
    const f = this.filter();
    return f === 'all' ? this.campaigns() : this.campaigns().filter((c) => c.status === f);
  });

  readonly activeCount = computed(() => this.campaigns().filter((c) => c.status === 'active').length);
  readonly totalRedeemed = computed(() => this.campaigns().reduce((s, c) => s + c.redeemed, 0));
  readonly totalLimit = computed(() => this.campaigns().reduce((s, c) => s + c.limit, 0));
  readonly utilisationPct = computed(() => Math.round((this.totalRedeemed() / Math.max(this.totalLimit(), 1)) * 100));
  readonly expiringSoon = computed(() => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    return this.campaigns().filter((c) => c.status === 'active' && c.expiry.getTime() - now < thirtyDays).length;
  });

  createCampaign(): void {
    if (!this.newCode() || !this.newSponsor() || !this.newExpiry()) return;
    this.campaigns.update((list) => [
      {
        code: this.newCode(),
        sponsor: this.newSponsor(),
        audience: this.newAudience(),
        plan: this.newPlan(),
        expiry: new Date(this.newExpiry()),
        limit: this.newLimit(),
        redeemed: 0,
        status: 'draft',
      },
      ...list,
    ]);
    this.openNew.set(false);
    this.newCode.set('');
    this.newSponsor.set('');
    this.newExpiry.set('');
    this.newLimit.set(100);
  }
}
