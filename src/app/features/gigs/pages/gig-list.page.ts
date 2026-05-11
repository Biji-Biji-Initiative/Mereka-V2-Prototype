import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';
import type { Gig } from '../../marketplace/models/marketplace.model';

@Component({
  selector: 'mereka-gig-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-gradient-to-br from-program-hero-start to-program-hero-end">
      <div class="max-w-[1320px] mx-auto px-6 py-16">
        <p class="uppercase tracking-widest text-xs font-medium text-primary-700">Gigs</p>
        <h1 class="mt-3 text-4xl md:text-5xl font-semibold max-w-2xl leading-tight">Project-based work for the Mereka community.</h1>
        <p class="mt-4 text-neutral-700 max-w-xl">From one-off creative briefs to month-long contracts — posted by hubs and Mereka partners.</p>
        <div class="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <input type="search" [ngModel]="search()" (ngModelChange)="search.set($event)"
                 placeholder="Search by skill or title…"
                 class="flex-1 px-4 py-3 rounded-lg bg-white border border-neutral-200 text-sm" />
          <select [ngModel]="engagement()" (ngModelChange)="engagement.set($event)"
                  class="px-4 py-3 rounded-lg bg-white border border-neutral-200 text-sm">
            <option value="">All engagements</option>
            <option value="one-off">One-off</option>
            <option value="contract">Contract</option>
            <option value="part-time">Part-time</option>
            <option value="full-time">Full-time</option>
          </select>
        </div>
      </div>
    </section>
    <section class="max-w-[1320px] mx-auto px-6 py-12">
      <div class="flex items-baseline justify-between mb-6">
        <h2 class="text-xl font-semibold">Open gigs</h2>
        <a routerLink="/gigs/new" class="text-sm text-primary-700 font-medium">+ Post a gig</a>
      </div>
      <ul class="space-y-3">
        <li *ngFor="let g of filtered(); trackBy: trackById" class="bg-white border border-neutral-200 rounded-lg p-5 hover:shadow-sm transition">
          <a [routerLink]="['/gigs', g.slug]" class="block">
            <div class="flex items-baseline justify-between flex-wrap gap-2">
              <div class="flex items-center gap-2 text-xs text-neutral-500">
                <img *ngIf="g.hub.hubLogo as l" [src]="l" [alt]="g.hub.hubName" class="w-5 h-5 rounded-full" />
                <span class="font-medium text-neutral-700">{{ g.hub.hubName }}</span>
                <span class="uppercase tracking-wider bg-neutral-100 rounded-full px-2 py-0.5">{{ g.engagement }}</span>
                <span class="uppercase tracking-wider bg-neutral-100 rounded-full px-2 py-0.5">{{ g.remote }}</span>
              </div>
              <div class="text-xs text-neutral-500">Posted {{ g.postedAt | date: 'MMM d' }}</div>
            </div>
            <h3 class="font-semibold text-lg mt-2">{{ g.title }}</h3>
            <p class="text-sm text-neutral-600 mt-1 line-clamp-2">{{ g.description }}</p>
            <div class="flex items-center justify-between mt-3 flex-wrap gap-2">
              <ul class="flex flex-wrap gap-1.5">
                <li *ngFor="let s of g.skills" class="text-[11px] uppercase tracking-wider bg-neutral-100 text-neutral-600 rounded-full px-2 py-0.5">{{ s }}</li>
              </ul>
              <div class="text-sm font-semibold">{{ g.budget.currency }} {{ g.budget.min }}–{{ g.budget.max }} <span class="text-neutral-500 font-normal">/ {{ g.budget.period }}</span></div>
            </div>
          </a>
        </li>
        <li *ngIf="filtered().length === 0" class="text-center text-neutral-500 py-16 border border-dashed border-neutral-200 rounded-lg">No open gigs match.</li>
      </ul>
    </section>
  `,
})
export class GigListPage {
  private readonly api = inject(MarketplaceService);
  readonly search = signal(''); readonly engagement = signal('');
  private readonly result = toSignal(this.api.listGigs(), { initialValue: { items: [] as Gig[], total: 0, page: 1, pageSize: 0 } });
  readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase(); const eng = this.engagement();
    return (this.result()?.items ?? []).filter((g) => {
      if (eng && g.engagement !== eng) return false;
      if (q && !(g.title + ' ' + g.skills.join(' ')).toLowerCase().includes(q)) return false;
      return true;
    });
  });
  trackById(_: number, g: Gig): string { return g.id; }
}
