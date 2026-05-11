import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
@Component({
  selector: 'mereka-hub-bookings', standalone: true, imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">Bookings</h1>
    <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="text-xs text-neutral-500 bg-neutral-50"><tr>
          <th class="text-left font-normal px-4 py-3">Customer</th>
          <th class="text-left font-normal px-4 py-3">Listing</th>
          <th class="text-left font-normal px-4 py-3">When</th>
          <th class="text-right font-normal px-4 py-3">Paid</th>
          <th class="text-right font-normal px-4 py-3">Status</th>
        </tr></thead>
        <tbody class="divide-y divide-neutral-100">
          <tr *ngFor="let r of rows">
            <td class="px-4 py-3 font-medium">{{ r.customer }}</td>
            <td class="px-4 py-3">{{ r.listing }}</td>
            <td class="px-4 py-3 text-neutral-500">{{ r.when | date: 'MMM d · h:mm a' }}</td>
            <td class="px-4 py-3 text-right tabular-nums">MYR {{ r.amount }}</td>
            <td class="px-4 py-3 text-right">
              <span class="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full text-white"
                    [class.bg-info]="r.status === 'pending'" [class.bg-success]="r.status === 'paid'">{{ r.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class HubBookingsPage {
  readonly rows = [
    { customer: 'Marcus Lee', listing: 'Image Gen Crash Course · 7 Jun', when: '2026-05-04T10:00:00', amount: 240, status: 'paid' },
    { customer: 'Florence J', listing: 'Image Gen Crash Course · 7 Jun', when: '2026-05-04T09:00:00', amount: 180, status: 'paid' },
    { customer: 'Sarah L', listing: '1:1 with Aisha · 22 May 4pm', when: '2026-05-03T08:30:00', amount: 280, status: 'pending' },
  ];
}
