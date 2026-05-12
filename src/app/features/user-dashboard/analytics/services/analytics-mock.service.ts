import { Injectable, signal } from '@angular/core';
import {
  B40ImpactSummary,
  CorrelationCell,
  ImpactFilterGroup,
  KpiBuilderField,
  KpiCard,
  SeriesPoint,
  ServiceCategory,
  ServiceRow,
} from './analytics.types';

@Injectable({ providedIn: 'root' })
export class AnalyticsMockService {
  readonly impactKpis = signal<KpiCard[]>([
    { label: 'Total reach', value: '12,847', delta: { value: '+12.4%', trend: 'up' }, hint: 'vs previous 30d' },
    { label: 'Revenue (YTD)', value: 'RM 3.6M', delta: { value: '+8.1%', trend: 'up' }, hint: 'across all services' },
    { label: 'Avg fill rate', value: '66%', delta: { value: '+4%', trend: 'up' }, hint: 'sessions filled' },
    { label: 'Conversion', value: '4.33%', delta: { value: '-0.2%', trend: 'down' }, hint: 'view → booking' },
  ]);

  readonly impactFilters = signal<ImpactFilterGroup[]>([
    {
      id: 'audience',
      label: 'Audience',
      options: [
        { id: 'aud-b40', label: 'B40', count: 1284, color: '#22c55e' },
        { id: 'aud-women', label: 'Women', count: 3402, color: '#f472b6' },
        { id: 'aud-youth', label: 'Youth', count: 2890, color: '#3b82f6' },
        { id: 'aud-disabled', label: 'PWD', count: 412, color: '#a855f7' },
        { id: 'aud-rural', label: 'Rural', count: 980, color: '#f59e0b' },
      ],
    },
    {
      id: 'outcomes',
      label: 'Outcomes',
      options: [
        { id: 'out-jobs', label: 'Jobs created', count: 86, color: '#22c55e' },
        { id: 'out-income', label: 'Income uplift', count: 412, color: '#a855f7' },
        { id: 'out-cert', label: 'Certifications', count: 1840, color: '#3b82f6' },
      ],
    },
    {
      id: 'channels',
      label: 'Channels',
      options: [
        { id: 'ch-direct', label: 'Direct', count: 4120, color: '#111827' },
        { id: 'ch-partner', label: 'Partner', count: 1684, color: '#f59e0b' },
        { id: 'ch-paid', label: 'Paid', count: 832, color: '#ef4444' },
        { id: 'ch-organic', label: 'Organic', count: 6211, color: '#22c55e' },
      ],
    },
  ]);

  readonly trendByMonth = signal<SeriesPoint[]>([
    { label: 'Jan', value: 220 },
    { label: 'Feb', value: 268 },
    { label: 'Mar', value: 314 },
    { label: 'Apr', value: 402 },
    { label: 'May', value: 476 },
    { label: 'Jun', value: 512 },
    { label: 'Jul', value: 488 },
    { label: 'Aug', value: 564 },
    { label: 'Sep', value: 612 },
    { label: 'Oct', value: 698 },
    { label: 'Nov', value: 742 },
    { label: 'Dec', value: 820 },
  ]);

  readonly revenueByCategory = signal<SeriesPoint[]>([
    { label: 'Programmes', value: 1.42 },
    { label: 'Experiences', value: 0.86 },
    { label: 'Courses', value: 0.62 },
    { label: 'Expertise', value: 0.41 },
    { label: 'Gigs', value: 0.29 },
  ]);

  readonly rows = signal<Record<ServiceCategory, ServiceRow[]>>({
    programme: [
      row('p1', 'Climate Innovators Programme', 'Christ Wales', 'Programme', 'Hybrid', '27 Mar 2026', 'Taylor’s University, Subang', 240, 85, 4.8, 38400),
      row('p2', 'Youth Maker Bootcamp', 'Aisha Rahman', 'Bootcamp', 'Physical', '12 Apr 2026', 'Mereka Makerspace, KL', 180, 78, 3.8, 102400),
      row('p3', 'AI for Educators Cohort', 'Marcus Lee', 'Cohort', 'Online', '5 Jun 2026', 'Zoom Platform', 320, 92, 4.6, 64000),
      row('p4', 'Women in Tech Accelerator', 'Nina Wong', 'Programme', 'Hybrid', '10 Aug 2026', 'Connexion KL', 150, 88, 4.9, 30000),
    ],
    course: [
      row('c1', 'Foundations of UX Research', 'Christ Wales', 'Course', 'Online', '15 Feb 2026', 'Mereka LMS', 412, 71, 4.5, 24000),
      row('c2', 'Intro to Data Analytics', 'Aisha Rahman', 'Course', 'Online', '5 Mar 2026', 'Mereka LMS', 380, 64, 4.2, 21000),
      row('c3', 'Climate Literacy 101', 'Marcus Lee', 'Course', 'Online', '20 Mar 2026', 'Mereka LMS', 612, 88, 4.8, 36000),
    ],
    experience: [
      row('e1', 'Responsible AI Forum', 'Christ Wales', 'Talks', 'Hybrid', '27 Mar 2026', 'Taylor’s University, Subang', 382, 85, 4.8, 38400),
      row('e2', 'Machine Learning Summit', 'Christ Wales', 'Event', 'Physical', '12 Mar 2026', 'Connexion Conference Centre', 512, 78, 3.8, 102400),
      row('e3', 'Generative AI Workshop', 'Christ Wales', 'Workshop', 'Physical', '12 Mar 2026', 'Mereka Makerspace, KL', 123, 92, 4.8, 24400),
      row('e4', 'UX Design Bootcamp', 'Aisha Rahman', 'Online', 'Virtual', '22 Apr 2026', 'Zoom Platform', 50, 88, 4.6, 15600),
      row('e5', 'Front-end Development Seminar', 'Marcus Lee', 'Seminar', 'Hybrid', '5 Jun 2026', 'Tech Hub, SG', 200, 85, 4.9, 30000),
      row('e6', 'Data Science Conference', 'Nina Wong', 'Conference', 'Physical', '10 Aug 2026', 'Convention Center, KL', 350, 90, 4.7, 50000),
    ],
    expertise: [
      row('x1', 'Product Strategy Coaching', 'Christ Wales', 'Coaching', 'Online', '—', 'Anywhere', 24, 100, 4.9, 12000),
      row('x2', 'AI Advisory', 'Aisha Rahman', 'Advisory', 'Hybrid', '—', 'KL or Zoom', 18, 92, 4.8, 18000),
      row('x3', 'Brand Audit', 'Marcus Lee', 'Audit', 'Online', '—', 'Asynchronous', 12, 100, 4.7, 9600),
    ],
    gig: [
      row('g1', 'Landing Page Design', 'Christ Wales', 'Design', 'Online', '—', 'Async', 32, 88, 4.7, 16000),
      row('g2', 'Pitch Deck Review', 'Aisha Rahman', 'Consulting', 'Online', '—', 'Async', 41, 79, 4.5, 8200),
      row('g3', 'Mobile App Audit', 'Marcus Lee', 'Audit', 'Online', '—', 'Async', 22, 91, 4.8, 11000),
    ],
  });

  readonly correlationMatrix = signal<CorrelationCell[]>(
    cross(
      ['reach', 'revenue', 'rating', 'fill', 'jobs'],
      ['reach', 'revenue', 'rating', 'fill', 'jobs'],
    ),
  );

  readonly kpiBuilderFields = signal<KpiBuilderField[]>([
    { id: 'k-bookings', label: 'Total bookings', group: 'engagement' },
    { id: 'k-reach', label: 'Unique reach', group: 'audience' },
    { id: 'k-revenue', label: 'Revenue', group: 'monetisation' },
    { id: 'k-fill', label: 'Fill rate', group: 'engagement' },
    { id: 'k-rating', label: 'Avg rating', group: 'outcomes' },
    { id: 'k-cert', label: 'Certifications issued', group: 'outcomes' },
    { id: 'k-aov', label: 'Avg order value', group: 'monetisation' },
    { id: 'k-b40', label: 'B40 share', group: 'audience' },
    { id: 'k-jobs', label: 'Jobs facilitated', group: 'outcomes' },
  ]);

  readonly b40Summary = signal<B40ImpactSummary>({
    reachPct: 18.4,
    uniqueB40: 1284,
    programmesWithB40: 23,
    avgIncomeUplift: 412,
  });

  rowsFor(category: ServiceCategory): ServiceRow[] {
    return this.rows()[category];
  }

  detail(category: ServiceCategory, id: string): ServiceRow | undefined {
    return this.rows()[category].find((r) => r.id === id);
  }
}

function row(
  id: string, name: string, owner: string, type: string, mode: string,
  date: string, location: string, tickets: number, fillRate: number,
  rating: number, revenue: number,
): ServiceRow {
  return { id, name, owner, type, mode, date, location, tickets, fillRate, rating, revenue };
}

function cross(rowIds: string[], colIds: string[]): CorrelationCell[] {
  const out: CorrelationCell[] = [];
  for (const r of rowIds) {
    for (const c of colIds) {
      // deterministic pseudo-correlation for the mock
      const v = r === c ? 1 : Math.round((Math.sin(r.charCodeAt(0) + c.charCodeAt(0)) * 100)) / 100;
      out.push({ rowId: r, colId: c, value: Math.max(-1, Math.min(1, v)) });
    }
  }
  return out;
}
