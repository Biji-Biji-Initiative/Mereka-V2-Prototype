import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, of } from 'rxjs';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';

interface HubProgramme {
  id: string;
  slug: string;
  title: string;
  description: string;
  badgeColor: string;
  duration: string;
  format: string;
  location: string;
  audience: string[];
  certificates: number;
}

interface ExploreProgramme {
  slug: string;
  city: string;
  rating: number;
  title: string;
  blurb: string;
  price: string;
  image: string;
  featured?: boolean;
}

type Tab = 'profile' | 'programmes' | 'portfolio' | 'gallery';

@Component({
  selector: 'mereka-hub-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hub-detail.page.html',
})
export class HubDetailPage {
  private readonly api = inject(MarketplaceService);
  private readonly route = inject(ActivatedRoute);

  readonly hub = toSignal(
    this.route.paramMap.pipe(switchMap((p) => this.api.hubBySlug(p.get('slug') ?? ''))),
    { initialValue: null },
  );

  readonly tab = signal<Tab>('programmes');
  readonly tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'programmes', label: 'Programmes' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'gallery', label: 'Gallery' },
  ];

  // Programmes this hub offers — driven by the visible Figma row pattern
  readonly programmes: HubProgramme[] = [
    {
      id: 'ai4u', slug: 'ai4u', title: 'AI4U Programme',
      description: 'AI4U is a FREE program dedicated to equipping 10,000 Malaysians and Indonesians with practical, real-world AI skills to boost employability, entrepreneurship, and digital resilience.',
      badgeColor: '#0ea5e9',
      duration: '12 weeks', format: 'Hybrid',
      location: 'Lot 1C, Level G1 (A4 Entrance) Publika Shopping Gallery, KL',
      audience: ['Undergraduates', 'Early Career'],
      certificates: 4,
    },
    {
      id: 'ai-for-my-future', slug: 'ai-for-my-future', title: 'AI for My Future',
      description: 'AI4U is a FREE program dedicated to equipping 10,000 Malaysians and Indonesians with practical, real-world AI skills to boost employability, entrepreneurship, and digital resilience.',
      badgeColor: '#0ea5e9',
      duration: '12 weeks', format: 'Hybrid',
      location: 'Lot 1C, Level G1 (A4 Entrance) Publika Shopping Gallery, KL',
      audience: ['Undergraduates', 'Early Career'],
      certificates: 4,
    },
  ];

  readonly explore: ExploreProgramme[] = [
    {
      slug: 'ai4u', city: 'Kuala Lumpur, Malaysia', rating: 4.3,
      title: 'AI4U Programme',
      blurb: 'Leverage generative AI to develop marketing strategies, attract clients, publish content and convert leads',
      price: 'RM49.90 / month',
      image: 'img/programs/card-ai4u.jpg',
      featured: true,
    },
    {
      slug: 'dynamous-ai-mastery', city: 'Kuala Lumpur, Malaysia', rating: 4.3,
      title: 'Dynamous AI Mastery',
      blurb: 'Use AI to increase accuracy of financial projections. Automate data analysis, reporting and financial tracking',
      price: 'RM749.90 / year',
      image: 'img/programs/card-product.jpg',
    },
    {
      slug: 'ai-fluency-for-beginners', city: 'Kuala Lumpur, Malaysia', rating: 4.3,
      title: 'AI Fluency for Beginners',
      blurb: 'Learn to embed AI in project management workflows. Convert support tickets into tasks and generate weekly reports with AI.',
      price: 'FREE',
      image: 'img/programs/card-copilot.jpg',
    },
  ];
}
