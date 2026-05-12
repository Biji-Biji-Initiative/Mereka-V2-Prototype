import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import type { Program } from '../../models/program.model';

/**
 * Slim vertical rail shown to the left of every program detail screen.
 * Mirrors the Figma left rail (back, current program tile, +, gear) used in:
 * 5208:80547 (Manage Members), 5208:101482 (Application forms), 5208:67078 (Create wizard).
 */
@Component({
  selector: 'mereka-program-leftrail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center gap-3 py-4 w-14">
      <button
        type="button"
        (click)="goBack()"
        class="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition"
        aria-label="Back to your programs"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div
        class="w-10 h-10 rounded-lg overflow-hidden ring-2 ring-neutral-900/5"
        [attr.aria-label]="'Currently viewing ' + program().title"
      >
        <img
          *ngIf="program().coverImageUrl; else initialsTile"
          [src]="program().coverImageUrl"
          [alt]="program().title"
          class="w-full h-full object-cover"
        />
        <ng-template #initialsTile>
          <div class="w-full h-full bg-primary-100 text-primary-800 flex items-center justify-center text-sm font-semibold uppercase">
            {{ program().title[0] }}
          </div>
        </ng-template>
      </div>

      <a
        routerLink="/programs/new"
        class="w-9 h-9 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition"
        aria-label="Create another program"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </a>

      <a
        *ngIf="canManage()"
        [routerLink]="['/programs', program().slug, 'admin', 'dashboard']"
        class="w-9 h-9 rounded-full flex items-center justify-center text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 transition mt-auto"
        aria-label="Open admin settings"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3" />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
          />
        </svg>
      </a>
    </div>
  `,
})
export class ProgramLeftRailComponent {
  private readonly router = inject(Router);
  readonly program = input.required<Program>();
  /** When true the gear icon is shown — applicant view hides admin entry points. */
  readonly canManage = input<boolean>(false);

  goBack(): void {
    this.router.navigate(['/programs', 'me']);
  }
}
