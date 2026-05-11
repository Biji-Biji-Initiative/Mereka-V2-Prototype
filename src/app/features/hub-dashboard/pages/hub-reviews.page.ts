import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
@Component({
  selector: 'mereka-hub-reviews', standalone: true, imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">Reviews</h1>
    <section class="bg-white border border-neutral-200 rounded-lg p-6 mb-6 flex items-center gap-6">
      <div>
        <div class="text-5xl font-semibold">4.7</div>
        <div class="text-yellow-500">★★★★<span class="text-neutral-300">★</span></div>
        <p class="text-xs text-neutral-500 mt-1">From 412 reviews</p>
      </div>
      <ul class="flex-1 space-y-1.5">
        <li *ngFor="let r of dist" class="grid grid-cols-[40px_1fr_40px] gap-3 items-center text-sm">
          <span class="text-neutral-500">{{ r.s }} ★</span>
          <div class="h-2 bg-neutral-100 rounded-full overflow-hidden"><div class="h-full bg-yellow-400" [style.width.%]="r.pct"></div></div>
          <span class="text-right text-xs text-neutral-500">{{ r.c }}</span>
        </li>
      </ul>
    </section>
    <ul class="space-y-3">
      <li *ngFor="let r of items" class="bg-white border border-neutral-200 rounded-lg p-5">
        <div class="text-yellow-500">{{ '★'.repeat(r.rating) }}<span class="text-neutral-300">{{ '★'.repeat(5 - r.rating) }}</span></div>
        <div class="text-xs text-neutral-500 mt-1">{{ r.author }} · {{ r.at | date: 'MMM d' }}</div>
        <p class="text-sm text-neutral-700 mt-2">{{ r.body }}</p>
      </li>
    </ul>
  `,
})
export class HubReviewsPage {
  readonly dist = [
    { s: 5, c: 281, pct: 68 }, { s: 4, c: 82, pct: 20 }, { s: 3, c: 28, pct: 7 }, { s: 2, c: 12, pct: 3 }, { s: 1, c: 9, pct: 2 },
  ];
  readonly items = [
    { author: 'Marcus Lee', rating: 5, body: 'The 1:1 with Aisha was sharp and useful. Booked again.', at: '2026-05-04' },
    { author: 'Florence J', rating: 4, body: 'Loved the crash course. Would prefer a longer Q&A.', at: '2026-04-30' },
  ];
}
