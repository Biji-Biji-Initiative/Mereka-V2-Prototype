import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';

@Component({
  selector: 'mereka-hub-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="hub() as h; else loading">
      <div class="bg-neutral-50">
        <div class="aspect-[16/5] bg-neutral-200 max-h-72"><img [src]="h.banner" [alt]="h.name" class="w-full h-full object-cover" /></div>
        <div class="max-w-[1100px] mx-auto px-6 -mt-12 relative">
          <div class="bg-white border border-neutral-200 rounded-lg p-6 flex items-start gap-5">
            <img [src]="h.logo" [alt]="h.name" class="w-20 h-20 rounded-full ring-2 ring-white bg-white object-cover" />
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl font-semibold">{{ h.name }}</h1>
              <p class="text-sm text-neutral-500">{{ h.location.city }}, {{ h.location.country }} · since {{ h.founded | date: 'y' }}</p>
              <p class="mt-2 text-neutral-700">{{ h.tagline }}</p>
            </div>
            <button class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm shrink-0">Follow hub</button>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div class="bg-white border border-neutral-200 rounded-lg p-4 text-center">
              <div class="text-2xl font-semibold">{{ h.programCount }}</div>
              <div class="text-xs text-neutral-500">Programs</div>
            </div>
            <div class="bg-white border border-neutral-200 rounded-lg p-4 text-center">
              <div class="text-2xl font-semibold">{{ h.experienceCount }}</div>
              <div class="text-xs text-neutral-500">Experiences</div>
            </div>
            <div class="bg-white border border-neutral-200 rounded-lg p-4 text-center">
              <div class="text-2xl font-semibold">{{ h.expertiseCount }}</div>
              <div class="text-xs text-neutral-500">Expertise</div>
            </div>
            <div class="bg-white border border-neutral-200 rounded-lg p-4 text-center">
              <div class="text-2xl font-semibold">{{ h.memberCount | number }}</div>
              <div class="text-xs text-neutral-500">Members</div>
            </div>
          </div>

          <section class="bg-white border border-neutral-200 rounded-lg p-6 mt-6">
            <h2 class="font-semibold mb-2">About</h2>
            <p class="text-neutral-700 leading-relaxed">{{ h.about }}</p>
          </section>

          <section class="bg-white border border-neutral-200 rounded-lg p-6 mt-6 mb-12">
            <h2 class="font-semibold mb-3">Browse this hub</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <a [routerLink]="['/programs']" class="px-3 py-2 rounded border border-neutral-200 hover:bg-neutral-50">📚 Programs by {{ h.name }}</a>
              <a [routerLink]="['/experiences']" class="px-3 py-2 rounded border border-neutral-200 hover:bg-neutral-50">🎟️ Experiences by {{ h.name }}</a>
              <a [routerLink]="['/expertise']" class="px-3 py-2 rounded border border-neutral-200 hover:bg-neutral-50">🧑‍🏫 Expertise by {{ h.name }}</a>
              <a [routerLink]="['/gigs']" class="px-3 py-2 rounded border border-neutral-200 hover:bg-neutral-50">💼 Gigs from {{ h.name }}</a>
            </div>
          </section>
        </div>
      </div>
    </ng-container>
    <ng-template #loading><div class="max-w-[1320px] mx-auto px-6 py-24 text-center text-neutral-500">Loading hub…</div></ng-template>
  `,
})
export class HubDetailPage {
  private readonly api = inject(MarketplaceService);
  private readonly route = inject(ActivatedRoute);
  readonly hub = toSignal(this.route.paramMap.pipe(switchMap((p) => this.api.hubBySlug(p.get('slug') ?? ''))), { initialValue: null });
}
