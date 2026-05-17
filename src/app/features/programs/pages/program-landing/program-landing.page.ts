import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { ProgramsService } from '../../services/programs.service';
import type { HubRef, Program } from '../../models/program.model';

@Component({
  selector: 'mereka-program-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-landing.page.html',
})
export class ProgramLandingPage {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);

  readonly program = toSignal<Program | null>(
    this.route.parent!.paramMap.pipe(
      switchMap((params) => this.programs.bySlug(params.get('slug') ?? '')),
    ),
    { initialValue: null },
  );

  readonly landing = computed(() => this.program()?.landing ?? null);

  readonly courseCount = computed(() =>
    this.program()?.curriculum.filter((c) => c.type === 'course').length ?? 0,
  );
  readonly experienceCount = computed(() =>
    this.program()?.curriculum.filter((c) => c.type === 'experience').length ?? 0,
  );
  readonly expertiseCount = computed(() =>
    this.program()?.curriculum.filter((c) => c.type === 'expertise').length ?? 0,
  );

  readonly hubs = computed(() => {
    const p = this.program();
    if (!p) return [] as { hub: HubRef; role: string }[];
    const all: { hub: HubRef; role: string }[] = [
      { hub: p.ownerHub, role: 'owner' },
    ];
    for (const c of p.collaborators) {
      all.push({ hub: c.hub, role: c.role });
    }
    return all;
  });
}
