import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { ProgramsService } from '../../../services/programs.service';

@Component({
  selector: 'mereka-program-feed-tab',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      <!-- Composer -->
      <div class="rounded-lg border border-neutral-200 bg-white p-4 flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-neutral-100"></div>
        <input
          class="flex-1 bg-transparent focus:outline-none text-sm text-neutral-700 placeholder:text-neutral-400"
          placeholder="Start a post…"
        />
        <button class="text-sm text-neutral-500 hover:text-neutral-900">Photo</button>
        <button class="text-sm text-neutral-500 hover:text-neutral-900">Poll</button>
      </div>

      <ng-container *ngIf="program() as p">
        <article
          *ngFor="let post of p.recentPosts"
          class="rounded-lg border border-neutral-200 bg-white p-5"
        >
          <header class="flex items-center gap-3">
            <img
              *ngIf="post.authorAvatar as a"
              [src]="a"
              [alt]="post.authorName"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="flex-1">
              <div class="text-sm font-medium">
                {{ post.authorName }}
                <span
                  *ngIf="post.authorRole && post.authorRole !== 'member'"
                  class="ml-1 text-[10px] uppercase tracking-wider rounded px-1.5 py-0.5"
                  [class.bg-error]="post.authorRole === 'admin'"
                  [class.bg-warning]="post.authorRole === 'mentor'"
                  [class.text-white]="post.authorRole === 'admin' || post.authorRole === 'mentor'"
                >
                  {{ post.authorRole }}
                </span>
              </div>
              <div class="text-xs text-neutral-500">
                {{ post.postedAt | date: 'MMM d, y · h:mm a' }} · in
                {{ post.channel }}
              </div>
            </div>
          </header>

          <h3 *ngIf="post.title" class="font-semibold mt-3 text-neutral-900">{{ post.title }}</h3>
          <p class="text-sm text-neutral-700 mt-2 leading-relaxed">{{ post.body }}</p>

          <footer class="flex items-center gap-4 mt-4 text-sm text-neutral-500">
            <button
              *ngFor="let r of post.reactions"
              class="inline-flex items-center gap-1 hover:text-neutral-900"
            >
              <span>{{ r.emoji }}</span>
              <span class="text-xs">{{ r.count }}</span>
            </button>
            <span class="ml-auto text-xs">{{ post.commentCount }} comments</span>
          </footer>
        </article>

        <div *ngIf="p.recentPosts.length === 0" class="text-center text-neutral-500 py-12">
          No posts yet — be the first to say hi.
        </div>
      </ng-container>
    </div>
  `,
})
export class ProgramFeedTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);

  /** ParamMap is on the *parent* route — bubble up. */
  readonly program = toSignal(
    this.route.parent!.paramMap.pipe(
      switchMap((params) => this.programs.bySlug(params.get('slug') ?? '')),
    ),
    { initialValue: null },
  );
}
