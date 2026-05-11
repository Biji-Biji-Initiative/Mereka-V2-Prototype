import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'mereka-hub-overview',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">Hub overview</h1>
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-neutral-200 rounded-lg p-5">
        <div class="text-xs text-neutral-500">Active learners</div>
        <div class="text-2xl font-semibold mt-1">1,820</div>
        <div class="text-xs text-success mt-1">▲ 12% MoM</div>
      </div>
      <div class="bg-white border border-neutral-200 rounded-lg p-5">
        <div class="text-xs text-neutral-500">Revenue (30d)</div>
        <div class="text-2xl font-semibold mt-1">MYR 18,420</div>
      </div>
      <div class="bg-white border border-neutral-200 rounded-lg p-5">
        <div class="text-xs text-neutral-500">Avg rating</div>
        <div class="text-2xl font-semibold mt-1">4.7 ★</div>
      </div>
      <div class="bg-white border border-neutral-200 rounded-lg p-5">
        <div class="text-xs text-neutral-500">Pending bookings</div>
        <div class="text-2xl font-semibold mt-1">7</div>
      </div>
    </section>
    <section class="bg-white border border-neutral-200 rounded-lg p-6 mt-6">
      <h2 class="font-semibold mb-4">Activity</h2>
      <ul class="space-y-3">
        <li *ngFor="let a of activity" class="flex gap-3 text-sm">
          <span class="text-lg">{{ a.icon }}</span>
          <span class="flex-1">{{ a.body }}</span>
          <span class="text-xs text-neutral-500">{{ a.at | date: 'MMM d' }}</span>
        </li>
      </ul>
    </section>
  `,
})
export class HubOverviewPage {
  readonly activity = [
    { icon: '🎟️', body: '12 new bookings for "Image Gen Crash Course".', at: '2026-05-09' },
    { icon: '⭐', body: 'New 5-star review on AI4U cohort 3.', at: '2026-05-08' },
    { icon: '💼', body: 'You posted a new gig: "Landing page for AI4U cohort 3".', at: '2026-05-04' },
  ];
}
