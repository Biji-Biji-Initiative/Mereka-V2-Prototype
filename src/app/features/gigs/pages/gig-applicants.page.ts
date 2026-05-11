import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';

@Component({
  selector: 'mereka-gig-applicants',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[900px] mx-auto px-6 py-10">
      <a routerLink="/gigs/admin" class="text-sm text-neutral-500">← Back to my gigs</a>
      <header class="mt-2 mb-6">
        <h1 class="text-2xl font-semibold">Applicants</h1>
        <p class="text-sm text-neutral-500">Review proposals and shortlist candidates.</p>
      </header>
      <ul class="space-y-3">
        <li *ngFor="let a of applicants()" class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="flex items-start gap-4">
            <img [src]="a.avatar" [alt]="a.name" class="w-10 h-10 rounded-full" />
            <div class="flex-1">
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <div class="font-medium">{{ a.name }}</div>
                  <div class="text-xs text-neutral-500">Applied {{ a.appliedAt | date: 'MMM d' }}</div>
                </div>
                <span class="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                      [class.bg-success]="a.status === 'shortlisted' || a.status === 'hired'"
                      [class.bg-neutral-400]="a.status === 'new'"
                      [class.bg-error]="a.status === 'declined'">{{ a.status }}</span>
              </div>
              <p class="text-sm text-neutral-700 mt-2">{{ a.proposal }}</p>
              <div *ngIf="a.rateOffer as r" class="text-sm font-medium mt-2">{{ r.currency }} {{ r.amount }} / {{ r.period }}</div>
              <div class="mt-3 flex items-center gap-3">
                <button class="text-xs text-success font-medium">Shortlist</button>
                <button class="text-xs text-error font-medium">Decline</button>
                <button class="text-xs text-primary-700 font-medium">Message</button>
              </div>
            </div>
          </div>
        </li>
        <li *ngIf="applicants().length === 0" class="text-center text-neutral-500 py-12 border border-dashed border-neutral-200 rounded-lg">No applicants yet.</li>
      </ul>
    </div>
  `,
})
export class GigApplicantsPage {
  private readonly api = inject(MarketplaceService);
  private readonly route = inject(ActivatedRoute);
  readonly applicants = toSignal(this.route.paramMap.pipe(switchMap((p) => this.api.gigApplicants(p.get('slug') ?? ''))), { initialValue: [] });
}
