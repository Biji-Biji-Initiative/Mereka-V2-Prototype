import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';

import { ProgramsService } from '../../services/programs.service';
import type { ProgramMember } from '../../models/program.model';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'mereka-program-roster',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-lg border border-neutral-200 p-4 sticky top-20 text-sm">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold">Online — {{ online().length }}</h3>
      </div>
      <ul class="space-y-2 max-h-72 overflow-auto scrollbar-thin">
        <li *ngFor="let m of online()" class="flex items-center gap-2">
          <div class="relative">
            <img *ngIf="m.avatar as src" [src]="src" [alt]="m.name" class="w-7 h-7 rounded-full object-cover" />
            <span
              class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-white"
            ></span>
          </div>
          <span class="truncate">{{ m.name }}</span>
          <span
            *ngIf="m.role === 'admin'"
            class="ml-auto text-[10px] uppercase tracking-wider bg-error text-white rounded px-1"
          >
            admin
          </span>
          <span
            *ngIf="m.role === 'mentor'"
            class="ml-auto text-[10px] uppercase tracking-wider bg-warning text-white rounded px-1"
          >
            mentor
          </span>
        </li>
      </ul>

      <h3 class="font-semibold mt-5 mb-3">Offline — {{ offline().length }}</h3>
      <ul class="space-y-2 max-h-72 overflow-auto scrollbar-thin opacity-60">
        <li *ngFor="let m of offline()" class="flex items-center gap-2">
          <img
            *ngIf="m.avatar as src"
            [src]="src"
            [alt]="m.name"
            class="w-7 h-7 rounded-full object-cover grayscale"
          />
          <span class="truncate">{{ m.name }}</span>
        </li>
      </ul>

      <div class="text-xs text-neutral-500 mt-4 border-t border-neutral-100 pt-3">
        {{ online().length }} members online
      </div>
    </div>
  `,
})
export class ProgramRosterComponent {
  private readonly programs = inject(ProgramsService);
  readonly slug = input.required<string>();

  /** Re-fetch when the slug changes (rare in our routes, but supports nav transitions). */
  private readonly members = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) => (slug ? this.programs.members(slug) : of<ProgramMember[]>([]))),
    ),
    { initialValue: [] as ProgramMember[] },
  );

  readonly online = computed(() => (this.members() ?? []).filter((m) => m.isOnline));
  readonly offline = computed(() => (this.members() ?? []).filter((m) => !m.isOnline));
}
