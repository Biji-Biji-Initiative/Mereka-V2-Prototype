import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';
import type { Experience } from '../../marketplace/models/marketplace.model';

@Component({
  selector: 'mereka-experience-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-gradient-to-br from-program-hero-start to-program-hero-end">
      <div class="max-w-[1320px] mx-auto px-6 py-16">
        <p class="uppercase tracking-widest text-xs font-medium text-primary-700">Experiences</p>
        <h1 class="mt-3 text-4xl md:text-5xl font-semibold max-w-2xl leading-tight">Workshops, walks, and live sessions across Southeast Asia.</h1>
        <p class="mt-4 text-neutral-700 max-w-xl">Browse in-person, virtual, and hybrid experiences run by Mereka hubs and their experts.</p>
        <div class="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <input type="search" [ngModel]="search()" (ngModelChange)="search.set($event)"
                 placeholder="Search experiences, hubs, or topics…"
                 class="flex-1 px-4 py-3 rounded-lg bg-white border border-neutral-200 focus:outline-none focus:border-neutral-400 text-sm" />
          <select [ngModel]="mode()" (ngModelChange)="mode.set($event)"
                  class="px-4 py-3 rounded-lg bg-white border border-neutral-200 text-sm">
            <option value="">All modes</option>
            <option value="physical">In-person</option>
            <option value="virtual">Virtual</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>
    </section>

    <section class="max-w-[1320px] mx-auto px-6 py-12">
      <div class="flex items-baseline justify-between mb-6">
        <h2 class="text-xl font-semibold">For You</h2>
        <a routerLink="/experiences/new" class="text-sm text-primary-700 font-medium">+ Host an experience</a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a *ngFor="let e of filtered(); trackBy: trackById"
           [routerLink]="['/experiences', e.slug]"
           class="block rounded-lg overflow-hidden bg-white border border-neutral-200 hover:shadow-md transition group">
          <div class="aspect-[16/10] bg-neutral-100 overflow-hidden relative">
            <img [src]="e.coverImageUrl" [alt]="e.title" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <span class="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-sm font-medium text-white"
                  [class.bg-neutral-900]="cheapest(e) > 0" [class.bg-success]="cheapest(e) === 0">
              {{ priceLabel(e) }}
            </span>
            <span class="absolute top-3 right-3 inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-sm font-medium bg-white/90 text-neutral-700">
              {{ e.mode }}
            </span>
          </div>
          <div class="p-5">
            <div class="flex items-center gap-2 text-xs text-neutral-500">
              <img *ngIf="e.hub.hubLogo as logo" [src]="logo" [alt]="e.hub.hubName" class="w-5 h-5 rounded-full" />
              <span class="font-medium text-neutral-700">{{ e.hub.hubName }}</span>
            </div>
            <h3 class="font-semibold mt-2 leading-snug">{{ e.title }}</h3>
            <p class="text-sm text-neutral-500 mt-1 line-clamp-2">{{ e.tagline }}</p>
            <div class="mt-3 flex items-center gap-3 text-xs text-neutral-500">
              <span>★ {{ e.rating.average }} ({{ e.rating.total }})</span>
              <span *ngIf="e.location">📍 {{ e.location.city }}</span>
            </div>
          </div>
        </a>
        <div *ngIf="filtered().length === 0" class="col-span-full text-center text-neutral-500 py-16 border border-dashed border-neutral-200 rounded-lg">
          No experiences match your filters yet.
        </div>
      </div>
    </section>
  `,
})
export class ExperienceListPage {
  private readonly api = inject(MarketplaceService);
  readonly search = signal('');
  readonly mode = signal<'' | 'physical' | 'virtual' | 'hybrid'>('');
  private readonly result = toSignal(this.api.listExperiences({}), { initialValue: { items: [] as Experience[], total: 0, page: 1, pageSize: 0 } });
  readonly filtered = computed(() => {
    const items = this.result()?.items ?? [];
    const q = this.search().trim().toLowerCase(); const m = this.mode();
    return items.filter((e) => {
      if (m && e.mode !== m) return false;
      if (q && !(e.title + ' ' + e.tagline + ' ' + e.hub.hubName).toLowerCase().includes(q)) return false;
      return true;
    });
  });
  trackById(_: number, e: Experience): string { return e.id; }
  cheapest(e: Experience): number { return Math.min(...e.tickets.map((t) => t.price)); }
  priceLabel(e: Experience): string {
    const c = this.cheapest(e);
    if (c === 0) return 'Free';
    return e.tickets[0].currency + ' ' + c;
  }
}
