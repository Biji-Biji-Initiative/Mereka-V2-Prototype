import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { HubFilterService } from '../../../core/services/hub-filter.service';

interface FeedItem {
  authorName: string;
  authorAvatar: string;
  badge: 'ADMIN' | 'EXPERT' | 'MEMBER';
  date: string;
  postedIn: string;
  hubName: string;
  hubLogo: string;
  title: string;
  body: string;
  illustration?: string;
}

interface FeaturedItem {
  category: 'Programme' | 'Courses' | 'Experience' | 'Expertise';
  title: string;
  price: string;
  image: string;
}

interface MilestoneItem {
  date: string;
  type: string;
  title: string;
  hubName?: string;
  hubLogo?: string;
}

interface ProgramActivity {
  logo: string;
  name: string;
  dueDate: string;
  progress: number;
  ctaLabel: string;
  completed: boolean;
}

/**
 * Inline-SVG data URI placeholder generator. Renders a neutral-grey box with the
 * given dimensions written across it. Used instead of placehold.co so the page
 * always has a visible placeholder even when external image services are blocked
 * or slow (the user reported missing placeholders).
 */
function svgPlaceholder(w: number, h: number, opts: { label?: string; bg?: string; fg?: string; rounded?: number } = {}): string {
  const bg = opts.bg ?? '#E5E5E7';
  const fg = opts.fg ?? '#9CA0A6';
  const label = opts.label ?? `${w} × ${h}`;
  const r = opts.rounded ?? 0;
  const fontSize = Math.min(w, h) <= 24 ? 0 : Math.max(10, Math.min(w, h) / 8);
  const text = fontSize > 0
    ? `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="${fontSize}" fill="${fg}">${label}</text>`
    : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" fill="${bg}"/>${text}</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const PH = {
  avatar36: svgPlaceholder(36, 36, { rounded: 18, label: '' }),
  avatar32: svgPlaceholder(32, 32, { rounded: 16, label: '' }),
  hubBadge20: svgPlaceholder(20, 20, { rounded: 4 }),
  hubIcon24: svgPlaceholder(24, 24, { rounded: 6 }),
  feedIllust84: svgPlaceholder(84, 84, { rounded: 6, label: '84 × 84' }),
  featured103: svgPlaceholder(103, 103, { rounded: 8, label: '103 × 103' }),
};

@Component({
  selector: 'mereka-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.page.html',
})
export class DashboardPage {
  private readonly auth = inject(AuthService);
  readonly hubFilter = inject(HubFilterService);

  readonly user = this.auth.user;

  readonly displayName = computed(() => this.user()?.name ?? 'Guest');

  // Mobile drawer state
  readonly mobileSidebarOpen = signal(false);
  toggleSidebar(): void { this.mobileSidebarOpen.update((v) => !v); }
  closeSidebar(): void { this.mobileSidebarOpen.set(false); }

  // Sidebar profile — computed from auth state (same logic as DashboardSidebarComponent)
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
  readonly accountTier = computed<'FREE' | 'PRO' | 'ENTERPRISE'>(() => 'FREE');

  // ── Mini Calendar ────────────────────────────────────────────────────
  private static readonly MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  private static readonly DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  readonly calendarMonth = signal(new Date().getMonth());   // 0-based
  readonly calendarYear = signal(new Date().getFullYear());

  readonly calMonthName = computed(() => DashboardPage.MONTH_NAMES[this.calendarMonth()]);
  readonly calYear = computed(() => this.calendarYear());
  readonly calDayHeaders = DashboardPage.DAY_HEADERS;

  /** Returns an array of { day, isCurrentMonth, isWeekend, isToday } for the 6×7 grid. */
  readonly calendarDays = computed(() => {
    const month = this.calendarMonth();
    const year = this.calendarYear();
    const today = new Date();

    // First day of month (0=Sun → convert to Mon-start: Mon=0 … Sun=6)
    const firstDow = new Date(year, month, 1).getDay();
    const startOffset = (firstDow + 6) % 7; // days from Mon to first day

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const cells: { day: number; isCurrentMonth: boolean; isWeekend: boolean; isToday: boolean }[] = [];

    // Previous month trailing days
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = daysInPrev - i;
      const dow = (cells.length) % 7; // 0=Mon … 6=Sun
      cells.push({ day: d, isCurrentMonth: false, isWeekend: dow >= 5, isToday: false });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = (cells.length) % 7;
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      cells.push({ day: d, isCurrentMonth: true, isWeekend: dow >= 5, isToday });
    }
    // Next month leading days (fill to complete last row)
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

  // Filter chips — powered by shared HubFilterService
  readonly hubFilters = computed(() =>
    this.hubFilter.availableHubs().map(h => ({
      id: h.id,
      name: h.name,
      logo: h.logo ?? PH.hubIcon24,
    }))
  );
  readonly activeHub = this.hubFilter.activeHub;

  readonly featuredCategories = ['All', 'Program', 'Course', 'Experience', 'Expertise'] as const;
  readonly activeFeaturedCategory = signal<(typeof this.featuredCategories)[number]>('All');

  readonly milestoneCategories = ['All', 'Learning', 'Career', 'Experiences', 'Achievements'] as const;
  readonly activeMilestoneCategory = signal<(typeof this.milestoneCategories)[number]>('All');

  /** Filtered feed — only shows items matching the active hub filter. */
  readonly filteredFeed = computed(() => {
    const hubId = this.hubFilter.activeHub();
    if (hubId === 'all') return this.feed;
    // Map hub filter IDs to hub names used in feed items
    const hubNameMap: Record<string, string> = {
      'mereka': 'Mereka',
      'biji-biji': 'Biji-biji Initiative',
      'microsoft-my': 'Microsoft Malaysia',
      'mdec': 'MDEC',
    };
    const hubName = hubNameMap[hubId] ?? hubId;
    return this.feed.filter(item => item.hubName === hubName);
  });

  // Mock content — to be replaced by API calls once the dashboard backend ships.
  readonly feed: FeedItem[] = [
    {
      authorName: 'Jessica',
      authorAvatar: PH.avatar36,
      badge: 'ADMIN',
      date: 'Dec 12',
      postedIn: 'Posted in Announcements',
      hubName: 'Mereka',
      hubLogo: PH.hubBadge20,
      title: 'Welcome to AI4U!',
      body: 'We’re excited to have you here! AI4U is designed to help you upskill in AI—from the basics to practical, real-world skills you can apply right away. Expect bite-sized learning, hands-on activities, and a supportive community to keep you moving forward.',
      illustration: PH.feedIllust84,
    },
    {
      authorName: 'Dave',
      authorAvatar: PH.avatar36,
      badge: 'EXPERT',
      date: 'Nov 29',
      postedIn: 'Posted in Discussions',
      hubName: 'Biji-biji Initiative',
      hubLogo: PH.hubBadge20,
      title: 'The 30 Day Challenge',
      body: 'I created this challenge to help keep you on track and get quick breakthrough. Check out the #30daychallenge. You should be able to complete it with a 1 hour commitment per day.',
    },
    {
      authorName: 'Jessica',
      authorAvatar: PH.avatar36,
      badge: 'ADMIN',
      date: 'Nov 28',
      postedIn: 'Posted in Announcements',
      hubName: 'Biji-biji Initiative',
      hubLogo: PH.hubBadge20,
      title: 'Welcome to AI4U!',
      body: 'We’re excited to have you here! AI4U is designed to help you upskill in AI—from the basics to practical, real-world skills you can apply right away. Expect bite-sized learning, hands-on activities, and a supportive community to keep you moving forward.',
    },
  ];

  readonly featured: FeaturedItem[] = [
    { category: 'Programme', title: 'AI4U', price: '$49 / month', image: PH.featured103 },
    { category: 'Courses', title: 'AI Fluency by Microsoft', price: 'FREE', image: PH.featured103 },
    { category: 'Programme', title: 'Dynamous AI Mastery', price: '$749 / year', image: PH.featured103 },
    { category: 'Experience', title: 'Bike Sizing and Bike Fitting', price: 'RM150 / ticket', image: PH.featured103 },
    { category: 'Courses', title: 'AI Fluency by Microsoft', price: 'FREE', image: PH.featured103 },
  ];

  readonly milestones: MilestoneItem[] = [
    { date: '12 Nov 2025', type: 'Programme Completed', title: 'Mereka Career Accelerator', hubName: 'Biji-biji Initiative', hubLogo: PH.hubBadge20 },
    { date: '12 Feb 2024', type: 'Career Update', title: 'Student → Job Seeker' },
    { date: '12 Feb 2024', type: 'Experience Joined', title: 'Portfolio Sprint: Build Your First Case Study', hubName: 'Mereka', hubLogo: PH.hubBadge20 },
    { date: '12 Jul 2023', type: 'Programme Completed', title: 'AI Fluency by Microsoft', hubName: 'Biji-biji Initiative', hubLogo: PH.hubBadge20 },
    { date: '12 Jul 2022', type: 'Joined', title: 'Joined Mereka' },
  ];

  readonly programmes: ProgramActivity[] = [
    {
      logo: PH.hubIcon24,
      name: 'AI4U PROGRAMME',
      dueDate: '12 JAN 2026',
      progress: 80,
      ctaLabel: 'Explore Generative AI',
      completed: false,
    },
    {
      logo: PH.hubIcon24,
      name: 'AI FOR MY FUTURE',
      dueDate: '12 JAN 2026',
      progress: 100,
      ctaLabel: 'View Certificate',
      completed: true,
    },
  ];

  // Shared placeholder map exposed to template (sidebar hub icon).
  readonly ph = PH;

  setActiveHub(id: string): void {
    this.hubFilter.setActiveHub(id);
  }

  setFeaturedCategory(cat: (typeof this.featuredCategories)[number]): void {
    this.activeFeaturedCategory.set(cat);
  }

  setMilestoneCategory(cat: (typeof this.milestoneCategories)[number]): void {
    this.activeMilestoneCategory.set(cat);
  }
}
