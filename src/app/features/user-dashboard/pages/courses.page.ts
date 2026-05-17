import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HubFilterService } from '../../../core/services/hub-filter.service';

interface CourseItem {
  slug: string;
  logo: string;
  name: string;
  hub: string;
  programme?: string;
  dueDate: string;
  progress: number;
  status: 'in_progress' | 'completed' | 'not_started';
  ctaLabel: string;
  ctaUrl: string;
  modules: number;
  completedModules: number;
  enrolledStudents?: number;
}

function svgPlaceholder(w: number, h: number, opts: { rounded?: number; bg?: string } = {}): string {
  const bg = opts.bg ?? '#E5E5E7';
  const r = opts.rounded ?? 0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" fill="${bg}"/></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

@Component({
  selector: 'mereka-dashboard-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './courses.page.html',
})
export class DashboardCoursesPage {
  private readonly hubFilter = inject(HubFilterService);
  readonly LMS_BASE = 'https://lms-prototype.mereka.dev';

  readonly views = ['Candidate', 'Hub Admin'] as const;
  readonly activeView = signal<string>('Candidate');

  readonly filters = ['All', 'In Progress', 'Completed', 'Not Started'] as const;
  readonly activeFilter = signal<string>('All');

  setView(v: string): void {
    this.activeView.set(v);
    this.activeFilter.set('All');
  }
  setFilter(f: string): void { this.activeFilter.set(f); }

  // Candidate view: enrolled courses
  readonly enrolledCourses: CourseItem[] = [
    {
      slug: 'ai-fundamentals',
      logo: svgPlaceholder(40, 40, { rounded: 8, bg: '#D4CCE6' }),
      name: 'AI Fundamentals',
      hub: 'Biji-biji Initiative',
      programme: 'AI4U Programme',
      dueDate: '12 Jan 2026',
      progress: 80,
      status: 'in_progress',
      ctaLabel: 'Continue Learning',
      ctaUrl: `${this.LMS_BASE}/course/ai-fundamentals`,
      modules: 12,
      completedModules: 10,
    },
    {
      slug: 'prompt-engineering',
      logo: svgPlaceholder(40, 40, { rounded: 8, bg: '#C6E0F5' }),
      name: 'Prompt Engineering',
      hub: 'Biji-biji Initiative',
      programme: 'AI4U Programme',
      dueDate: '28 Feb 2026',
      progress: 45,
      status: 'in_progress',
      ctaLabel: 'Continue Learning',
      ctaUrl: `${this.LMS_BASE}/course/prompt-engineering`,
      modules: 8,
      completedModules: 4,
    },
    {
      slug: 'strategy',
      logo: svgPlaceholder(40, 40, { rounded: 8, bg: '#D4E8D4' }),
      name: 'Career Strategy & Planning',
      hub: 'Mereka',
      programme: 'Career Accelerator',
      dueDate: '15 Mar 2026',
      progress: 100,
      status: 'completed',
      ctaLabel: 'View Certificate',
      ctaUrl: `${this.LMS_BASE}/certificate`,
      modules: 6,
      completedModules: 6,
    },
    {
      slug: 'digital-marketing-101',
      logo: svgPlaceholder(40, 40, { rounded: 8, bg: '#F5E6C6' }),
      name: 'Digital Marketing 101',
      hub: 'Biji-biji Initiative',
      programme: 'Digital Skills Accelerator',
      dueDate: '30 Apr 2026',
      progress: 0,
      status: 'not_started',
      ctaLabel: 'Start Course',
      ctaUrl: `${this.LMS_BASE}/course/digital-marketing-101`,
      modules: 10,
      completedModules: 0,
    },
    {
      slug: 'internet-search',
      logo: svgPlaceholder(40, 40, { rounded: 8, bg: '#E6D4F5' }),
      name: 'Internet Search & Beyond',
      hub: 'Mereka',
      dueDate: '20 May 2026',
      progress: 100,
      status: 'completed',
      ctaLabel: 'View Certificate',
      ctaUrl: `${this.LMS_BASE}/certificate`,
      modules: 5,
      completedModules: 5,
    },
    {
      slug: 'ai-fluency',
      logo: svgPlaceholder(40, 40, { rounded: 8, bg: '#C6F5E0' }),
      name: 'AI Fluency by Microsoft',
      hub: 'Biji-biji Initiative',
      programme: 'AI4U Programme',
      dueDate: '10 Jun 2026',
      progress: 20,
      status: 'in_progress',
      ctaLabel: 'Continue Learning',
      ctaUrl: `${this.LMS_BASE}/course/ai-fluency`,
      modules: 6,
      completedModules: 1,
    },
  ];

  // Hub Admin view: all courses created by Hub
  readonly hubCourses: CourseItem[] = [
    {
      slug: 'ai-fundamentals',
      logo: svgPlaceholder(40, 40, { rounded: 8, bg: '#D4CCE6' }),
      name: 'AI Fundamentals',
      hub: 'Biji-biji Initiative',
      programme: 'AI4U Programme',
      dueDate: '—',
      progress: 0,
      status: 'in_progress',
      ctaLabel: 'Manage',
      ctaUrl: `${this.LMS_BASE}/studio`,
      modules: 12,
      completedModules: 0,
      enrolledStudents: 148,
    },
    {
      slug: 'prompt-engineering',
      logo: svgPlaceholder(40, 40, { rounded: 8, bg: '#C6E0F5' }),
      name: 'Prompt Engineering',
      hub: 'Biji-biji Initiative',
      programme: 'AI4U Programme',
      dueDate: '—',
      progress: 0,
      status: 'in_progress',
      ctaLabel: 'Manage',
      ctaUrl: `${this.LMS_BASE}/studio`,
      modules: 8,
      completedModules: 0,
      enrolledStudents: 92,
    },
    {
      slug: 'ai-fluency',
      logo: svgPlaceholder(40, 40, { rounded: 8, bg: '#C6F5E0' }),
      name: 'AI Fluency by Microsoft',
      hub: 'Biji-biji Initiative',
      programme: 'AI4U Programme',
      dueDate: '—',
      progress: 0,
      status: 'not_started',
      ctaLabel: 'Manage',
      ctaUrl: `${this.LMS_BASE}/studio`,
      modules: 6,
      completedModules: 0,
      enrolledStudents: 64,
    },
    {
      slug: 'digital-marketing-101',
      logo: svgPlaceholder(40, 40, { rounded: 8, bg: '#F5E6C6' }),
      name: 'Digital Marketing 101',
      hub: 'Biji-biji Initiative',
      programme: 'Digital Skills Accelerator',
      dueDate: '—',
      progress: 0,
      status: 'not_started',
      ctaLabel: 'Manage',
      ctaUrl: `${this.LMS_BASE}/studio`,
      modules: 10,
      completedModules: 0,
      enrolledStudents: 37,
    },
    {
      slug: 'bike-sizing',
      logo: svgPlaceholder(40, 40, { rounded: 8, bg: '#F5D4C6' }),
      name: 'Bike Sizing and Fitting',
      hub: 'Biji-biji Initiative',
      dueDate: '—',
      progress: 0,
      status: 'completed',
      ctaLabel: 'Manage',
      ctaUrl: `${this.LMS_BASE}/studio`,
      modules: 4,
      completedModules: 0,
      enrolledStudents: 210,
    },
    {
      slug: 'sustainability-101',
      logo: svgPlaceholder(40, 40, { rounded: 8, bg: '#D4E8D4' }),
      name: 'Sustainability 101',
      hub: 'Biji-biji Initiative',
      programme: 'Green Skills Programme',
      dueDate: '—',
      progress: 0,
      status: 'in_progress',
      ctaLabel: 'Manage',
      ctaUrl: `${this.LMS_BASE}/studio`,
      modules: 7,
      completedModules: 0,
      enrolledStudents: 55,
    },
  ];

  readonly filteredCourses = computed(() => {
    const view = this.activeView();
    const f = this.activeFilter();
    const hubId = this.hubFilter.activeHub();
    let source = view === 'Candidate' ? this.enrolledCourses : this.hubCourses;

    // Apply hub filter
    if (hubId !== 'all') {
      const hubNameMap: Record<string, string> = {
        'mereka': 'Mereka',
        'biji-biji': 'Biji-biji Initiative',
        'microsoft-my': 'Microsoft Malaysia',
        'mdec': 'MDEC',
      };
      const hubName = hubNameMap[hubId] ?? hubId;
      source = source.filter(c => c.hub === hubName);
    }

    // Apply status filter
    if (f === 'All') return source;
    if (f === 'In Progress') return source.filter(c => c.status === 'in_progress');
    if (f === 'Completed') return source.filter(c => c.status === 'completed');
    if (f === 'Not Started') return source.filter(c => c.status === 'not_started');
    return source;
  });

  readonly stats = computed(() => {
    const source = this.activeView() === 'Candidate' ? this.enrolledCourses : this.hubCourses;
    return {
      total: source.length,
      inProgress: source.filter(c => c.status === 'in_progress').length,
      completed: source.filter(c => c.status === 'completed').length,
      notStarted: source.filter(c => c.status === 'not_started').length,
    };
  });

  readonly hubStats = computed(() => {
    return {
      totalStudents: this.hubCourses.reduce((sum, c) => sum + (c.enrolledStudents ?? 0), 0),
      totalCourses: this.hubCourses.length,
    };
  });
}
