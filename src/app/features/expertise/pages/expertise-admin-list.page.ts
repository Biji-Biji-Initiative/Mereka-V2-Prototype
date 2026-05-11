import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';
import type { Expertise } from '../../marketplace/models/marketplace.model';

@Component({
  selector: 'mereka-expertise-admin-list',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[1320px] mx-auto px-6 py-10">
      <header class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-semibold">My Expertise</h1>
          <p class="text-sm text-neutral-500">Sessions you offer to the Mereka community.</p>
        </div>
        <a routerLink="../new" class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm">+ Offer expertise</a>
      </header>
      <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table class="w-full text-sm">
          <thead class="text-xs text-neutral-500 bg-neutral-50">
            <tr>
              <th class="text-left font-normal px-4 py-3">Title</th>
              <th class="text-left font-normal px-4 py-3">Format</th>
              <th class="text-right font-normal px-4 py-3">Sessions</th>
              <th class="text-right font-normal px-4 py-3">Rating</th>
              <th class="text-right font-normal px-4 py-3">Price</th>
              <th class="text-right font-normal px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr *ngFor="let e of items()">
              <td class="px-4 py-3">
                <div class="font-medium">{{ e.title }}</div>
                <div class="text-xs text-neutral-500">{{ e.createdAt | date: 'MMM d, y' }}</div>
              </td>
              <td class="px-4 py-3 capitalize">{{ e.format === '1:1' ? '1:1' : 'Group' }}</td>
              <td class="px-4 py-3 text-right tabular-nums">{{ e.upcomingSlots.length }} upcoming</td>
              <td class="px-4 py-3 text-right">★ {{ e.rating.average }}</td>
              <td class="px-4 py-3 text-right">{{ e.currency }} {{ e.pricePerSession }}</td>
              <td class="px-4 py-3 text-right space-x-3">
                <a [routerLink]="['/expertise', e.slug]" class="text-primary-700 text-xs font-medium">View</a>
                <a [routerLink]="['/expertise/admin', e.slug, 'edit']" class="text-neutral-700 text-xs font-medium">Edit</a>
              </td>
            </tr>
            <tr *ngIf="items().length === 0">
              <td colspan="6" class="px-4 py-16 text-center text-neutral-500">No expertise listings yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ExpertiseAdminListPage {
  private readonly api = inject(MarketplaceService);
  readonly items = toSignal(this.api.myExpertise(), { initialValue: [] as Expertise[] });
}
