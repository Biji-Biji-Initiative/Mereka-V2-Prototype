import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

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
