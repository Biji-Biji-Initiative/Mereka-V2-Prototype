import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ProgramsService } from '../../../services/programs.service';

@Component({
  selector: 'mereka-admin-forms-tab',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold">Manage Forms</h2>
        <p class="text-sm text-neutral-500">Interest, application, and post-program feedback forms.</p>
      </div>
      <button class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm">+ Create form</button>
    </header>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white border border-neutral-200 rounded-lg p-5">
        <div class="text-xs text-neutral-500">Total responses</div>
        <div class="text-2xl font-semibold mt-1">{{ totalResponses() | number }}</div>
      </div>
      <div class="bg-white border border-neutral-200 rounded-lg p-5">
        <div class="text-xs text-neutral-500">Live forms</div>
        <div class="text-2xl font-semibold mt-1">{{ liveCount() }}</div>
      </div>
      <div class="bg-white border border-neutral-200 rounded-lg p-5">
        <div class="text-xs text-neutral-500">Conversion (response → enrol)</div>
        <div class="text-2xl font-semibold mt-1">34%</div>
      </div>
    </div>
    <table class="w-full text-sm bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <thead class="text-xs text-neutral-500 bg-neutral-50">
        <tr>
          <th class="text-left font-normal px-4 py-3">Form</th>
          <th class="text-left font-normal px-4 py-3">Kind</th>
          <th class="text-left font-normal px-4 py-3">Status</th>
          <th class="text-right font-normal px-4 py-3">Responses</th>
          <th class="text-right font-normal px-4 py-3">Updated</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-100">
        <tr *ngFor="let f of forms()">
          <td class="px-4 py-3 font-medium">{{ f.title }}</td>
          <td class="px-4 py-3 capitalize">{{ f.kind }}</td>
          <td class="px-4 py-3">
            <span class="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full"
              [class.bg-success]="f.status === 'live'" [class.bg-neutral-200]="f.status !== 'live'"
              [class.text-white]="f.status === 'live'" [class.text-neutral-700]="f.status !== 'live'">
              {{ f.status }}
            </span>
          </td>
          <td class="px-4 py-3 text-right tabular-nums">{{ f.responseCount | number }}</td>
          <td class="px-4 py-3 text-right text-neutral-500">{{ f.updatedAt | date: 'MMM d' }}</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class ProgramAdminFormsTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);
  readonly forms = toSignal(this.route.parent!.paramMap.pipe(switchMap((p) => this.programs.forms(p.get('slug') ?? ''))), { initialValue: [] });
  readonly totalResponses = () => this.forms().reduce((s, f) => s + f.responseCount, 0);
  readonly liveCount = () => this.forms().filter((f) => f.status === 'live').length;
}
