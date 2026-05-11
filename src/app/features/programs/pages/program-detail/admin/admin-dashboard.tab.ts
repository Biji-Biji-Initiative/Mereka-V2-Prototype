import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ProgramsService } from '../../../services/programs.service';

@Component({
  selector: 'mereka-admin-dashboard-tab',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex items-baseline justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold">{{ program()?.title }}</h2>
        <p class="text-sm text-neutral-500">Admin dashboard — health, momentum, next actions.</p>
      </div>
      <a routerLink="../analytics" class="text-sm text-primary-700 font-medium">Open full analytics →</a>
    </header>
    <ng-container *ngIf="analytics() as a">
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">Active learners</div>
          <div class="text-2xl font-semibold mt-1">{{ a.overview.activeLearners | number }}</div>
          <div class="text-xs mt-1 text-success">▲ {{ a.overview.activeLearnersDelta }}%</div>
        </div>
        <div class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">Retention rate</div>
          <div class="text-2xl font-semibold mt-1">{{ a.overview.retentionRate }}%</div>
          <div class="text-xs mt-1 text-success">▲ {{ a.overview.retentionRateDelta }}pp</div>
        </div>
        <div class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">Completion rate</div>
          <div class="text-2xl font-semibold mt-1">{{ a.overview.completionRate }}%</div>
          <div class="text-xs mt-1 text-error">▼ 2pp</div>
        </div>
        <div class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">NPS</div>
          <div class="text-2xl font-semibold mt-1">{{ a.overview.npsScore }}</div>
          <div class="text-xs mt-1 text-neutral-500">last 30 days</div>
        </div>
      </section>
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">Courses included</div>
          <div class="text-3xl font-semibold mt-1">{{ a.composition.courses }}</div>
        </div>
        <div class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">Experiences</div>
          <div class="text-3xl font-semibold mt-1">{{ a.composition.experiences }}</div>
        </div>
        <div class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">Expertise sessions</div>
          <div class="text-3xl font-semibold mt-1">{{ a.composition.expertise }}</div>
        </div>
      </section>
      <section class="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
        <h3 class="font-semibold mb-4">Enrolment funnel</h3>
        <ul class="space-y-3">
          <li *ngFor="let stage of a.funnel" class="grid grid-cols-[120px_1fr_80px] items-center gap-3 text-sm">
            <span class="text-neutral-500">{{ stage.stage }}</span>
            <div class="h-2 rounded-full bg-neutral-100 overflow-hidden">
              <div class="h-full bg-success" [style.width.%]="stage.percent"></div>
            </div>
            <span class="text-right tabular-nums">{{ stage.count | number }}</span>
          </li>
        </ul>
      </section>
      <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 class="font-semibold mb-3">Reviews</h3>
          <p class="text-sm text-neutral-500 mb-3">Avg {{ a.feedbackSummary.average }}/5 from {{ a.feedbackSummary.total | number }} reviews</p>
          <a routerLink="../feedback" class="text-sm text-primary-700 font-medium">View all feedback →</a>
        </div>
        <div class="bg-white border border-neutral-200 rounded-lg p-6">
          <h3 class="font-semibold mb-3">Monthly completion trend</h3>
          <ul class="space-y-1">
            <li *ngFor="let m of a.monthlyCompletion" class="flex items-center gap-3 text-sm">
              <span class="w-10 text-neutral-500">{{ m.month }}</span>
              <div class="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div class="h-full bg-info" [style.width.%]="m.rate"></div>
              </div>
              <span class="text-xs text-neutral-500 w-8 text-right">{{ m.rate }}%</span>
            </li>
          </ul>
        </div>
      </section>
    </ng-container>
  `,
})
export class ProgramAdminDashboardTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);
  readonly program = toSignal(this.route.parent!.paramMap.pipe(switchMap((p) => this.programs.bySlug(p.get('slug') ?? ''))), { initialValue: null });
  readonly analytics = toSignal(this.route.parent!.paramMap.pipe(switchMap((p) => this.programs.analytics(p.get('slug') ?? ''))), { initialValue: null });
}
