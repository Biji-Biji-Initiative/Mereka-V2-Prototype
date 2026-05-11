import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';
import type { HubProfile } from '../../marketplace/models/marketplace.model';

@Component({
  selector: 'mereka-hub-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-gradient-to-br from-program-hero-start to-program-hero-end">
      <div class="max-w-[1320px] mx-auto px-6 py-16">
        <p class="uppercase tracking-widest text-xs font-medium text-primary-700">Hubs</p>
        <h1 class="mt-3 text-4xl md:text-5xl font-semibold max-w-2xl leading-tight">Communities, schools, and partner organisations on Mereka.</h1>
        <p class="mt-4 text-neutral-700 max-w-xl">Each hub runs its own programs, experiences, and expertise sessions — and many collaborate on cross-hub journeys.</p>
      </div>
    </section>
    <section class="max-w-[1320px] mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a *ngFor="let h of items()?.items ?? []; trackBy: trackById"
           [routerLink]="['/hubs', h.slug]"
           class="block bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition">
          <div class="aspect-[16/8] bg-neutral-100"><img [src]="h.banner" [alt]="h.name" class="w-full h-full object-cover" /></div>
          <div class="p-5">
            <div class="flex items-center gap-3 -mt-10">
              <img [src]="h.logo" [alt]="h.name" class="w-12 h-12 rounded-full ring-2 ring-white bg-white object-cover" />
              <div>
                <div class="font-semibold">{{ h.name }}</div>
                <div class="text-xs text-neutral-500">{{ h.location.city }}, {{ h.location.country }}</div>
              </div>
            </div>
            <p class="text-sm text-neutral-700 mt-3">{{ h.tagline }}</p>
            <div class="mt-3 grid grid-cols-3 gap-2 text-xs text-neutral-500">
              <span>📚 {{ h.programCount }} programs</span>
              <span>🎟️ {{ h.experienceCount }} experiences</span>
              <span>🧑‍🏫 {{ h.expertiseCount }} expertise</span>
            </div>
          </div>
        </a>
      </div>
    </section>
  `,
})
export class HubListPage {
  private readonly api = inject(MarketplaceService);
  readonly items = toSignal(this.api.listHubs(), { initialValue: null });
  trackById(_: number, h: HubProfile): string { return h.hubId; }
}
