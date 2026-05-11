import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'mereka-checkout-expired', standalone: true, imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-xl mx-auto px-6 py-24 text-center">
      <div class="w-16 h-16 rounded-full bg-warning/10 text-warning text-3xl flex items-center justify-center mx-auto mb-6">⏳</div>
      <h1 class="text-2xl font-semibold">Your session expired</h1>
      <p class="text-neutral-700 mt-2">For your security, checkout sessions expire after 15 minutes. Your cart is still saved.</p>
      <div class="mt-8 flex items-center justify-center gap-3">
        <a routerLink="/checkout" class="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-sm">Try again</a>
        <a routerLink="/experiences" class="px-5 py-2.5 rounded-full border border-neutral-200 text-sm">Keep browsing</a>
      </div>
    </div>
  `,
})
export class CheckoutExpiredPage {}
