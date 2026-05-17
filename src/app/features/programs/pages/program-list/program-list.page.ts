import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';

import { ProgramsService } from '../../services/programs.service';
import type { Program, ProgramFilters } from '../../models/program.model';
import { ProgramCardComponent } from '../../components/program-card/program-card.component';

@Component({
  selector: 'mereka-program-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProgramCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-list.page.html',
})
export class ProgramListPage {
  private readonly programs = inject(ProgramsService);
  private readonly route = inject(ActivatedRoute);

  /** Read `q` query param so navbar/homepage search can pre-fill the filter */
  private readonly queryQ = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('q') ?? '')),
    { initialValue: '' },
  );

  constructor() {
    // Sync query param → search signal whenever it changes
    effect(() => {
      const q = this.queryQ();
      if (q) this.search.set(q);
    });
  }

  readonly faqs = [
    {
      question: 'Do I need prior knowledge to join a programme?',
      answer: 'No prior knowledge is required for most programmes. Each programme page lists any prerequisites — if none are mentioned, the programme is designed for beginners.',
    },
    {
      question: 'How long will I have access to the materials?',
      answer: 'Once enrolled, you have lifetime access to the programme materials, including any future updates the hub adds to the curriculum.',
    },
    {
      question: 'Is the programme fully remote or in-person?',
      answer: 'It depends on the programme. Some are fully remote, some are in-person at Mereka spaces, and some are hybrid. Check the programme details page for the delivery format.',
    },
    {
      question: 'Can I learn at my own pace?',
      answer: 'Yes. Self-paced courses within a programme can be completed on your own schedule. Live experiences and expertise sessions will have set dates you can attend.',
    },
    {
      question: 'How long does each programme take?',
      answer: 'Programme duration varies — from 2-week sprints to 6-month journeys. The estimated duration is listed on each programme card and detail page.',
    },
    {
      question: 'What is the difference between a Programme and a Course?',
      answer: 'A Course is a single self-paced learning unit. A Programme bundles multiple courses, live experiences, and 1:1 expertise sessions into one guided journey with a clear start and finish.',
    },
  ];

  readonly search = signal('');
  readonly pricing = signal<'' | 'free' | 'paid'>('');

  private readonly filters = computed<ProgramFilters>(() => ({
    search: this.search() || undefined,
    pricing: this.pricing() || undefined,
  }));

  /**
   * The list service is mock-backed; using toSignal lets the template render reactively
   * once the network/mock latency resolves. We re-fetch whenever filters change by
   * piping through a derived observable below.
   */
  private readonly results$ = toSignal(this.programs.list({}), {
    initialValue: { items: [], total: 0, page: 1, pageSize: 0 },
  });

  // Re-filter client-side from the (currently single) page returned by the mock,
  // so the search/pricing controls feel instant. The real backend already supports
  // these as query params (see ProgramsService.list).
  trackById(_: number, p: Program): string {
    return p.id;
  }

  readonly filtered = computed<Program[]>(() => {
    const all = this.results$().items;
    const f = this.filters();
    return all.filter((p) => {
      if (f.pricing && p.pricing.kind !== f.pricing) return false;
      if (f.search) {
        const s = f.search.toLowerCase();
        if (
          !p.title.toLowerCase().includes(s) &&
          !p.tagline.toLowerCase().includes(s) &&
          !p.ownerHub.hubName.toLowerCase().includes(s)
        ) {
          return false;
        }
      }
      return true;
    });
  });
}
