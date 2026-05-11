import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';
import type { Gig } from '../../marketplace/models/marketplace.model';

@Component({
  selector: 'mereka-gig-admin-list',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[1320px] mx-auto px-6 py-10">
      <header class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-semibold">My Gigs</h1>
          <p class="text-sm text-neutral-500">Track applicants, edit briefs, close listings.</p>
        </div>
        <a routerLink="../new" class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm">+ Post a gig</a>
      </header>
      <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead class="text-xs text-neutral-500 bg-neutral-50">
            <tr>
              <th class="text-left font-normal px-4 py-3">Title</th>
              <th class="text-left font-normal px-4 py-3">Status</th>
              <th class="text-right font-normal px-4 py-3">Applicants</th>
              <th class="text-right font-normal px-4 py-3">Posted</th>
              <th class="text-right font-normal px-4 py-3">Expires</th>
              <th class="text-right font-normal px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr *ngFor="let g of items()">
              <td class="px-4 py-3 font-medium">{{ g.title }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full text-white"
                  [class.bg-success]="g.status === 'open'" [class.bg-neutral-500]="g.status !== 'open'">{{ g.status }}</span>
              </td>
              <td class="px-4 py-3 text-right tabular-nums">{{ g.applicantCount }}</td>
              <td class="px-4 py-3 text-right text-neutral-500">{{ g.postedAt | date: 'MMM d' }}</td>
              <td class="px-4 py-3 text-right text-neutral-500">{{ g.expiresAt | date: 'MMM d' }}</td>
              <td class="px-4 py-3 text-right space-x-3">
                <a [routerLink]="['/gigs/admin', g.slug, 'applicants']" class="text-primary-700 text-xs font-medium">Applicants</a>
                <a [routerLink]="['/gigs/admin', g.slug, 'edit']" class="text-neutral-700 text-xs font-medium">Edit</a>
              </td>
            </tr>
            <tr *ngIf="items().length === 0">
              <td colspan="6" class="px-4 py-16 text-center text-neutral-500">No gigs yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class GigAdminListPage {
  private readonly api = inject(MarketplaceService);
  readonly items = toSignal(this.api.myGigs(), { initialValue: [] as Gig[] });
}
