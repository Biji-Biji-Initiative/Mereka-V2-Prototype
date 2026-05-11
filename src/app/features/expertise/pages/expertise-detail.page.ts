import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';
import { CartStore } from '../../marketplace/services/cart.store';
import type { Expertise } from '../../marketplace/models/marketplace.model';

@Component({
  selector: 'mereka-expertise-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="expertise() as e; else loading">
      <div class="max-w-[1320px] mx-auto px-6 py-8 grid grid-cols-12 gap-8">
        <article class="col-span-12 md:col-span-8">
          <div class="rounded-lg overflow-hidden aspect-[16/9]"><img [src]="e.coverImageUrl" [alt]="e.title" class="w-full h-full object-cover" /></div>
          <header class="mt-6 flex items-start gap-4">
            <img [src]="e.expertAvatar" [alt]="e.expertName" class="w-16 h-16 rounded-full" />
            <div>
              <p class="text-sm text-neutral-500">{{ e.expertName }} · <a [routerLink]="['/hubs', e.hub.slug]" class="text-neutral-700 hover:underline">{{ e.hub.hubName }}</a></p>
              <h1 class="text-3xl font-semibold mt-1">{{ e.title }}</h1>
              <p class="text-lg text-neutral-700 mt-1">{{ e.tagline }}</p>
            </div>
          </header>
          <section class="mt-8">
            <h2 class="font-semibold mb-2">About</h2>
            <p class="text-neutral-700 leading-relaxed">{{ e.description }}</p>
          </section>
          <section class="mt-6 bg-white border border-neutral-200 rounded-lg p-5">
            <h3 class="font-semibold mb-1">Meet your expert</h3>
            <p class="text-sm text-neutral-700">{{ e.expertBio }}</p>
          </section>
          <section *ngIf="e.themes.length" class="mt-6">
            <h2 class="font-semibold mb-2">Themes</h2>
            <ul class="flex flex-wrap gap-2">
              <li *ngFor="let t of e.themes" class="text-xs uppercase tracking-wider bg-neutral-100 text-neutral-600 rounded-full px-2 py-1">{{ t }}</li>
            </ul>
          </section>
        </article>
        <aside class="col-span-12 md:col-span-4">
          <div class="sticky top-20 bg-white border border-neutral-200 rounded-lg p-6">
            <div class="text-3xl font-semibold">{{ e.currency }} {{ e.pricePerSession }}</div>
            <p class="text-xs text-neutral-500 mt-1">per {{ e.sessionMinutes }}-minute {{ e.format === '1:1' ? '1:1' : 'group' }} session.</p>
            <div class="mt-5">
              <label class="text-xs uppercase tracking-wider text-neutral-500 block mb-1">Available slots</label>
              <ul class="space-y-2">
                <li *ngFor="let s of e.upcomingSlots">
                  <button type="button" class="w-full text-left px-3 py-2 rounded border"
                          [class.border-neutral-900]="selectedId() === s.id"
                          [class.border-neutral-200]="selectedId() !== s.id"
                          (click)="selectedId.set(s.id)">
                    <div class="text-sm font-medium">{{ s.startsAt | date: 'EEE, MMM d · h:mm a' }}</div>
                    <div class="text-xs text-neutral-500">{{ e.sessionMinutes }} min · {{ e.format === '1:1' ? '1:1' : 'Group' }}</div>
                  </button>
                </li>
              </ul>
            </div>
            <button type="button" (click)="book(e)" [disabled]="!selectedId()" [class.opacity-40]="!selectedId()"
                    class="mt-6 w-full px-4 py-3 rounded-full bg-neutral-900 text-white font-medium">
              Book session · {{ e.currency }} {{ e.pricePerSession }}
            </button>
          </div>
        </aside>
      </div>
    </ng-container>
    <ng-template #loading>
      <div class="max-w-[1320px] mx-auto px-6 py-24 text-center text-neutral-500">Loading expertise…</div>
    </ng-template>
  `,
})
export class ExpertiseDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(MarketplaceService);
  private readonly router = inject(Router);
  private readonly cart = inject(CartStore);
  readonly expertise = toSignal(
    this.route.paramMap.pipe(switchMap((p) => this.api.expertiseBySlug(p.get('slug') ?? ''))),
    { initialValue: null }
  );
  readonly selectedId = signal<string>('');
  book(e: Expertise): void {
    const s = e.upcomingSlots.find((x) => x.id === this.selectedId()); if (!s) return;
    this.cart.add({
      id: `${e.id}_${s.id}`, kind: 'expertise', title: e.title,
      subtitle: `${e.expertName} · ${new Date(s.startsAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
      thumbnail: e.coverImageUrl, unitPrice: e.pricePerSession, currency: e.currency, quantity: 1, hub: e.hub,
    });
    this.router.navigate(['/checkout']);
  }
}
