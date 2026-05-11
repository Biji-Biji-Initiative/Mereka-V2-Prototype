import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

interface Booking { kind: 'experience'|'expertise'|'program'; title: string; when: string; host: string; status: 'upcoming'|'completed'|'cancelled'; price: string; }

@Component({
  selector: 'mereka-dashboard-bookings',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">My Bookings</h1>
    <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="text-xs text-neutral-500 bg-neutral-50">
          <tr>
            <th class="text-left font-normal px-4 py-3">Booking</th>
            <th class="text-left font-normal px-4 py-3">When</th>
            <th class="text-left font-normal px-4 py-3">Host</th>
            <th class="text-right font-normal px-4 py-3">Status</th>
            <th class="text-right font-normal px-4 py-3">Total</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr *ngFor="let b of bookings">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider">{{ b.kind }}</div>
              <div class="font-medium">{{ b.title }}</div>
            </td>
            <td class="px-4 py-3 text-neutral-500">{{ b.when | date: 'MMM d, y · h:mm a' }}</td>
            <td class="px-4 py-3">{{ b.host }}</td>
            <td class="px-4 py-3 text-right">
              <span class="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full text-white"
                    [class.bg-info]="b.status === 'upcoming'" [class.bg-success]="b.status === 'completed'" [class.bg-neutral-500]="b.status === 'cancelled'">{{ b.status }}</span>
            </td>
            <td class="px-4 py-3 text-right tabular-nums">{{ b.price }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class DashboardBookingsPage {
  readonly bookings: Booking[] = [
    { kind: 'experience', title: 'Image Gen Crash Course', when: '2026-06-07T10:00:00', host: 'Bijibiji Initiative', status: 'upcoming', price: 'MYR 185.22' },
    { kind: 'expertise', title: '1:1 with Aisha Rahman', when: '2026-05-22T16:00:00', host: 'AI4U Collective', status: 'upcoming', price: 'MYR 280.00' },
    { kind: 'experience', title: 'Climate Walk: KL Heritage Edition', when: '2026-05-24T09:00:00', host: 'Green School KL', status: 'completed', price: 'Free' },
  ];
}
