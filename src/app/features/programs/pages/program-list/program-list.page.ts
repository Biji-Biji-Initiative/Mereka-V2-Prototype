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
    { q: 'Do I need prior knowledge to join a programme?', a: 'No. Mereka programmes are beginner-friendly by default. Each programme lists a "Recommended for" section on its detail page — if you fall outside that, our team will help you pick the right starting point.' },
    { q: 'How long will I have access to the materials?', a: 'You keep lifetime access to all course videos, slide decks, recordings of live sessions and your peer cohort channel even after the programme ends.' },
    { q: 'Is the programme fully remote or in-person?', a: 'Most programmes are hybrid — self-paced LMS content plus scheduled live sessions on Zoom. A handful (e.g. Climate Walks, Image Gen Crash Course) include optional in-person meetups at partner hubs.' },
    { q: 'Can I learn at my own pace?', a: "Yes. Self-paced lessons are released on day one and you can complete them on your own schedule. Live sessions and mentor 1:1s are timeboxed and shown on your dashboard calendar." },
    { q: 'How long does each programme take?', a: 'Programmes range from a 2-week sprint to a 16-week cohort. The exact duration is on each programme card and the detail page.' },
    { q: 'What is the difference between a Programme and a Course?', a: 'A Course is one self-paced unit. A Programme is a guided journey that bundles courses, live experiences and 1:1 expertise into a single outcome and certificate.' },
    { q: 'Can I get a scholarship or financial aid?', a: 'Selected programmes offer Mereka Scholar slots. Look for the "Scholar-eligible" badge on the programme card or apply via your dashboard after signing up.' },
    { q: 'Is this programme HRD Corp claimable?', a: 'Most cohort programmes are HRD Corp Claimable for Malaysian employers. The badge appears on the programme card, and our team can prep the documentation on request.' },
    { q: 'What happens after I complete a programme?', a: 'You receive a Mereka-verified certificate, join the programme alumni community, and unlock follow-on 1:1 expertise sessions with your mentors.' },
  ];
  readonly openFaq = signal<number>(-1);
  readonly allOpenSig = signal<boolean>(false);
  allOpen(): boolean { return this.allOpenSig(); }
  toggleFaq(i: number): void {
    if (this.allOpenSig()) this.allOpenSig.set(false);
    this.openFaq.update((o) => (o === i ? -1 : i));
  }
  loadAllFaqs(): void {
    // "Load All" toggles between expanding everything vs collapsing.
    this.allOpenSig.update((v) => !v);
    this.openFaq.set(this.allOpenSig() ? -2 : -1); // -2 sentinel ignored; template uses allOpenSig
  }
}
