import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { ProgramsService } from '../../../services/programs.service';

@Component({
  selector: 'mereka-program-discussions-tab',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="program() as p">
      <ul class="space-y-4">
        <li *ngFor="let post of discussions()" class="rounded-lg border border-neutral-200 bg-white p-5">
          <div class="text-xs text-neutral-500 mb-1">
            {{ post.authorName }} · {{ post.postedAt | date: 'MMM d' }}
          </div>
          <h3 class="font-semibold">{{ post.title }}</h3>
          <p class="text-sm text-neutral-700 mt-1">{{ post.body }}</p>
          <div class="text-xs text-neutral-500 mt-2">{{ post.commentCount }} replies</div>
        </li>
        <li *ngIf="discussions().length === 0" class="text-center text-neutral-500 py-12">
          No discussions yet.
        </li>
      </ul>
    </ng-container>
  `,
})
export class ProgramDiscussionsTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);

  readonly program = toSignal(
    this.route.parent!.paramMap.pipe(
      switchMap((params) => this.programs.bySlug(params.get('slug') ?? '')),
    ),
    { initialValue: null },
  );

  readonly discussions = computed(
    () => this.program()?.recentPosts.filter((p) => p.channel === 'discussion') ?? [],
  );
}
