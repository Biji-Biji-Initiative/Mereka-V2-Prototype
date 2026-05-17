import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Review {
  id: string;
  direction: 'given' | 'received';
  rating: number;
  title: string;
  body: string;
  date: string;
  programmeOrService: string;
  hub: string;
  authorName: string;
  authorInitial: string;
  type: 'course' | 'programme' | 'experience' | 'expertise';
  helpful?: number;
}

@Component({
  selector: 'mereka-dashboard-reviews',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reviews.page.html',
})
export class DashboardReviewsPage {
  readonly tabs = ['Reviews Given', 'Reviews Received'] as const;
  readonly activeTab = signal<string>('Reviews Given');

  readonly ratingFilters = ['All Ratings', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'] as const;
  readonly activeRating = signal<string>('All Ratings');

  setTab(tab: string): void { this.activeTab.set(tab); }
  setRating(r: string): void { this.activeRating.set(r); }

  readonly reviews = signal<Review[]>([
    {
      id: 'r1', direction: 'given', rating: 5,
      title: 'Transformative learning experience',
      body: 'The AI4U programme completely changed how I approach AI in my daily work. The hands-on projects were especially valuable, and the mentors were incredibly knowledgeable and supportive throughout the journey.',
      date: '10 May 2026', programmeOrService: 'AI4U Programme', hub: 'Biji-biji Initiative',
      authorName: 'You', authorInitial: 'Y', type: 'programme',
    },
    {
      id: 'r2', direction: 'given', rating: 4,
      title: 'Great introduction to AI concepts',
      body: 'Well-structured course with clear explanations. Could use more advanced practical exercises, but overall an excellent starting point for anyone new to AI.',
      date: '8 May 2026', programmeOrService: 'AI Fluency by Microsoft', hub: 'Biji-biji Initiative',
      authorName: 'You', authorInitial: 'Y', type: 'course',
    },
    {
      id: 'r3', direction: 'given', rating: 5,
      title: 'Fun and informative workshop',
      body: 'Never knew bike fitting was so technical! The instructor was passionate and the hands-on approach made it really engaging. Highly recommended for cycling enthusiasts.',
      date: '25 Apr 2026', programmeOrService: 'Bike Sizing and Fitting', hub: 'Biji-biji Initiative',
      authorName: 'You', authorInitial: 'Y', type: 'experience',
    },
    {
      id: 'r4', direction: 'given', rating: 3,
      title: 'Good content, pacing could improve',
      body: 'The course material is solid but some modules felt rushed while others dragged on. Would benefit from better pacing and more real-world case studies.',
      date: '15 Apr 2026', programmeOrService: 'Digital Marketing 101', hub: 'Biji-biji Initiative',
      authorName: 'You', authorInitial: 'Y', type: 'course',
    },
    {
      id: 'r5', direction: 'received', rating: 5,
      title: 'Excellent mentoring session',
      body: 'Faiz provided incredibly detailed and actionable feedback on my portfolio. His expertise in UX design really shone through. Would definitely book again!',
      date: '12 May 2026', programmeOrService: 'UI/UX Design Consultation', hub: 'Mereka',
      authorName: 'Sarah L.', authorInitial: 'S', type: 'expertise',
    },
    {
      id: 'r6', direction: 'received', rating: 4,
      title: 'Very helpful code review',
      body: 'Great session reviewing my Angular project. Provided practical suggestions for performance optimization and clean code practices. Very knowledgeable.',
      date: '5 May 2026', programmeOrService: 'Code Review Session', hub: 'Mereka',
      authorName: 'Ahmad R.', authorInitial: 'A', type: 'expertise',
    },
    {
      id: 'r7', direction: 'received', rating: 5,
      title: 'Best workshop facilitator',
      body: 'The portfolio sprint was so well organized. Every participant walked away with a completed case study. Faiz has a real talent for making complex topics accessible.',
      date: '28 Apr 2026', programmeOrService: 'Portfolio Sprint Workshop', hub: 'Mereka',
      authorName: 'Lisa T.', authorInitial: 'L', type: 'experience',
    },
    {
      id: 'r8', direction: 'received', rating: 3,
      title: 'Decent session but short',
      body: 'The consultation was informative but felt a bit rushed at the end. Would have appreciated more time for Q&A.',
      date: '20 Apr 2026', programmeOrService: 'Data Analytics Mentoring', hub: 'Biji-biji Initiative',
      authorName: 'James K.', authorInitial: 'J', type: 'expertise',
    },
  ]);

  readonly filteredReviews = computed(() => {
    const tab = this.activeTab();
    const rating = this.activeRating();
    const direction = tab === 'Reviews Given' ? 'given' : 'received';
    let filtered = this.reviews().filter(r => r.direction === direction);

    if (rating !== 'All Ratings') {
      const stars = parseInt(rating.charAt(0));
      filtered = filtered.filter(r => r.rating === stars);
    }
    return filtered;
  });

  readonly stats = computed(() => {
    const tab = this.activeTab();
    const direction = tab === 'Reviews Given' ? 'given' : 'received';
    const reviews = this.reviews().filter(r => r.direction === direction);
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';
    return {
      total: reviews.length,
      avgRating,
      fiveStar: reviews.filter(r => r.rating === 5).length,
      fourStar: reviews.filter(r => r.rating === 4).length,
      threeStar: reviews.filter(r => r.rating === 3).length,
    };
  });

  renderStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 'filled' : 'empty');
    }
    return stars;
  }

  readonly typeConfig: Record<string, { label: string; bg: string; color: string }> = {
    course:     { label: 'Course',     bg: '#DBEAFE', color: '#276EF1' },
    programme:  { label: 'Programme',  bg: '#D4E8D4', color: '#16A34A' },
    experience: { label: 'Experience', bg: '#FEF3C7', color: '#D97706' },
    expertise:  { label: 'Expertise',  bg: '#F3E8FF', color: '#7C3AED' },
  };
}
