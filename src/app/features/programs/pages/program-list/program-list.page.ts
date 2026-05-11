import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ProgramCard {
  slug: string;
  title: string;
  hub: string;
  tags: string[];
  image: string;
  category: string;
  popular?: boolean;
}

interface FaqItem { q: string; a: string; }

/**
 * Programs listing page — Figma node 8351-3960 ("Learn Together. Grow Together.")
 * Sections: hero with category pills, Popular Programs row, All Programs 4-col grid,
 * Common Questions accordion, "Not sure where to begin?" dark CTA banner.
 */
@Component({
  selector: 'mereka-program-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-list.page.html',
})
export class ProgramListPage {
  readonly categories = ['All', 'Marketing', 'Design', 'Technology', 'Business', 'Mentorship', 'Climate'];
  readonly activeCategory = signal<string>('All');

  readonly sortOptions = ['Most recent', 'Most popular', 'A → Z'] as const;
  readonly sort = signal<(typeof this.sortOptions)[number]>('Most recent');

  readonly programs: ProgramCard[] = [
    { slug: 'ai4u', title: 'AI4U — Practical AI for Everyone', hub: 'AI4U Collective', tags: ['AI', 'Generative AI', 'Cohort'], image: 'img/programs/card-ai4u.jpg', category: 'Technology', popular: true },
    { slug: 'boost-productivity-with-copilot', title: 'Boost Productivity with Microsoft Copilot', hub: 'Microsoft Malaysia', tags: ['Copilot', 'Productivity'], image: 'img/programs/card-copilot.jpg', category: 'Business', popular: true },
    { slug: 'internet-search-and-beyond', title: 'Internet Search & Beyond', hub: 'Bijibiji Initiative', tags: ['Research', 'Free'], image: 'img/programs/card-search.jpg', category: 'Technology', popular: true },
    { slug: 'design-thinking-bootcamp', title: 'Design Thinking Bootcamp', hub: 'AI4U Collective', tags: ['Design', 'Leadership'], image: 'img/programs/card-design.jpg', category: 'Design', popular: true },
    { slug: 'climate-resilience-2026', title: 'Climate Resilience Practitioner Programme', hub: 'Green School KL', tags: ['Climate', 'Public Sector'], image: 'img/programs/card-climate.jpg', category: 'Climate' },
    { slug: 'pm-fundamentals', title: 'AI Product Management Fundamentals', hub: 'Bijibiji Initiative', tags: ['Product', 'AI'], image: 'img/programs/card-product.jpg', category: 'Business' },
    { slug: 'ux-research-clinic', title: 'UX Research Clinic — 6-week cohort', hub: 'AI4U Collective', tags: ['UX', 'Research'], image: 'img/programs/card-design.jpg', category: 'Design' },
    { slug: 'sales-with-copilot', title: 'Sales Effectiveness with Copilot', hub: 'Microsoft Malaysia', tags: ['Sales', 'Copilot'], image: 'img/programs/card-copilot.jpg', category: 'Business' },
    { slug: 'youth-mentorship-circle', title: 'Youth Mentorship Circle', hub: 'Green School KL', tags: ['Mentorship', 'Youth'], image: 'img/programs/card-climate.jpg', category: 'Mentorship' },
    { slug: 'prompt-engineering-deep-dive', title: 'Prompt Engineering Deep Dive', hub: 'AI4U Collective', tags: ['Prompt', 'AI'], image: 'img/programs/card-ai4u.jpg', category: 'Technology' },
    { slug: 'b2b-marketing-sprint', title: 'B2B Marketing Sprint', hub: 'Bijibiji Initiative', tags: ['Marketing', 'B2B'], image: 'img/programs/card-product.jpg', category: 'Marketing' },
    { slug: 'visual-design-workshop', title: 'Visual Design Workshop Series', hub: 'AI4U Collective', tags: ['Design', 'Workshop'], image: 'img/programs/card-design.jpg', category: 'Design' },
  ];

  readonly popular = computed(() => this.programs.filter((p) => p.popular).slice(0, 4));

  readonly filtered = computed(() => {
    const c = this.activeCategory();
    let list = c === 'All' ? [...this.programs] : this.programs.filter((p) => p.category === c);
    const s = this.sort();
    if (s === 'A → Z') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  });

  readonly faqs: FaqItem[] = [
    { q: 'How long does each program take?', a: 'Programs range from 2-week sprints to 16-week cohorts. The duration is shown on each program card and the detail page.' },
    { q: 'What is the difference between a Program and a Course?', a: 'A Course is one self-paced unit. A Program is a guided journey that bundles courses, live experiences, and 1:1 expertise into a single outcome.' },
    { q: 'Can I get a scholarship or financial aid?', a: 'Selected programs offer Mereka Scholar slots. Look for the “Scholar-eligible” badge on the program card or apply via your dashboard once enrolled.' },
    { q: 'How are programs delivered — online or in person?', a: 'Most programs are hybrid: self-paced LMS content + scheduled live sessions on Zoom + optional in-person meetups at participating hubs.' },
    { q: 'What happens after I complete a program?', a: 'You receive a Mereka-verified certificate, join the program’s alumni community, and unlock follow-on 1:1 expertise sessions with your mentors.' },
  ];
  readonly openFaq = signal<number>(-1);
  toggleFaq(i: number): void { this.openFaq.update((o) => (o === i ? -1 : i)); }
}
