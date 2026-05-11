import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'mereka-dashboard-transactions',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">Transactions</h1>
    <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="text-xs text-neutral-500 bg-neutral-50">
          <tr>
            <th class="text-left font-normal px-4 py-3">Date</th>
            <th class="text-left font-normal px-4 py-3">Description</th>
            <th class="text-right font-normal px-4 py-3">Amount</th>
            <th class="text-right font-normal px-4 py-3">Status</th>
            <th class="text-right font-normal px-4 py-3">Receipt</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr *ngFor="let t of rows">
            <td class="px-4 py-3 text-neutral-500">{{ t.at | date: 'MMM d' }}</td>
            <td class="px-4 py-3 font-medium">{{ t.desc }}</td>
            <td class="px-4 py-3 text-right tabular-nums">{{ t.amount }}</td>
            <td class="px-4 py-3 text-right text-success uppercase text-xs tracking-wider">{{ t.status }}</td>
            <td class="px-4 py-3 text-right"><a href="#" class="text-primary-700 text-xs">View</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class DashboardTransactionsPage {
  readonly rows = [
    { at: '2026-05-04', desc: 'Image Gen Crash Course · Early bird', amount: 'MYR 185.22', status: 'paid' },
    { at: '2026-04-22', desc: 'AI4U cohort 3 enrolment', amount: 'MYR 1,499.00', status: 'paid' },
  ];
}
