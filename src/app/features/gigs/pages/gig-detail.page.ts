import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';

@Component({
  selector: 'mereka-gig-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="gig() as g; else loading">
      <div class="max-w-[1100px] mx-auto px-6 py-8 grid grid-cols-12 gap-8">
        <article class="col-span-12 md:col-span-8">
          <a routerLink="/gigs" class="text-sm text-neutral-500">← All gigs</a>
          <div class="mt-3 flex items-center gap-2 text-xs text-neutral-500">
            <img *ngIf="g.hub.hubLogo as l" [src]="l" [alt]="g.hub.hubName" class="w-5 h-5 rounded-full" />
            <a [routerLink]="['/hubs', g.hub.slug]" class="font-medium hover:text-neutral-900">{{ g.hub.hubName }}</a>
            <span>·</span>
            <span>Posted {{ g.postedAt | date: 'MMM d, y' }}</span>
            <span>·</span>
            <span>Expires {{ g.expiresAt | date: 'MMM d' }}</span>
          </div>
          <h1 class="text-3xl font-semibold mt-2">{{ g.title }}</h1>
          <div class="flex flex-wrap gap-2 mt-3 text-xs">
            <span class="bg-neutral-100 text-neutral-700 uppercase tracking-wider rounded-full px-2 py-0.5">{{ g.engagement }}</span>
            <span class="bg-neutral-100 text-neutral-700 uppercase tracking-wider rounded-full px-2 py-0.5">{{ g.remote }}</span>
            <span *ngFor="let s of g.skills" class="bg-neutral-100 text-neutral-700 uppercase tracking-wider rounded-full px-2 py-0.5">{{ s }}</span>
          </div>
          <section class="mt-8">
            <h2 class="font-semibold mb-2">Brief</h2>
            <p class="text-neutral-700 leading-relaxed whitespace-pre-line">{{ g.description }}</p>
          </section>
        </article>
        <aside class="col-span-12 md:col-span-4">
          <div class="sticky top-20 bg-white border border-neutral-200 rounded-lg p-6">
            <div class="text-sm text-neutral-500">Budget</div>
            <div class="text-2xl font-semibold">{{ g.budget.currency }} {{ g.budget.min }}–{{ g.budget.max }}</div>
            <div class="text-xs text-neutral-500">/ {{ g.budget.period }}</div>
            <p class="text-xs text-neutral-500 mt-3">{{ g.applicantCount }} people have applied.</p>

            <form *ngIf="!submitted()" class="mt-5 space-y-3" (submit)="$event.preventDefault(); apply()">
              <label class="block">
                <span class="text-xs uppercase tracking-wider text-neutral-500">Your rate offer ({{ g.budget.currency }})</span>
                <input type="number" min="0" [ngModel]="rate()" (ngModelChange)="rate.set($event)" name="rate"
                       class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" />
              </label>
              <label class="block">
                <span class="text-xs uppercase tracking-wider text-neutral-500">Proposal</span>
                <textarea rows="4" [ngModel]="proposal()" (ngModelChange)="proposal.set($event)" name="proposal"
                          class="mt-1 w-full px-3 py-2 rounded border border-neutral-200"
                          placeholder="Why you, and how you'd approach it…"></textarea>
              </label>
              <button type="submit" class="w-full px-4 py-2.5 rounded-full bg-neutral-900 text-white text-sm">Apply</button>
            </form>
            <p *ngIf="submitted()" class="mt-5 text-sm text-success">✓ Your proposal has been submitted.</p>
          </div>
        </aside>
      </div>
    </ng-container>
    <ng-template #loading><div class="max-w-[1320px] mx-auto px-6 py-24 text-center text-neutral-500">Loading gig…</div></ng-template>
  `,
})
export class GigDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(MarketplaceService);
  readonly gig = toSignal(this.route.paramMap.pipe(switchMap((p) => this.api.gigBySlug(p.get('slug') ?? ''))), { initialValue: null });
  readonly rate = signal<number | null>(null);
  readonly proposal = signal('');
  readonly submitted = signal(false);
  apply(): void { if (this.proposal().trim()) this.submitted.set(true); }
}
