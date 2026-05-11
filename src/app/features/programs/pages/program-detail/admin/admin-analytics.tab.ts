import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ProgramsService } from '../../../services/programs.service';

@Component({
  selector: 'mereka-admin-analytics-tab',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex items-baseline justify-between mb-6 flex-wrap gap-3">
      <div>
        <h2 class="text-2xl font-semibold">Programme Analytics</h2>
        <p class="text-sm text-neutral-500">Performance, retention, and composition for {{ program()?.title }}.</p>
      </div>
      <div class="flex items-center gap-2">
        <select class="px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-sm">
          <option>All programmes</option>
          <option>{{ program()?.title }}</option>
        </select>
        <button class="px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-sm">Cohorts ▾</button>
        <button class="px-3 py-1.5 rounded-full bg-neutral-900 text-white text-sm">Export</button>
      </div>
    </header>
    <ng-container *ngIf="analytics() as a">
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <article class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">Active learners</div>
          <div class="text-2xl font-semibold mt-1">{{ a.overview.activeLearners | number }}</div>
          <div class="text-xs mt-1 text-success">▲ {{ a.overview.activeLearnersDelta }}%</div>
        </article>
        <article class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">Retention rate</div>
          <div class="text-2xl font-semibold mt-1">{{ a.overview.retentionRate }}%</div>
          <div class="text-xs mt-1 text-success">▲ {{ a.overview.retentionRateDelta }}pp</div>
        </article>
        <article class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">Completion rate</div>
          <div class="text-2xl font-semibold mt-1">{{ a.overview.completionRate }}%</div>
          <div class="text-xs mt-1 text-error">▼ 2pp</div>
        </article>
        <article class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">Certificates issued</div>
          <div class="text-2xl font-semibold mt-1">{{ a.overview.certificatesIssued }}</div>
          <div class="text-xs mt-1 text-neutral-500">NPS · {{ a.overview.npsScore }}</div>
        </article>
      </section>
      <section class="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
        <h3 class="font-semibold mb-1">Combined composition snapshot</h3>
        <p class="text-sm text-neutral-500 mb-4">Across {{ a.composition.programmes }} programmes — pooled inventory.</p>
        <div class="grid grid-cols-4 gap-4">
          <div class="text-center bg-neutral-50 rounded-md p-4"><div class="text-3xl font-semibold">{{ a.composition.programmes }}</div><div class="text-xs text-neutral-500 mt-1">Programmes</div></div>
          <div class="text-center bg-neutral-50 rounded-md p-4"><div class="text-3xl font-semibold">{{ a.composition.courses }}</div><div class="text-xs text-neutral-500 mt-1">Courses</div></div>
          <div class="text-center bg-neutral-50 rounded-md p-4"><div class="text-3xl font-semibold">{{ a.composition.experiences }}</div><div class="text-xs text-neutral-500 mt-1">Experiences</div></div>
          <div class="text-center bg-neutral-50 rounded-md p-4"><div class="text-3xl font-semibold">{{ a.composition.expertise }}</div><div class="text-xs text-neutral-500 mt-1">Expertise</div></div>
        </div>
      </section>
      <section class="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
        <h3 class="font-semibold mb-4">Enrolment funnel</h3>
        <ul class="space-y-3">
          <li *ngFor="let stage of a.funnel" class="grid grid-cols-[120px_1fr_80px_80px] items-center gap-3 text-sm">
            <span class="text-neutral-500">{{ stage.stage }}</span>
            <div class="h-2 rounded-full bg-neutral-100 overflow-hidden"><div class="h-full bg-success" [style.width.%]="stage.percent"></div></div>
            <span class="text-right tabular-nums">{{ stage.count | number }}</span>
            <span class="text-right text-xs text-neutral-500">{{ stage.percent }}%</span>
          </li>
        </ul>
      </section>
      <section class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 class="font-semibold mb-4">Geographic distribution</h3>
          <ul class="space-y-2">
            <li *ngFor="let g of a.geographic" class="grid grid-cols-[60px_1fr_60px] items-center gap-3 text-sm">
              <span class="text-neutral-500">{{ g.code }}</span>
              <div class="h-1.5 bg-neutral-100 rounded-full overflow-hidden"><div class="h-full bg-info" [style.width.%]="g.percent"></div></div>
              <span class="text-right tabular-nums">{{ g.count | number }}</span>
            </li>
          </ul>
        </div>
        <div class="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 class="font-semibold mb-4">Monthly completion trend</h3>
          <ul class="space-y-2">
            <li *ngFor="let m of a.monthlyCompletion" class="grid grid-cols-[60px_1fr_60px] items-center gap-3 text-sm">
              <span class="text-neutral-500">{{ m.month }}</span>
              <div class="h-1.5 bg-neutral-100 rounded-full overflow-hidden"><div class="h-full bg-warning" [style.width.%]="m.rate"></div></div>
              <span class="text-right tabular-nums">{{ m.rate }}%</span>
            </li>
          </ul>
        </div>
      </section>
      <section class="bg-white border border-neutral-200 rounded-lg p-6">
        <h3 class="font-semibold mb-4">Cohort analysis</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="text-xs text-neutral-500"><tr>
              <th class="text-left font-normal px-3 py-2">Cohort</th>
              <th class="text-right font-normal px-3 py-2">Enrolled</th>
              <th class="text-right font-normal px-3 py-2">Active</th>
              <th class="text-right font-normal px-3 py-2">Completion</th>
              <th class="text-right font-normal px-3 py-2">Avg score</th>
            </tr></thead>
            <tbody class="divide-y divide-neutral-100">
              <tr *ngFor="let c of a.cohorts">
                <td class="px-3 py-3">{{ c.name }}</td>
                <td class="text-right px-3 py-3 tabular-nums">{{ c.enrolled }}</td>
                <td class="text-right px-3 py-3 tabular-nums">{{ c.active }}</td>
                <td class="text-right px-3 py-3 tabular-nums">{{ c.completion }}%</td>
                <td class="text-right px-3 py-3 tabular-nums">{{ c.avgScore }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </ng-container>
  `,
})
export class ProgramAdminAnalyticsTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);
  readonly program = toSignal(this.route.parent!.paramMap.pipe(switchMap((p) => this.programs.bySlug(p.get('slug') ?? ''))), { initialValue: null });
  readonly analytics = toSignal(this.route.parent!.paramMap.pipe(switchMap((p) => this.programs.analytics(p.get('slug') ?? ''))), { initialValue: null });
}
