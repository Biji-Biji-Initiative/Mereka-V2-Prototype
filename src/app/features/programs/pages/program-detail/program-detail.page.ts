import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith, switchMap } from 'rxjs';

import { ProgramsService } from '../../services/programs.service';
import type { Program } from '../../models/program.model';
import { ProgramSidebarComponent } from '../../components/program-sidebar/program-sidebar.component';
import { ProgramRosterComponent } from '../../components/program-roster/program-roster.component';

@Component({
  selector: 'mereka-program-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ProgramSidebarComponent,
    ProgramRosterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-detail.page.html',
})
export class ProgramDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly programs = inject(ProgramsService);

  readonly program = toSignal<Program | null>(
    this.route.paramMap.pipe(
      switchMap((params) => this.programs.bySlug(params.get('slug') ?? '')),
    ),
    { initialValue: null },
  );

  /** True when the active child route is 'landing' — hides sidebar layout. */
  readonly isLanding = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.router.url.endsWith('/landing')),
    ),
    { initialValue: this.router.url.endsWith('/landing') },
  );

  readonly hasProgram = computed(() => this.program() !== null);
}
