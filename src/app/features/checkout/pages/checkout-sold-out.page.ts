import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'mereka-checkout-sold-out', standalone: true, imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-xl mx-auto px-6 py-24 text-center">
      <div class="w-16 h-16 rounded-full bg-error/10 text-error text-3xl flex items-center justify-center mx-auto mb-6">🎟️</div>
      <h1 class="text-2xl font-semibold">Sold out</h1>
      <p class="text-neutral-700 mt-2">All tickets for this session have been claimed in the time it took you to check out. Join the waitlist and we'll let you know if a spot opens.</p>
      <div class="mt-8 flex items-center justify-center gap-3">
        <button class="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-sm">Join waitlist</button>
        <a routerLink="/experiences" class="px-5 py-2.5 rounded-full border border-neutral-200 text-sm">Browse alternatives</a>
      </div>
    </div>
  `,
})
export class CheckoutSoldOutPage {}
