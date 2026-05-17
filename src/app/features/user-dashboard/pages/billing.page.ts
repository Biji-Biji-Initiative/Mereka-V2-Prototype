import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'fpx' | 'ewallet';
  label: string;
  detail: string;
  isDefault: boolean;
  expiry?: string;
}

interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
}

@Component({
  selector: 'mereka-dashboard-billing',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './billing.page.html',
})
export class DashboardBillingPage {
  readonly filters = ['All', 'Paid', 'Pending', 'Overdue'] as const;
  readonly activeFilter = signal<string>('All');

  setFilter(f: string): void { this.activeFilter.set(f); }

  // Current plan
  readonly currentPlan = {
    name: 'Free',
    price: 'RM 0',
    period: '/ month',
    features: [
      'Access to free courses',
      'Join up to 2 hubs',
      'Basic profile',
      'Community discussions',
    ],
    limits: [
      'No certificate downloads',
      'No priority support',
      'Limited analytics',
    ],
  };

  readonly proPlan = {
    name: 'Pro',
    price: 'RM 29',
    period: '/ month',
    features: [
      'Unlimited courses & programmes',
      'Unlimited hub memberships',
      'Certificate downloads',
      'Priority support',
      'Advanced analytics',
      'Custom profile URL',
    ],
  };

  // Payment methods
  readonly paymentMethods = signal<PaymentMethod[]>([
    { id: 'pm1', type: 'visa', label: 'Visa', detail: '•••• •••• •••• 4242', isDefault: true, expiry: '12/27' },
    { id: 'pm2', type: 'fpx', label: 'FPX', detail: 'Maybank ••••6789', isDefault: false },
    { id: 'pm3', type: 'ewallet', label: 'Touch n Go', detail: 'faiz@tng.com', isDefault: false },
  ]);

  setDefaultPayment(id: string): void {
    this.paymentMethods.update(methods =>
      methods.map(m => ({ ...m, isDefault: m.id === id }))
    );
  }

  removePayment(id: string): void {
    this.paymentMethods.update(methods => methods.filter(m => m.id !== id));
  }

  // Invoices
  readonly invoices: Invoice[] = [
    { id: 'INV-2026-012', date: '10 May 2026', description: 'AI4U Programme - Monthly', amount: 'RM 490.00', status: 'paid' },
    { id: 'INV-2026-011', date: '28 Apr 2026', description: 'Digital Skills Accelerator', amount: 'RM 350.00', status: 'paid' },
    { id: 'INV-2026-010', date: '15 Apr 2026', description: 'Career Accelerator', amount: 'RM 749.00', status: 'paid' },
    { id: 'INV-2026-009', date: '01 Apr 2026', description: 'Platform Pro Subscription - April', amount: 'RM 29.00', status: 'paid' },
    { id: 'INV-2026-008', date: '20 Mar 2026', description: 'Bike Sizing Workshop', amount: 'RM 150.00', status: 'pending' },
    { id: 'INV-2026-007', date: '01 Mar 2026', description: 'Platform Pro Subscription - March', amount: 'RM 29.00', status: 'paid' },
    { id: 'INV-2026-006', date: '15 Feb 2026', description: 'Portfolio Sprint Workshop', amount: 'RM 120.00', status: 'overdue' },
  ];

  readonly filteredInvoices = computed(() => {
    const f = this.activeFilter();
    if (f === 'All') return this.invoices;
    return this.invoices.filter(inv => inv.status === f.toLowerCase());
  });

  readonly summary = computed(() => ({
    totalBilled: 'RM 1,917.00',
    paid: 'RM 1,647.00',
    pending: 'RM 150.00',
    overdue: 'RM 120.00',
  }));

  readonly cardTypeIcon: Record<string, string> = {
    visa: 'V',
    mastercard: 'MC',
    fpx: 'FPX',
    ewallet: 'TNG',
  };
}
