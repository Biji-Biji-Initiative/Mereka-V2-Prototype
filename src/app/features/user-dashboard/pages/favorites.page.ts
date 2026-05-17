import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';


type FavoriteType = 'course' | 'programme' | 'experience' | 'expertise';

interface FavoriteItem {
  id: string;
  type: FavoriteType;
  title: string;
  hub: string;
  price: string;
  rating: number;
  reviewCount: number;
  image: string;
  savedDate: string;
  description: string;
}

function svgPlaceholder(w: number, h: number, opts: { rounded?: number; bg?: string; label?: string } = {}): string {
  const bg = opts.bg ?? '#E5E5E7';
  const label = opts.label ?? `${w}x${h}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${opts.rounded ?? 0}" fill="${bg}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="12" fill="#9CA0A6">${label}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const TYPE_CONFIG: Record<FavoriteType, { label: string; bg: string; color: string }> = {
  course:     { label: 'Course',     bg: '#DBEAFE', color: '#276EF1' },
  programme:  { label: 'Programme',  bg: '#D4E8D4', color: '#16A34A' },
  experience: { label: 'Experience', bg: '#FEF3C7', color: '#D97706' },
  expertise:  { label: 'Expertise',  bg: '#F3E8FF', color: '#7C3AED' },
};

@Component({
  selector: 'mereka-dashboard-favorites',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './favorites.page.html',
})
export class DashboardFavoritesPage {
  readonly filters = ['All', 'Courses', 'Programmes', 'Experiences', 'Expertise'] as const;
  readonly activeFilter = signal<string>('All');
  readonly typeConfig = TYPE_CONFIG;

  setFilter(f: string): void { this.activeFilter.set(f); }

  readonly favorites = signal<FavoriteItem[]>([
    {
      id: 'f1', type: 'programme', title: 'AI4U Programme', hub: 'Biji-biji Initiative',
      price: 'RM 490 / programme', rating: 4.8, reviewCount: 124,
      image: svgPlaceholder(280, 160, { rounded: 8, bg: '#D4CCE6', label: 'AI4U' }),
      savedDate: '10 May 2026',
      description: 'Comprehensive AI upskilling programme covering fundamentals to advanced applications.',
    },
    {
      id: 'f2', type: 'course', title: 'AI Fluency by Microsoft', hub: 'Biji-biji Initiative',
      price: 'FREE', rating: 4.6, reviewCount: 89,
      image: svgPlaceholder(280, 160, { rounded: 8, bg: '#C6E0F5', label: 'AI Fluency' }),
      savedDate: '8 May 2026',
      description: 'Learn AI fundamentals powered by Microsoft, designed for non-technical professionals.',
    },
    {
      id: 'f3', type: 'experience', title: 'Bike Sizing and Bike Fitting', hub: 'Biji-biji Initiative',
      price: 'RM 150 / ticket', rating: 4.9, reviewCount: 47,
      image: svgPlaceholder(280, 160, { rounded: 8, bg: '#F5E6C6', label: 'Bike Fit' }),
      savedDate: '5 May 2026',
      description: 'Hands-on workshop to find your perfect bike fit with professional guidance.',
    },
    {
      id: 'f4', type: 'expertise', title: 'UI/UX Design Consultation', hub: 'Mereka',
      price: 'RM 200 / hour', rating: 4.7, reviewCount: 32,
      image: svgPlaceholder(280, 160, { rounded: 8, bg: '#E6D4F5', label: 'UX Design' }),
      savedDate: '1 May 2026',
      description: 'One-on-one consultation with experienced UI/UX designers for your project.',
    },
    {
      id: 'f5', type: 'programme', title: 'Career Accelerator', hub: 'Mereka',
      price: 'RM 749 / programme', rating: 4.5, reviewCount: 67,
      image: svgPlaceholder(280, 160, { rounded: 8, bg: '#D4E8D4', label: 'Career' }),
      savedDate: '28 Apr 2026',
      description: 'Fast-track your career with mentorship, portfolio building, and job placement support.',
    },
    {
      id: 'f6', type: 'course', title: 'Digital Marketing 101', hub: 'Biji-biji Initiative',
      price: 'RM 199', rating: 4.3, reviewCount: 56,
      image: svgPlaceholder(280, 160, { rounded: 8, bg: '#C6F5E0', label: 'Marketing' }),
      savedDate: '20 Apr 2026',
      description: 'Master the basics of digital marketing including SEO, social media, and content strategy.',
    },
    {
      id: 'f7', type: 'experience', title: 'Portfolio Sprint Workshop', hub: 'Mereka',
      price: 'RM 120 / ticket', rating: 4.8, reviewCount: 28,
      image: svgPlaceholder(280, 160, { rounded: 8, bg: '#F5D4C6', label: 'Portfolio' }),
      savedDate: '15 Apr 2026',
      description: 'Build your first professional case study in a guided 3-hour sprint session.',
    },
    {
      id: 'f8', type: 'expertise', title: 'Data Analytics Mentoring', hub: 'Biji-biji Initiative',
      price: 'RM 180 / hour', rating: 4.6, reviewCount: 19,
      image: svgPlaceholder(280, 160, { rounded: 8, bg: '#DBEAFE', label: 'Data' }),
      savedDate: '10 Apr 2026',
      description: 'Personalized mentoring sessions on data analysis, visualization, and storytelling.',
    },
  ]);

  readonly filteredFavorites = computed(() => {
    const f = this.activeFilter();
    const all = this.favorites();
    if (f === 'All') return all;
    const typeMap: Record<string, FavoriteType> = {
      'Courses': 'course', 'Programmes': 'programme',
      'Experiences': 'experience', 'Expertise': 'expertise',
    };
    return all.filter(item => item.type === typeMap[f]);
  });

  readonly stats = computed(() => {
    const all = this.favorites();
    return {
      total: all.length,
      courses: all.filter(i => i.type === 'course').length,
      programmes: all.filter(i => i.type === 'programme').length,
      experiences: all.filter(i => i.type === 'experience').length,
      expertise: all.filter(i => i.type === 'expertise').length,
    };
  });

  removeFavorite(id: string): void {
    this.favorites.update(list => list.filter(f => f.id !== id));
  }

  renderStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= Math.round(rating) ? 'filled' : 'empty');
    }
    return stars;
  }
}
