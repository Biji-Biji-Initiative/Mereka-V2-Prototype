import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'mereka-dashboard-reviews',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">Reviews you've written</h1>
    <ul class="space-y-3">
      <li *ngFor="let r of reviews" class="bg-white border border-neutral-200 rounded-lg p-5">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-neutral-500 uppercase tracking-wider">{{ r.kind }}</div>
            <div class="font-medium">{{ r.target }}</div>
          </div>
          <div class="text-yellow-500">{{ '★'.repeat(r.rating) }}<span class="text-neutral-300">{{ '★'.repeat(5 - r.rating) }}</span></div>
        </div>
        <p class="text-sm text-neutral-700 mt-2">{{ r.body }}</p>
        <div class="text-xs text-neutral-500 mt-1">{{ r.at | date: 'MMM d, y' }}</div>
      </li>
    </ul>
  `,
})
export class DashboardReviewsPage {
  readonly reviews = [
    { kind: 'Program', target: 'AI4U — Practical AI for Everyone', rating: 5, body: 'Super practical and the cohort is great.', at: '2026-04-22' },
    { kind: 'Expertise', target: '1:1 with Jonas Lee', rating: 5, body: 'Honest, sharp, useful in 45 minutes. Booked again.', at: '2026-04-12' },
  ];
}
