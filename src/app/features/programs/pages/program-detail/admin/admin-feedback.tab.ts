import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ProgramsService } from '../../../services/programs.service';

@Component({
  selector: 'mereka-admin-feedback-tab',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="feedback() as f">
      <header class="mb-6">
        <h2 class="text-2xl font-semibold">Program feedback</h2>
        <p class="text-sm text-neutral-500">Learners' feedback on the program, learning experience, and overall journey.</p>
      </header>
      <section class="bg-white border border-neutral-200 rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
        <div class="text-center md:text-left">
          <div class="text-5xl font-semibold leading-none">{{ f.averageRating }}</div>
          <div class="text-yellow-500 mt-2 text-lg">★ ★ ★ ★ <span class="text-neutral-300">★</span></div>
          <p class="text-xs text-neutral-500 mt-1">From {{ f.totalReviews | number }} reviews</p>
        </div>
        <ul class="space-y-1.5">
          <li *ngFor="let r of distRows()" class="grid grid-cols-[40px_1fr_60px] items-center gap-3 text-sm">
            <span class="text-neutral-500">{{ r.stars }} ★</span>
            <div class="h-2 rounded-full bg-neutral-100 overflow-hidden">
              <div class="h-full bg-yellow-400" [style.width.%]="r.percent"></div>
            </div>
            <span class="text-right text-xs text-neutral-500 tabular-nums">{{ r.count | number }}</span>
          </li>
        </ul>
      </section>
      <section>
        <h3 class="font-semibold mb-3">Reviews ({{ f.totalReviews | number }})</h3>
        <ul class="space-y-3">
          <li *ngFor="let r of f.reviews" class="bg-white border border-neutral-200 rounded-lg p-5 grid grid-cols-[180px_1fr] gap-5">
            <div class="flex flex-col items-center text-center">
              <img *ngIf="r.reviewer.avatar as a" [src]="a" [alt]="r.reviewer.name" class="w-12 h-12 rounded-full mb-2" />
              <div class="text-sm font-medium">{{ r.reviewer.name }}</div>
              <div class="text-xs text-neutral-500">{{ r.reviewer.completionPercent }}% completion</div>
            </div>
            <div>
              <div class="flex items-center justify-between">
                <div class="text-yellow-500 text-sm">{{ '★'.repeat(r.rating) }}<span class="text-neutral-300">{{ '★'.repeat(5 - r.rating) }}</span></div>
                <div class="text-xs text-neutral-500">{{ r.createdAt | date: 'MMM d' }}</div>
              </div>
              <h4 class="font-medium mt-2">{{ r.title }}</h4>
              <p class="text-sm text-neutral-700 mt-1 leading-relaxed">{{ r.body }}</p>
              <ul *ngIf="r.tags?.length" class="flex flex-wrap gap-2 mt-3">
                <li *ngFor="let t of r.tags" class="text-[10px] uppercase tracking-wider bg-neutral-100 text-neutral-600 rounded-full px-2 py-0.5">{{ t }}</li>
              </ul>
            </div>
          </li>
        </ul>
      </section>
    </ng-container>
  `,
})
export class ProgramAdminFeedbackTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);
  readonly feedback = toSignal(this.route.parent!.paramMap.pipe(switchMap((p) => this.programs.feedback(p.get('slug') ?? ''))), { initialValue: null });
  readonly distRows = computed(() => {
    const f = this.feedback(); if (!f) return [];
    const total = Math.max(1, f.totalReviews);
    return ([5, 4, 3, 2, 1] as const).map((stars) => ({
      stars, count: f.ratingDistribution[stars],
      percent: Math.round((f.ratingDistribution[stars] / total) * 100),
    }));
  });
}
