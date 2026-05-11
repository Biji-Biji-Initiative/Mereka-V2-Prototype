import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';
import type { Experience } from '../../marketplace/models/marketplace.model';

@Component({
  selector: 'mereka-experience-admin-list',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[1320px] mx-auto px-6 py-10">
      <header class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-semibold">My Experiences</h1>
          <p class="text-sm text-neutral-500">Manage your listings, bookings, and reviews.</p>
        </div>
        <a routerLink="../new" class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm">+ Host new</a>
      </header>
      <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead class="text-xs text-neutral-500 bg-neutral-50">
            <tr>
              <th class="text-left font-normal px-4 py-3">Experience</th>
              <th class="text-left font-normal px-4 py-3">Status</th>
              <th class="text-left font-normal px-4 py-3">Mode</th>
              <th class="text-right font-normal px-4 py-3">Tickets sold</th>
              <th class="text-right font-normal px-4 py-3">Rating</th>
              <th class="text-right font-normal px-4 py-3 w-40">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr *ngFor="let e of items()">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img [src]="e.coverImageUrl" [alt]="e.title" class="w-12 h-12 rounded object-cover" />
                  <div>
                    <div class="font-medium">{{ e.title }}</div>
                    <div class="text-xs text-neutral-500">{{ e.createdAt | date: 'MMM d, y' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 capitalize">
                <span class="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full text-white"
                  [class.bg-success]="e.status === 'published'" [class.bg-neutral-500]="e.status !== 'published'">{{ e.status }}</span>
              </td>
              <td class="px-4 py-3 capitalize">{{ e.mode }}</td>
              <td class="px-4 py-3 text-right tabular-nums">{{ ticketsSold(e) }}</td>
              <td class="px-4 py-3 text-right">★ {{ e.rating.average }}</td>
              <td class="px-4 py-3 text-right space-x-3">
                <a [routerLink]="['/experiences', e.slug]" class="text-primary-700 text-xs font-medium">View</a>
                <a [routerLink]="['/experiences/admin', e.slug, 'edit']" class="text-neutral-700 text-xs font-medium">Edit</a>
              </td>
            </tr>
            <tr *ngIf="items().length === 0">
              <td colspan="6" class="px-4 py-16 text-center text-neutral-500">No experiences yet. <a routerLink="../new" class="text-primary-700">Host one →</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ExperienceAdminListPage {
  private readonly api = inject(MarketplaceService);
  readonly items = toSignal(this.api.myExperiences(), { initialValue: [] as Experience[] });
  ticketsSold(e: Experience): number { return e.tickets.reduce((s, t) => s + t.sold, 0); }
}
