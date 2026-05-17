import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, switchMap, of } from 'rxjs';

import { ProgramsService } from '../../../services/programs.service';
import type {
  CurriculumItem,
  CurriculumItemType,
  LearnerProgress,
  Program,
} from '../../../models/program.model';
import { environment } from '../../../../../../environments/environment';

interface RowVm {
  item: CurriculumItem;
  status: 'locked' | 'in_progress' | 'completed' | 'overdue' | 'not_started';
  progress: number;
  externalLink: string;
}

@Component({
  selector: 'mereka-program-curriculum-tab',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="program() as p">
      <header class="bg-white rounded-lg border border-neutral-200 p-6">
        <h2 class="font-semibold text-lg">Program Overview</h2>
        <p class="text-sm text-neutral-500 mt-1">
          Your complete learning journey, milestones, and completion requirements in one place.
        </p>

        <div class="mt-6">
          <div class="flex items-baseline justify-between mb-2">
            <span class="text-sm text-neutral-500">Progress Tracker</span>
            <span class="text-sm font-medium">{{ progress()?.percentComplete ?? 0 }}%</span>
          </div>
          <div class="h-2 rounded-full bg-neutral-100 overflow-hidden">
            <div
              class="h-full bg-success transition-[width] duration-700"
              [style.width.%]="progress()?.percentComplete ?? 0"
            ></div>
          </div>
          <div class="text-xs text-neutral-500 mt-2">
            {{ progress()?.itemsCompleted ?? 0 }} of {{ progress()?.itemsTotal ?? p.curriculum.length }} mandatory items finished
          </div>
        </div>
      </header>

      <ng-container *ngFor="let group of grouped()">
        <section class="bg-white rounded-lg border border-neutral-200 mt-6 overflow-hidden">
          <header class="px-6 py-4 border-b border-neutral-100 flex items-baseline gap-2">
            <h3 class="font-semibold text-neutral-900">{{ group.label }}</h3>
            <span class="text-sm text-neutral-500">({{ group.rows.length }})</span>
          </header>
          <table class="w-full text-sm">
            <thead class="text-xs text-neutral-500">
              <tr>
                <th class="text-left font-normal px-6 py-3">Name</th>
                <th class="text-left font-normal px-6 py-3">Owner</th>
                <th class="text-left font-normal px-6 py-3">Due</th>
                <th class="text-left font-normal px-6 py-3">Progress</th>
                <th class="text-right font-normal px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr *ngFor="let row of group.rows" class="hover:bg-neutral-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <span
                      class="inline-flex items-center justify-center w-8 h-8 rounded bg-neutral-100"
                      [title]="row.item.type"
                    >
                      <ng-container [ngSwitch]="row.item.type">
                        <span *ngSwitchCase="'course'">📘</span>
                        <span *ngSwitchCase="'experience'">🎟️</span>
                        <span *ngSwitchCase="'expertise'">🧑‍🏫</span>
                      </ng-container>
                    </span>
                    <div>
                      <div class="font-medium text-neutral-900">{{ row.item.title }}</div>
                      <div *ngIf="row.item.isMandatory" class="text-[10px] uppercase tracking-wider text-error">
                        Mandatory
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-neutral-700">{{ row.item.ownerHub.hubName }}</td>
                <td class="px-6 py-4 text-neutral-500">
                  {{ row.item.deadline ? (row.item.deadline | date: 'MMM d, y') : '—' }}
                </td>
                <td class="px-6 py-4 w-[180px]">
                  <div class="flex items-center gap-2">
                    <div class="h-1.5 flex-1 rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        class="h-full"
                        [class.bg-success]="row.status === 'completed'"
                        [class.bg-info]="row.status === 'in_progress'"
                        [class.bg-warning]="row.status === 'overdue'"
                        [class.bg-neutral-300]="row.status === 'locked' || row.status === 'not_started'"
                        [style.width.%]="row.progress"
                      ></div>
                    </div>
                    <span class="text-xs text-neutral-500 capitalize">{{ row.status.replace('_', ' ') }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <a
                    [href]="row.externalLink"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-700"
                    [class.opacity-50]="row.status === 'locked'"
                    [class.pointer-events-none]="row.status === 'locked'"
                  >
                    {{ row.status === 'completed' ? 'Review' : row.status === 'locked' ? 'Locked' : 'Continue' }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </ng-container>
    </ng-container>
  `,
})
export class ProgramCurriculumTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);

  private readonly slug$ = this.route.parent!.paramMap.pipe(
    switchMap((params) => of(params.get('slug') ?? '')),
  );

  readonly program = toSignal<Program | null>(
    this.slug$.pipe(switchMap((s) => (s ? this.programs.bySlug(s) : of(null)))),
    { initialValue: null },
  );

  readonly progress = toSignal<LearnerProgress | null>(
    this.slug$.pipe(switchMap((s) => (s ? this.programs.myProgress(s) : of(null)))),
    { initialValue: null },
  );

  /** Build the per-row view-model: status + deep link to the source surface. */
  private rowFor(item: CurriculumItem): RowVm {
    const perItem = this.progress()?.perItem[item.id];
    const status = perItem?.status ?? (item.prerequisiteIds.length ? 'locked' : 'not_started');
    return {
      item,
      status,
      progress: perItem?.progressPercent ?? 0,
      externalLink: this.deepLink(item),
    };
  }

  /**
   * Each curriculum type lives in a different system, so we build the deep link here.
   * The runtime URLs are injected from environment so the same component works across dev/prod.
   */
  private deepLink(item: CurriculumItem): string {
    switch (item.type) {
      case 'course':
        // Open edX courseware URL pattern
        return `${environment.appUrls.lms}/courses/${item.sourceId}/course/`;
      case 'experience':
        return `${environment.appUrls.web}/experience/${item.slug}`;
      case 'expertise':
        return `${environment.appUrls.web}/expertise/${item.slug}`;
    }
  }

  readonly grouped = computed<{ label: string; type: CurriculumItemType; rows: RowVm[] }[]>(() => {
    const items = this.program()?.curriculum ?? [];
    const order: { type: CurriculumItemType; label: string }[] = [
      { type: 'course', label: 'Course Modules' },
      { type: 'experience', label: 'Experiences' },
      { type: 'expertise', label: 'Expertise' },
    ];
    return order
      .map(({ type, label }) => ({
        label,
        type,
        rows: items.filter((i) => i.type === type).map((i) => this.rowFor(i)),
      }))
      .filter((g) => g.rows.length > 0);
  });
}
