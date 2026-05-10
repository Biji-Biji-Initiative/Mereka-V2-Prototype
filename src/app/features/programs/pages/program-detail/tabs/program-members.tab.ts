import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { ProgramsService } from '../../../services/programs.service';

@Component({
  selector: 'mereka-program-members-tab',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <h2 class="font-semibold text-lg mb-4">Members ({{ members().length }})</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          *ngFor="let m of members()"
          class="bg-white border border-neutral-200 rounded-lg p-3 text-center"
        >
          <img
            *ngIf="m.avatar as a"
            [src]="a"
            [alt]="m.name"
            class="w-full aspect-square rounded-md object-cover mb-3"
          />
          <div class="text-sm font-medium truncate">{{ m.name }}</div>
          <div
            *ngIf="m.role && m.role !== 'member'"
            class="mt-1 inline-block text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded text-white"
            [class.bg-error]="m.role === 'admin'"
            [class.bg-warning]="m.role === 'mentor'"
          >
            {{ m.role }}
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProgramMembersTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);

  readonly members = toSignal(
    this.route.parent!.paramMap.pipe(
      switchMap((params) => this.programs.members(params.get('slug') ?? '')),
    ),
    { initialValue: [] },
  );
}
