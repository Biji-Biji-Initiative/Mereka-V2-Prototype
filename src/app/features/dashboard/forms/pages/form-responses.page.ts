import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
interface Response {
  id: string;
  submittedAt: string;
  name: string;
  email: string;
  status: 'New' | 'Reviewed' | 'Accepted' | 'Rejected';
}

@Component({
  selector: 'mereka-form-responses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-responses.page.html',
})
export class FormResponsesPage {
  private readonly route = inject(ActivatedRoute);
  readonly id = toSignal(this.route.paramMap.pipe(), { initialValue: null });

  readonly responses: Response[] = [
    { id: 'r1', submittedAt: '2026-05-12 09:14', name: 'Aisyah Tan',     email: 'aisyah@biji-biji.com',  status: 'New' },
    { id: 'r2', submittedAt: '2026-05-11 22:08', name: 'Daniel Cheng',    email: 'd.cheng@example.io',     status: 'Reviewed' },
    { id: 'r3', submittedAt: '2026-05-11 18:33', name: 'Priya Subramanian', email: 'priya@upskill.io',     status: 'Accepted' },
    { id: 'r4', submittedAt: '2026-05-11 14:20', name: 'Marcus Lim',      email: 'marcus@example.io',      status: 'New' },
    { id: 'r5', submittedAt: '2026-05-10 09:55', name: 'Hira Khan',       email: 'hira@mereka.io',         status: 'Rejected' },
  ];

  readonly filter = signal<'All' | 'New' | 'Reviewed' | 'Accepted' | 'Rejected'>('All');
  setFilter(s: 'All' | 'New' | 'Reviewed' | 'Accepted' | 'Rejected'): void { this.filter.set(s); }
  visible(): Response[] {
    return this.filter() === 'All' ? this.responses : this.responses.filter((r) => r.status === this.filter());
  }
}
