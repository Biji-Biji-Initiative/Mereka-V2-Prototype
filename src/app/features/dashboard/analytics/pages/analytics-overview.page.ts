import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mereka-analytics-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics-overview.page.html',
})
export class AnalyticsOverviewPage {
  readonly Math = Math;

  readonly range = signal<'7d' | '30d' | '90d' | '12m' | 'all'>('30d');
  setRange(r: '7d' | '30d' | '90d' | '12m' | 'all'): void { this.range.set(r); }

  readonly tab = signal<'overview' | 'audience' | 'engagement' | 'revenue' | 'programmes' | 'funnels'>('overview');
  setTab(t: 'overview' | 'audience' | 'engagement' | 'revenue' | 'programmes' | 'funnels'): void { this.tab.set(t); }

  /* ── Overview KPIs ── */
  readonly kpis = [
    { label: 'Total Revenue',        value: 'RM 142,800',  delta: '+12.4%', positive: true,  hint: 'vs. previous 30d', icon: 'revenue' },
    { label: 'Active Learners',      value: '1,284',        delta: '+8.1%',  positive: true,  hint: 'unique logins',    icon: 'learners' },
    { label: 'Programme Completion', value: '64%',          delta: '+2.3pp', positive: true,  hint: 'rolling 90d',      icon: 'completion' },
    { label: 'Avg NPS',              value: '+47',          delta: '-3',     positive: false, hint: 'last cohort',      icon: 'nps' },
  ];

  readonly chartBars = [22, 38, 45, 31, 54, 49, 62, 58, 71, 66, 78, 84, 79, 88, 92];
  readonly chartBarsPrev = [18, 30, 38, 28, 45, 42, 52, 50, 60, 58, 65, 70, 68, 75, 80];
  readonly chartLabels = ['Apr 12', 'Apr 14', 'Apr 16', 'Apr 18', 'Apr 20', 'Apr 22', 'Apr 24', 'Apr 26', 'Apr 28', 'Apr 30', 'May 2', 'May 4', 'May 6', 'May 8', 'May 10'];

  readonly funnel = [
    { label: 'Visited landing page', count: 12480, pct: 100,  color: '#1A1623' },
    { label: 'Started application',  count: 4220,  pct: 33.8, color: '#303345' },
    { label: 'Submitted form',       count: 1640,  pct: 13.1, color: '#4A3F6B' },
    { label: 'Paid',                 count: 980,   pct: 7.85, color: '#6366F1' },
    { label: 'Completed week 1',     count: 612,   pct: 4.90, color: '#818CF8' },
  ];

  readonly topPrograms = [
    { title: 'Digital Skills Accelerator', learners: 3247, completion: 42, revenue: 'RM 48,200', hubs: 5, status: 'live' },
    { title: 'AI4U',                       learners: 1713, completion: 78, revenue: 'RM 39,840', hubs: 3, status: 'live' },
    { title: 'Career Accelerator',         learners: 286,  completion: 64, revenue: 'RM 17,140', hubs: 1, status: 'live' },
    { title: 'AI Fluency by Microsoft',    learners: 482,  completion: 55, revenue: 'FREE',      hubs: 1, status: 'live' },
    { title: 'Internet Search & Beyond',   learners: 219,  completion: 71, revenue: 'FREE',      hubs: 1, status: 'live' },
    { title: 'Dynamous AI Mastery',        learners: 142,  completion: 71, revenue: 'RM 6,200',  hubs: 2, status: 'draft' },
  ];

  readonly trafficSources = [
    { source: 'Direct',   value: 38, color: '#1A1623' },
    { source: 'Organic',  value: 27, color: '#303345' },
    { source: 'Social',   value: 18, color: '#6366F1' },
    { source: 'Referral', value: 11, color: '#818CF8' },
    { source: 'Email',    value: 6,  color: '#C4B5FD' },
  ];

  readonly topGeos = [
    { country: 'Malaysia',    pct: 42, flag: '🇲🇾' },
    { country: 'Singapore',   pct: 18, flag: '🇸🇬' },
    { country: 'Indonesia',   pct: 11, flag: '🇮🇩' },
    { country: 'Philippines', pct: 8,  flag: '🇵🇭' },
    { country: 'Vietnam',     pct: 6,  flag: '🇻🇳' },
    { country: 'Other',       pct: 15, flag: '🌏' },
  ];

  /* ── Audience tab ── */
  readonly audienceKpis = [
    { label: 'Total Users',        value: '8,742',  delta: '+14.2%', positive: true },
    { label: 'New Users (30d)',     value: '1,128',  delta: '+22.5%', positive: true },
    { label: 'Returning Rate',     value: '68%',    delta: '+3.1pp', positive: true },
    { label: 'Avg Session Duration', value: '12m 34s', delta: '-1m 02s', positive: false },
  ];

  readonly demographics = [
    { label: '18-24', pct: 18 },
    { label: '25-34', pct: 42 },
    { label: '35-44', pct: 24 },
    { label: '45-54', pct: 11 },
    { label: '55+',   pct: 5 },
  ];

  readonly deviceBreakdown = [
    { device: 'Desktop', pct: 54, icon: '💻' },
    { device: 'Mobile',  pct: 38, icon: '📱' },
    { device: 'Tablet',  pct: 8,  icon: '📋' },
  ];

  readonly userRoles = [
    { role: 'Learners',       count: 6840, pct: 78 },
    { role: 'Hub Admins',     count: 124,  pct: 1 },
    { role: 'Mentors',        count: 89,   pct: 1 },
    { role: 'Content Creators', count: 312,  pct: 4 },
    { role: 'Browsers (no enroll)', count: 1377, pct: 16 },
  ];

  readonly topReferrers = [
    { source: 'google.com',     visits: 3420 },
    { source: 'linkedin.com',   visits: 1280 },
    { source: 'instagram.com',  visits: 890 },
    { source: 'facebook.com',   visits: 640 },
    { source: 'twitter.com',    visits: 380 },
  ];

  /* ── Engagement tab ── */
  readonly engagementKpis = [
    { label: 'Avg Completion Rate', value: '64%',    delta: '+2.3pp', positive: true },
    { label: 'Content Views',       value: '24,680', delta: '+18.4%', positive: true },
    { label: 'Avg Time per Module', value: '42m',    delta: '+5m',    positive: true },
    { label: 'Drop-off Rate',       value: '23%',    delta: '-4.1pp', positive: true },
  ];

  readonly contentEngagement = [
    { type: 'Courses',      views: 14200, completions: 8840, rate: 62 },
    { type: 'Experiences',   views: 6480,  completions: 4520, rate: 70 },
    { type: 'Expertise 1:1', views: 4000,  completions: 3200, rate: 80 },
  ];

  readonly weeklyActivity = [
    { day: 'Mon', sessions: 820 },
    { day: 'Tue', sessions: 940 },
    { day: 'Wed', sessions: 1100 },
    { day: 'Thu', sessions: 980 },
    { day: 'Fri', sessions: 760 },
    { day: 'Sat', sessions: 1240 },
    { day: 'Sun', sessions: 680 },
  ];
  readonly maxSessions = 1240;

  readonly dropOffPoints = [
    { module: 'Module 1 — Intro Quiz',         dropRate: 8 },
    { module: 'Module 2 — First Assignment',    dropRate: 15 },
    { module: 'Module 3 — Midterm Project',     dropRate: 23 },
    { module: 'Module 5 — Final Assessment',    dropRate: 12 },
  ];

  /* ── Revenue tab ── */
  readonly revenueKpis = [
    { label: 'Total Revenue',       value: 'RM 142,800', delta: '+12.4%', positive: true },
    { label: 'MRR',                  value: 'RM 18,600',  delta: '+8.2%',  positive: true },
    { label: 'ARPU',                 value: 'RM 111.20',  delta: '+3.8%',  positive: true },
    { label: 'Refund Rate',          value: '2.1%',       delta: '-0.4pp', positive: true },
  ];

  readonly revenueByProgram = [
    { program: 'Digital Skills Accelerator', revenue: 48200, pct: 33.8 },
    { program: 'AI4U',                      revenue: 39840, pct: 27.9 },
    { program: 'Career Accelerator',        revenue: 17140, pct: 12.0 },
    { program: 'Dynamous AI Mastery',       revenue: 6200,  pct: 4.3 },
    { program: 'Other programmes',          revenue: 31420, pct: 22.0 },
  ];

  readonly revenueMonthly = [
    { month: 'Dec', amount: 8200 },
    { month: 'Jan', amount: 9800 },
    { month: 'Feb', amount: 11400 },
    { month: 'Mar', amount: 13200 },
    { month: 'Apr', amount: 15600 },
    { month: 'May', amount: 18600 },
  ];
  readonly maxRevenue = 18600;

  readonly paymentMethods = [
    { method: 'FPX',            pct: 42 },
    { method: 'Credit Card',    pct: 31 },
    { method: 'E-wallet',       pct: 18 },
    { method: 'Bank Transfer',  pct: 9 },
  ];

  readonly subscriptionTiers = [
    { tier: 'Standard', subscribers: 842, revenue: 'RM 84,200', churn: '3.2%' },
    { tier: 'Premium',  subscribers: 318, revenue: 'RM 58,600', churn: '1.8%' },
  ];

  /* ── Funnels tab ── */
  readonly funnelStages = [
    { stage: 'Awareness',     description: 'Visited landing page',      count: 12480, convRate: null },
    { stage: 'Interest',      description: 'Viewed programme details',  count: 6840,  convRate: 54.8 },
    { stage: 'Consideration', description: 'Started application form',  count: 4220,  convRate: 61.7 },
    { stage: 'Intent',        description: 'Completed application',     count: 1640,  convRate: 38.9 },
    { stage: 'Purchase',      description: 'Paid & enrolled',           count: 980,   convRate: 59.8 },
    { stage: 'Activation',    description: 'Completed first module',    count: 612,   convRate: 62.4 },
    { stage: 'Retention',     description: 'Active after 30 days',      count: 489,   convRate: 79.9 },
  ];

  readonly funnelBySource = [
    { source: 'Direct',   visitors: 4742, enrolled: 412, rate: 8.7 },
    { source: 'Organic',  visitors: 3370, enrolled: 298, rate: 8.8 },
    { source: 'Social',   visitors: 2246, enrolled: 164, rate: 7.3 },
    { source: 'Referral', visitors: 1373, enrolled: 78,  rate: 5.7 },
    { source: 'Email',    visitors: 749,  enrolled: 28,  rate: 3.7 },
  ];

  /** Compute SVG stroke-dashoffset for donut chart segments. */
  getDonutOffset(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += this.trafficSources[i].value * 0.88;
    }
    return -offset;
  }
}
