import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ProgramsService } from '../../../services/programs.service';

@Component({
  selector: 'mereka-program-announcements-tab',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="program() as p">
      <h2 class="font-semibold text-lg mb-4">Announcements</h2>
      <ul class="space-y-3">
        <li *ngFor="let post of announcements()" class="rounded-lg border border-neutral-200 bg-white p-5 flex gap-3">
          <span class="text-2xl shrink-0" aria-hidden="true">📣</span>
          <div class="flex-1">
            <div class="text-xs text-neutral-500 mb-1">{{ post.authorName }} · {{ post.postedAt | date: 'MMM d' }}</div>
            <h3 class="font-semibold">{{ post.title }}</h3>
            <p class="text-sm text-neutral-700 mt-1 leading-relaxed">{{ post.body }}</p>
          </div>
        </li>
        <li *ngIf="announcements().length === 0" class="text-center text-neutral-500 py-12 border border-dashed border-neutral-200 rounded-lg">
          No announcements yet. Pinned posts from program admins will appear here.
        </li>
      </ul>
    </ng-container>
  `,
})
export class ProgramAnnouncementsTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);
  readonly program = toSignal(this.route.parent!.paramMap.pipe(switchMap((p) => this.programs.bySlug(p.get('slug') ?? ''))), { initialValue: null });
  readonly announcements = computed(() => this.program()?.recentPosts.filter((p) => p.channel === 'announcement') ?? []);
}
