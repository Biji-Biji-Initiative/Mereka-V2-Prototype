import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'mereka-user-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen">
      <div class="max-w-[1320px] mx-auto px-6 py-8 grid grid-cols-12 gap-6">
        <aside class="col-span-12 md:col-span-3">
          <div class="sticky top-20 bg-white border border-neutral-200 rounded-lg p-4 text-sm">
            <p class="text-[11px] uppercase tracking-widest text-neutral-400 mb-2 px-3">Dashboard</p>
            <ul class="space-y-0.5">
              <li *ngFor="let item of nav">
                <a [routerLink]="item.link" [routerLinkActiveOptions]="{ exact: item.exact || false }"
                   routerLinkActive="bg-neutral-100 text-neutral-900 font-medium"
                   class="block px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-50">{{ item.label }}</a>
              </li>
            </ul>
          </div>
        </aside>
        <main class="col-span-12 md:col-span-9"><router-outlet /></main>
      </div>
    </div>
  `,
})
export class UserDashboardShellComponent {
  readonly nav = [
    { label: 'Overview', link: '/dashboard', exact: true },
    { label: 'Bookings', link: '/dashboard/bookings' },
    { label: 'Courses', link: '/dashboard/courses' },
    { label: 'Favorites', link: '/dashboard/favorites' },
    { label: 'Notifications', link: '/dashboard/notifications' },
    { label: 'Reviews', link: '/dashboard/reviews' },
    { label: 'Billing', link: '/dashboard/billing' },
    { label: 'Transactions', link: '/dashboard/transactions' },
    { label: 'Settings', link: '/dashboard/settings' },
  ];
}
