import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ProgramsService } from '../../../services/programs.service';

@Component({
  selector: 'mereka-admin-content-tab',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-semibold">Manage Content</h2>
        <p class="text-sm text-neutral-500">Add, reorder, or unlock curriculum items.</p>
      </div>
      <div class="space-x-2">
        <button class="px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-sm">Preview as learner</button>
        <button class="px-3 py-1.5 rounded-full bg-neutral-900 text-white text-sm">+ Add item</button>
      </div>
    </header>
    <ng-container *ngIf="program() as p">
      <ul class="space-y-3">
        <li *ngFor="let item of p.curriculum; let i = index" class="bg-white border border-neutral-200 rounded-lg p-5 flex items-center gap-4">
          <span class="text-neutral-400 cursor-grab" aria-label="Drag to reorder">⋮⋮</span>
          <span class="w-8 text-neutral-500 text-sm">{{ i + 1 }}</span>
          <span class="text-2xl">{{ item.type === 'course' ? '📘' : item.type === 'experience' ? '🎟️' : '🧑‍🏫' }}</span>
          <div class="flex-1">
            <div class="font-medium">{{ item.title }}</div>
            <div class="text-xs text-neutral-500">
              {{ item.type | titlecase }} · {{ item.ownerHub.hubName }}
              <span *ngIf="item.isMandatory" class="ml-2 text-error">Mandatory</span>
            </div>
          </div>
          <button class="text-xs text-primary-700 font-medium">Edit</button>
          <button class="text-xs text-error font-medium">Remove</button>
        </li>
      </ul>
    </ng-container>
  `,
})
export class ProgramAdminContentTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);
  readonly program = toSignal(this.route.parent!.paramMap.pipe(switchMap((p) => this.programs.bySlug(p.get('slug') ?? ''))), { initialValue: null });
}
