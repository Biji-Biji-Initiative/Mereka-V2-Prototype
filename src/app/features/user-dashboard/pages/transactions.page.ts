import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transaction {
  id: string;
  date: string;
  programme: string;
  hub: string;
  amount: string;
  method: 'FPX' | 'Credit Card' | 'E-wallet' | 'Bank Transfer' | 'FREE';
  status: 'paid' | 'pending' | 'refunded' | 'failed';
  receiptId: string;
}

@Component({
  selector: 'mereka-dashboard-transactions',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transactions.page.html',
})
export class DashboardTransactionsPage {
  readonly filters = ['All', 'Paid', 'Pending', 'Refunded'] as const;
  readonly activeFilter = signal<string>('All');

  setFilter(f: string): void { this.activeFilter.set(f); }

  readonly transactions: Transaction[] = [
    {
      id: 'TXN-2026-001',
      date: '10 May 2026',
      programme: 'AI4U Programme',
      hub: 'Biji-biji Initiative',
      amount: 'RM 490.00',
      method: 'FPX',
      status: 'paid',
      receiptId: 'RCP-4821',
    },
    {
      id: 'TXN-2026-002',
      date: '28 Apr 2026',
      programme: 'Digital Skills Accelerator',
      hub: 'Biji-biji Initiative',
      amount: 'RM 350.00',
      method: 'Credit Card',
      status: 'paid',
      receiptId: 'RCP-4790',
    },
    {
      id: 'TXN-2026-003',
      date: '15 Apr 2026',
      programme: 'Career Accelerator',
      hub: 'Mereka',
      amount: 'RM 749.00',
      method: 'E-wallet',
      status: 'paid',
      receiptId: 'RCP-4756',
    },
    {
      id: 'TXN-2026-004',
      date: '02 Apr 2026',
      programme: 'AI Fluency by Microsoft',
      hub: 'Biji-biji Initiative',
      amount: 'FREE',
      method: 'FREE',
      status: 'paid',
      receiptId: 'RCP-4720',
    },
    {
      id: 'TXN-2026-005',
      date: '20 Mar 2026',
      programme: 'Dynamous AI Mastery',
      hub: 'Biji-biji Initiative',
      amount: 'RM 620.00',
      method: 'FPX',
      status: 'refunded',
      receiptId: 'RCP-4688',
    },
    {
      id: 'TXN-2026-006',
      date: '05 Mar 2026',
      programme: 'Internet Search & Beyond',
      hub: 'Mereka',
      amount: 'FREE',
      method: 'FREE',
      status: 'paid',
      receiptId: 'RCP-4650',
    },
    {
      id: 'TXN-2026-007',
      date: '18 Feb 2026',
      programme: 'Bike Sizing and Fitting',
      hub: 'Biji-biji Initiative',
      amount: 'RM 150.00',
      method: 'E-wallet',
      status: 'pending',
      receiptId: 'RCP-4612',
    },
  ];

  readonly filteredTransactions = () => {
    const f = this.activeFilter();
    if (f === 'All') return this.transactions;
    return this.transactions.filter(t => t.status === f.toLowerCase());
  };

  readonly summary = {
    totalSpent: 'RM 2,359.00',
    totalTransactions: 7,
    pendingPayments: 'RM 150.00',
    refunds: 'RM 620.00',
  };
}
