import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

/**
 * Shared dashboard sidebar (Figma 5208-173854).
 * - 300px white sidebar with profile/nav/calendar
 * - Sticky to top:64px (below global header), independent scroll when overflowed
 * - Mobile: hidden behind a FAB toggle, opens as a drawer with backdrop
 * - All nav items are routerLink with active highlighting via routerLinkActive
 *
 * Pages render this component alongside their main content; the activeSection input
 * is no longer needed because routerLinkActive handles highlighting based on URL.
 *
 * The component now reads user info directly from AuthService so it automatically
 * reflects the logged-in user's name, profile completion, and tier across ALL
 * dashboard sub-pages without requiring parent components to pass inputs.
 */
@Component({
  selector: 'mereka-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-sidebar.component.html',
})
export class DashboardSidebarComponent {
  private readonly auth = inject(AuthService);

  /** User display name — reads from AuthService, falls back to 'Guest' */
  readonly displayName = computed(() => this.auth.user()?.name ?? 'Guest');

  /**
   * Profile completion percentage — computed from available user fields.
   * Counts: name, email, profilePhoto, emailVerified, hubs (at least 1).
   */
  readonly profileCompletion = computed(() => {
    const user = this.auth.user();
    if (!user) return 0;
    let filled = 0;
    const total = 5;
    if (user.name) filled++;
    if (user.email) filled++;
    if (user.profilePhoto) filled++;
    if (user.emailVerified) filled++;
    if (user.hubs && user.hubs.length > 0) filled++;
    return Math.round((filled / total) * 100);
  });

  /** Account tier — for now defaults to FREE; can be extended when tier data is in AuthUser */
  readonly accountTier = computed<'FREE' | 'PRO' | 'ENTERPRISE'>(() => 'FREE');

  readonly mobileSidebarOpen = signal(false);
  toggleSidebar(): void { this.mobileSidebarOpen.update((v) => !v); }
  closeSidebar(): void { this.mobileSidebarOpen.set(false); }

  // SVG data URI hub icon (24×24)
  readonly hubIcon = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><rect width="24" height="24" rx="6" fill="#E5E5E7"/></svg>'
  );

  // ── Mini Calendar ────────────────────────────────────────────────────
  private static readonly MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  private static readonly DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  readonly calendarMonth = signal(new Date().getMonth());
  readonly calendarYear = signal(new Date().getFullYear());

  readonly calMonthName = computed(() => DashboardSidebarComponent.MONTH_NAMES[this.calendarMonth()]);
  readonly calYear = computed(() => this.calendarYear());
  readonly calDayHeaders = DashboardSidebarComponent.DAY_HEADERS;

  readonly calendarDays = computed(() => {
    const month = this.calendarMonth();
    const year = this.calendarYear();
    const today = new Date();

    const firstDow = new Date(year, month, 1).getDay();
    const startOffset = (firstDow + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const cells: { day: number; isCurrentMonth: boolean; isWeekend: boolean; isToday: boolean }[] = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      const d = daysInPrev - i;
      const dow = (cells.length) % 7;
      cells.push({ day: d, isCurrentMonth: false, isWeekend: dow >= 5, isToday: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = (cells.length) % 7;
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      cells.push({ day: d, isCurrentMonth: true, isWeekend: dow >= 5, isToday });
    }
    let nextDay = 1;
    while (cells.length % 7 !== 0) {
      const dow = (cells.length) % 7;
      cells.push({ day: nextDay++, isCurrentMonth: false, isWeekend: dow >= 5, isToday: false });
    }
    return cells;
  });

  calPrev(): void {
    if (this.calendarMonth() === 0) {
      this.calendarMonth.set(11);
      this.calendarYear.update((y) => y - 1);
    } else {
      this.calendarMonth.update((m) => m - 1);
    }
  }

  calNext(): void {
    if (this.calendarMonth() === 11) {
      this.calendarMonth.set(0);
      this.calendarYear.update((y) => y + 1);
    } else {
      this.calendarMonth.update((m) => m + 1);
    }
  }
}
