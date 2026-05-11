import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'mereka-hub-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen">
      <div class="max-w-[1320px] mx-auto px-6 py-8 grid grid-cols-12 gap-6">
        <aside class="col-span-12 md:col-span-3">
          <div class="sticky top-20 bg-white border border-neutral-200 rounded-lg p-4 text-sm">
            <div class="flex items-center gap-2 mb-4 px-2">
              <div class="w-9 h-9 rounded-lg bg-primary-100 text-primary-800 flex items-center justify-center font-semibold">AI</div>
              <div class="leading-tight">
                <div class="font-semibold text-sm">AI4U Collective</div>
                <div class="text-[10px] text-neutral-500">Hub admin</div>
              </div>
            </div>
            <p class="text-[11px] uppercase tracking-widest text-neutral-400 mb-2 px-3">Hub</p>
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
export class HubDashboardShellComponent {
  readonly nav = [
    { label: 'Overview', link: '/hub', exact: true },
    { label: 'Analytics', link: '/hub/analytics' },
    { label: 'Bookings', link: '/hub/bookings' },
    { label: 'Calendar', link: '/hub/calendar' },
    { label: 'Services', link: '/hub/services' },
    { label: 'Jobs', link: '/hub/jobs' },
    { label: 'Reviews', link: '/hub/reviews' },
    { label: 'Engagement', link: '/hub/engagement' },
    { label: 'Settings', link: '/hub/settings' },
  ];
}
