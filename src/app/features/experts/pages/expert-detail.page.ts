import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { EXPERTS } from '../experts.fixtures';

@Component({
  selector: 'mereka-expert-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="expert() as e; else loading">
      <div class="bg-neutral-50">
        <div class="aspect-[16/5] max-h-72 bg-neutral-200"><img [src]="e.banner" [alt]="e.name" class="w-full h-full object-cover" /></div>
        <div class="max-w-[1100px] mx-auto px-6 -mt-12 relative">
          <div class="bg-white border border-neutral-200 rounded-lg p-6 flex items-start gap-5 flex-wrap">
            <img [src]="e.avatar" [alt]="e.name" class="w-24 h-24 rounded-full ring-4 ring-white bg-white object-cover" />
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl font-semibold">{{ e.name }}</h1>
              <p class="text-sm text-neutral-500">{{ e.location.city }}, {{ e.location.country }} · <a [routerLink]="['/hubs', e.hubSlug]" class="hover:text-neutral-900">{{ e.hubName }}</a></p>
              <p class="mt-2 text-neutral-700">{{ e.tagline }}</p>
              <ul class="mt-3 flex flex-wrap gap-1.5">
                <li *ngFor="let s of e.skills" class="text-[10px] uppercase tracking-wider bg-neutral-100 text-neutral-600 rounded-full px-2 py-0.5">{{ s }}</li>
              </ul>
            </div>
            <div class="flex flex-col gap-2 shrink-0">
              <a routerLink="/expertise" class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm text-center">Book session</a>
              <button type="button" class="px-4 py-2 rounded-full border border-neutral-200 text-sm">Message</button>
            </div>
          </div>

          <section class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
            <div class="bg-white border border-neutral-200 rounded-lg p-4 text-center"><div class="text-2xl font-semibold">{{ e.rating.average }}</div><div class="text-xs text-neutral-500">★ {{ e.rating.total }} reviews</div></div>
            <div class="bg-white border border-neutral-200 rounded-lg p-4 text-center"><div class="text-2xl font-semibold">{{ e.stats.expertiseListings }}</div><div class="text-xs text-neutral-500">Expertise listings</div></div>
            <div class="bg-white border border-neutral-200 rounded-lg p-4 text-center"><div class="text-2xl font-semibold">{{ e.stats.experiencesHosted }}</div><div class="text-xs text-neutral-500">Experiences hosted</div></div>
          </section>

          <section class="bg-white border border-neutral-200 rounded-lg p-6 mt-6 mb-12">
            <h2 class="font-semibold mb-2">Bio</h2>
            <p class="text-neutral-700 leading-relaxed">{{ e.bio }}</p>
          </section>
        </div>
      </div>
    </ng-container>
    <ng-template #loading><div class="max-w-[1320px] mx-auto px-6 py-24 text-center text-neutral-500">Loading expert…</div></ng-template>
  `,
})
export class ExpertDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')), { initialValue: '' });
  readonly expert = computed(() => EXPERTS.find((e) => e.slug === this.slug()) ?? null);
}
