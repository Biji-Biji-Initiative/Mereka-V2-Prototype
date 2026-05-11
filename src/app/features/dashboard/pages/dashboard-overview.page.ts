import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProgramsService } from '../../programs/services/programs.service';
import type { DashboardSnapshot } from '../../programs/models/program.model';

@Component({
  selector: 'mereka-dashboard-overview',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-overview.page.html',
})
export class DashboardOverviewPage {
  private readonly programs = inject(ProgramsService);
  readonly snapshot = toSignal<DashboardSnapshot | null>(this.programs.dashboard(), { initialValue: null });

  firstName(): string {
    return (this.snapshot()?.user?.name || 'there').split(/\s+/)[0];
  }
  humanStatus(s: string): string {
    return s.replace(/_/g, ' ');
  }
}
