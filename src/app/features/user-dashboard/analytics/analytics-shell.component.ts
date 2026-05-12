import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavItem {
  label: string;
  link: string;
  iconPath: string;
  exact?: boolean;
}

// Sidebar matches Figma 5208:186993 / 5208:190155 — primary "Analytics" group
// (Impact overview, Programme, Courses, Experience, Expertise, Gig) plus the
// secondary "Cross-service" group (Correlations, KPI builder, B40 impact).
@Component({
  selector: 'mereka-analytics-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen">
      <div class="flex">
        <aside class="w-60 shrink-0 border-r border-neutral-200 bg-white min-h-screen sticky top-0">
          <div class="p-5">
            <a routerLink="/dashboard"
               class="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Back
            </a>
          </div>
          <nav class="px-3 pb-6">
            <p class="px-3 pb-2 text-[11px] uppercase tracking-widest text-neutral-400">Analytics</p>
            <ul class="space-y-0.5">
              <li *ngFor="let item of primary">
                <a [routerLink]="item.link"
                   [routerLinkActiveOptions]="{ exact: item.exact || false }"
                   routerLinkActive="bg-neutral-100 text-neutral-900 font-medium"
                   class="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-neutral-600 hover:bg-neutral-50">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path [attr.d]="item.iconPath" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ item.label }}
                </a>
              </li>
            </ul>
            <div class="my-4 border-t border-neutral-100"></div>
            <ul class="space-y-0.5">
              <li *ngFor="let item of secondary">
                <a [routerLink]="item.link"
                   routerLinkActive="bg-neutral-100 text-neutral-900 font-medium"
                   class="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-neutral-600 hover:bg-neutral-50">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path [attr.d]="item.iconPath" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ item.label }}
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        <main class="flex-1 min-w-0">
          <div class="max-w-[1200px] mx-auto px-8 py-8">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `,
})
export class AnalyticsShellComponent {
  readonly primary: NavItem[] = [
    { label: 'Impact overview', link: '/dashboard/analytics', exact: true,
      iconPath: 'M3 3v18h18M7 14l3-3 4 4 5-7' },
    { label: 'Programme', link: '/dashboard/analytics/programme',
      iconPath: 'M4 4h16v4H4zM4 12h16v4H4zM4 18h10' },
    { label: 'Courses', link: '/dashboard/analytics/courses',
      iconPath: 'M4 19V5l8 4 8-4v14l-8-4-8 4z' },
    { label: 'Experience', link: '/dashboard/analytics/experience',
      iconPath: 'M3 8h18M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z' },
    { label: 'Expertise', link: '/dashboard/analytics/expertise',
      iconPath: 'M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zM20 21a8 8 0 10-16 0' },
    { label: 'Gig', link: '/dashboard/analytics/gig',
      iconPath: 'M3 7h18l-2 13H5L3 7zM8 7V5a4 4 0 018 0v2' },
  ];

  readonly secondary: NavItem[] = [
    { label: 'Correlations', link: '/dashboard/analytics/correlations',
      iconPath: 'M4 12a8 8 0 018-8M20 12a8 8 0 01-8 8M8 4l-4 4M16 20l4-4' },
    { label: 'KPI builder', link: '/dashboard/analytics/kpi-builder',
      iconPath: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z' },
    { label: 'B40 impact', link: '/dashboard/analytics/b40',
      iconPath: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
  ];
}
