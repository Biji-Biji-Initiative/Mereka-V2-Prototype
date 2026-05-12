import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith, switchMap } from 'rxjs';
import { ProgramsService } from '../../services/programs.service';
import type { Program } from '../../models/program.model';
import { ProgramSidebarComponent } from '../../components/program-sidebar/program-sidebar.component';
import { ProgramLeftRailComponent } from '../../components/program-leftrail/program-leftrail.component';

@Component({
  selector: 'mereka-program-detail',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ProgramSidebarComponent, ProgramLeftRailComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-detail.page.html',
})
export class ProgramDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly programs = inject(ProgramsService);

  readonly program = toSignal<Program | null>(
    this.route.paramMap.pipe(switchMap((params) => this.programs.bySlug(params.get('slug') ?? ''))),
    { initialValue: null },
  );

  readonly isAdmin = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects.includes('/admin')),
      startWith(this.router.url.includes('/admin')),
    ),
    { initialValue: this.router.url.includes('/admin') },
  );

  readonly hasProgram = computed(() => this.program() !== null);
}
