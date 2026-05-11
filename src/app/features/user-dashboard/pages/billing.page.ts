import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mereka-dashboard-billing',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">Billing</h1>
    <section class="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
      <h2 class="font-semibold mb-3">Payment methods</h2>
      <ul class="space-y-2">
        <li class="flex items-center justify-between border border-neutral-200 rounded-md p-4 text-sm">
          <span class="flex items-center gap-3">💳 Visa •••• 4242 <span class="text-xs text-neutral-500">expires 12/27</span></span>
          <button class="text-error text-xs">Remove</button>
        </li>
      </ul>
      <button class="mt-4 text-sm text-primary-700 font-medium">+ Add a payment method</button>
    </section>
    <section class="bg-white border border-neutral-200 rounded-lg p-6">
      <h2 class="font-semibold mb-3">Billing address</h2>
      <p class="text-sm text-neutral-700">Nicholas Hon<br />Mereka HQ, Publika<br />Solaris Dutamas, Kuala Lumpur 50480<br />Malaysia</p>
      <button class="mt-4 text-sm text-primary-700 font-medium">Edit address</button>
    </section>
  `,
})
export class DashboardBillingPage {}
