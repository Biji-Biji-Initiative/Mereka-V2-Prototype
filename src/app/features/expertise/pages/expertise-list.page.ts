import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';
import type { Expertise } from '../../marketplace/models/marketplace.model';

@Component({
  selector: 'mereka-expertise-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-gradient-to-br from-program-hero-start to-program-hero-end">
      <div class="max-w-[1320px] mx-auto px-6 py-16">
        <p class="uppercase tracking-widest text-xs font-medium text-primary-700">Expertise</p>
        <h1 class="mt-3 text-4xl md:text-5xl font-semibold max-w-2xl leading-tight">Book a 1:1 with someone who's done the thing.</h1>
        <p class="mt-4 text-neutral-700 max-w-xl">Mentoring, critiques, and small-group clinics from practitioners across Southeast Asia.</p>
        <div class="mt-8 max-w-md">
          <input type="search" [ngModel]="search()" (ngModelChange)="search.set($event)"
                 placeholder="Search experts, topics…"
                 class="w-full px-4 py-3 rounded-lg bg-white border border-neutral-200 text-sm" />
        </div>
      </div>
    </section>
    <section class="max-w-[1320px] mx-auto px-6 py-12">
      <div class="flex items-baseline justify-between mb-6">
        <h2 class="text-xl font-semibold">For You</h2>
        <a routerLink="/expertise/new" class="text-sm text-primary-700 font-medium">+ Offer expertise</a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a *ngFor="let e of filtered(); trackBy: trackById" [routerLink]="['/expertise', e.slug]"
           class="block rounded-lg overflow-hidden bg-white border border-neutral-200 hover:shadow-md transition">
          <div class="aspect-[16/9] bg-neutral-100 relative">
            <img [src]="e.coverImageUrl" [alt]="e.title" class="w-full h-full object-cover" />
            <span class="absolute top-3 right-3 inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-sm font-medium bg-white/90 text-neutral-700">
              {{ e.format === '1:1' ? '1:1' : 'Group' }}
            </span>
          </div>
          <div class="p-5">
            <div class="flex items-center gap-2 text-sm">
              <img [src]="e.expertAvatar" [alt]="e.expertName" class="w-7 h-7 rounded-full" />
              <span class="font-medium">{{ e.expertName }}</span>
            </div>
            <h3 class="font-semibold mt-2">{{ e.title }}</h3>
            <p class="text-sm text-neutral-500 line-clamp-2 mt-1">{{ e.tagline }}</p>
            <div class="flex items-center justify-between mt-3 text-xs text-neutral-500">
              <span>★ {{ e.rating.average }} ({{ e.rating.total }})</span>
              <span class="font-semibold text-neutral-900">{{ e.currency }} {{ e.pricePerSession }} <span class="text-neutral-500 font-normal">/ session</span></span>
            </div>
          </div>
        </a>
      </div>
    </section>
  `,
})
export class ExpertiseListPage {
  private readonly api = inject(MarketplaceService);
  readonly search = signal('');
  private readonly result = toSignal(this.api.listExpertise(), { initialValue: { items: [] as Expertise[], total: 0, page: 1, pageSize: 0 } });
  readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return (this.result()?.items ?? []).filter((e) =>
      !q || e.title.toLowerCase().includes(q) || e.expertName.toLowerCase().includes(q));
  });
  trackById(_: number, e: Expertise): string { return e.id; }
}
