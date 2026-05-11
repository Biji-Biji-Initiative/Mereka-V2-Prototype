import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';
import { CartStore } from '../../marketplace/services/cart.store';
import type { Experience, ExperienceSlot, ExperienceTicket } from '../../marketplace/models/marketplace.model';

@Component({
  selector: 'mereka-experience-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="experience() as e; else loading">
      <div class="max-w-[1320px] mx-auto px-6 py-8 grid grid-cols-12 gap-8">
        <article class="col-span-12 md:col-span-8">
          <div class="rounded-lg overflow-hidden aspect-[16/9] bg-neutral-100">
            <img [src]="e.coverImageUrl" [alt]="e.title" class="w-full h-full object-cover" />
          </div>
          <div class="mt-6">
            <div class="flex items-center gap-3 text-sm text-neutral-500">
              <a [routerLink]="['/hubs', e.hub.slug]" class="flex items-center gap-2 hover:text-neutral-900">
                <img *ngIf="e.hub.hubLogo as l" [src]="l" [alt]="e.hub.hubName" class="w-6 h-6 rounded-full" />
                <span>{{ e.hub.hubName }}</span>
              </a>
              <span class="uppercase tracking-wider text-[10px] bg-neutral-100 text-neutral-600 rounded-full px-2 py-0.5">{{ e.mode }}</span>
              <span>★ {{ e.rating.average }} ({{ e.rating.total }})</span>
            </div>
            <h1 class="text-3xl font-semibold mt-3">{{ e.title }}</h1>
            <p class="text-lg text-neutral-700 mt-2">{{ e.tagline }}</p>
          </div>

          <section class="mt-8">
            <h2 class="font-semibold text-lg mb-3">About</h2>
            <p class="text-neutral-700 leading-relaxed whitespace-pre-line">{{ e.description }}</p>
          </section>

          <section *ngIf="e.location" class="mt-8 bg-white border border-neutral-200 rounded-lg p-6">
            <h2 class="font-semibold mb-2">Where</h2>
            <p class="text-neutral-700">
              <span *ngIf="e.location.venue">{{ e.location.venue }}, </span>
              {{ e.location.city }}, {{ e.location.country }}
            </p>
          </section>

          <section *ngIf="e.themes.length" class="mt-6">
            <h2 class="font-semibold mb-2">Themes</h2>
            <ul class="flex flex-wrap gap-2">
              <li *ngFor="let t of e.themes" class="text-xs uppercase tracking-wider bg-neutral-100 text-neutral-600 rounded-full px-2 py-1">{{ t }}</li>
            </ul>
          </section>

          <section *ngIf="e.gallery?.length" class="mt-8 grid grid-cols-2 gap-3">
            <img *ngFor="let g of e.gallery" [src]="g" alt="" class="rounded-md aspect-[4/3] object-cover" />
          </section>
        </article>

        <aside class="col-span-12 md:col-span-4">
          <div class="sticky top-20 bg-white border border-neutral-200 rounded-lg p-6">
            <div class="text-3xl font-semibold">{{ priceDisplay(e) }}</div>
            <p class="text-xs text-neutral-500 mt-1">Starting price · taxes calculated at checkout.</p>

            <div class="mt-5">
              <label class="text-xs uppercase tracking-wider text-neutral-500 block mb-1">Session</label>
              <select class="w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="selectedSlotId()" (ngModelChange)="selectedSlotId.set($event)">
                <option *ngFor="let s of e.slots" [ngValue]="s.id">
                  {{ s.startsAt | date: 'EEE, MMM d · h:mm a' }} ({{ s.ticketsAvailable }} left)
                </option>
              </select>
            </div>

            <div class="mt-4">
              <label class="text-xs uppercase tracking-wider text-neutral-500 block mb-1">Ticket</label>
              <ul class="space-y-2">
                <li *ngFor="let t of e.tickets" class="rounded border" [class.border-neutral-900]="selectedTicketId() === t.id" [class.border-neutral-200]="selectedTicketId() !== t.id">
                  <button type="button" class="w-full text-left px-3 py-2 flex items-center justify-between" (click)="selectedTicketId.set(t.id)">
                    <div>
                      <div class="font-medium text-sm">{{ t.name }}</div>
                      <div class="text-xs text-neutral-500" *ngIf="t.description">{{ t.description }}</div>
                    </div>
                    <div class="text-sm font-semibold">{{ t.price === 0 ? 'Free' : t.currency + ' ' + t.price }}</div>
                  </button>
                </li>
              </ul>
            </div>

            <div class="mt-4 flex items-center gap-3">
              <button type="button" class="w-9 h-9 rounded border border-neutral-200" (click)="dec()">−</button>
              <span class="tabular-nums text-sm">{{ qty() }} ticket{{ qty() === 1 ? '' : 's' }}</span>
              <button type="button" class="w-9 h-9 rounded border border-neutral-200" (click)="inc()">+</button>
            </div>

            <button type="button" (click)="addToCart(e)"
                    class="mt-6 w-full px-4 py-3 rounded-full bg-neutral-900 text-white font-medium hover:bg-neutral-700">
              Add to cart · {{ totalLabel(e) }}
            </button>
            <a routerLink="/checkout" class="block text-center text-xs text-neutral-500 mt-2">View cart →</a>
          </div>
        </aside>
      </div>
    </ng-container>
    <ng-template #loading>
      <div class="max-w-[1320px] mx-auto px-6 py-24 text-center text-neutral-500">Loading experience…</div>
    </ng-template>
  `,
})
export class ExperienceDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(MarketplaceService);
  private readonly router = inject(Router);
  private readonly cart = inject(CartStore);

  readonly experience = toSignal(
    this.route.paramMap.pipe(switchMap((p) => this.api.experienceBySlug(p.get('slug') ?? ''))),
    { initialValue: null },
  );

  readonly selectedSlotId = signal<string>('');
  readonly selectedTicketId = signal<string>('');
  readonly qty = signal(1);

  inc(): void { this.qty.update((q) => Math.min(10, q + 1)); }
  dec(): void { this.qty.update((q) => Math.max(1, q - 1)); }

  priceDisplay(e: Experience): string {
    const cheap = Math.min(...e.tickets.map((t) => t.price));
    return cheap === 0 ? 'Free' : `${e.tickets[0].currency} ${cheap}`;
  }

  private selectedTicket(e: Experience): ExperienceTicket | undefined {
    return e.tickets.find((t) => t.id === this.selectedTicketId()) ?? e.tickets[0];
  }
  private selectedSlot(e: Experience): ExperienceSlot | undefined {
    return e.slots.find((s) => s.id === this.selectedSlotId()) ?? e.slots[0];
  }
  totalLabel(e: Experience): string {
    const t = this.selectedTicket(e); if (!t) return '';
    const total = t.price * this.qty();
    return total === 0 ? 'Free' : `${t.currency} ${total}`;
  }

  addToCart(e: Experience): void {
    const t = this.selectedTicket(e); const s = this.selectedSlot(e);
    if (!t || !s) return;
    this.cart.add({
      id: `${e.id}_${t.id}_${s.id}`,
      kind: 'experience', title: e.title,
      subtitle: `${t.name} · ${new Date(s.startsAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
      thumbnail: e.coverImageUrl, unitPrice: t.price, currency: t.currency,
      quantity: this.qty(), hub: e.hub,
    });
    this.router.navigate(['/checkout']);
  }
}
