import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

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
  private readonly programs = inject(ProgramsService);

  readonly program = toSignal<Program | null>(
    this.route.paramMap.pipe(
      switchMap((params) => this.programs.bySlug(params.get('slug') ?? '')),
    ),
    { initialValue: null },
  );

  /**
   * Provided to child tabs via context. We use a computed signal so the tabs can
   * subscribe without re-running the network call.
   */
  readonly hasProgram = computed(() => this.program() !== null);
}
