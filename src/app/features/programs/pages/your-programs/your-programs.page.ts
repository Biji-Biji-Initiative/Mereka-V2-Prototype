import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProgramsService } from '../../services/programs.service';
import type { Program } from '../../models/program.model';

type ViewAs = 'student' | 'creator';

/**
 * /programs/me — "Your Programs" dashboard.
 * Matches Figma 5208:71006 (cards, populated state) and 5208:71193 (empty state).
 *
 * Audience switch:
 *   - Student view → calls /me/programs (programs the user has joined). Click → /programs/:slug (community).
 *   - Creator view → calls /me/hubs/programs (programs owned by the user's hubs). Click → /programs/:slug/admin.
 */
@Component({
  selector: 'mereka-your-programs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen">
      <div class="max-w-[1320px] mx-auto px-6 py-10">
        <header class="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight text-neutral-900">Your Programs</h1>
            <p class="text-sm text-neutral-500 mt-1">Manage and monitor all your active and draft programs.</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="inline-flex bg-white border border-neutral-200 rounded-full p-1 text-sm">
              <button
                type="button"
                class="px-4 py-1.5 rounded-full transition"
                [class.bg-neutral-900]="viewAs() === 'student'"
                [class.text-white]="viewAs() === 'student'"
                [class.text-neutral-600]="viewAs() !== 'student'"
                (click)="viewAs.set('student')"
              >
                As student
              </button>
              <button
                type="button"
                class="px-4 py-1.5 rounded-full transition"
                [class.bg-neutral-900]="viewAs() === 'creator'"
                [class.text-white]="viewAs() === 'creator'"
                [class.text-neutral-600]="viewAs() !== 'creator'"
                (click)="viewAs.set('creator')"
              >
                As creator
              </button>
            </div>
            <a
              *ngIf="viewAs() === 'creator'"
              routerLink="/programs/new"
              class="inline-flex items-center gap-2 px-5 h-10 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create New
            </a>
          </div>
        </header>

        <ng-container *ngIf="viewAs() === 'creator'">
          <div class="flex flex-wrap gap-2 mb-6 text-sm">
            <button
              type="button"
              class="px-4 py-1.5 rounded-full transition"
              [class.bg-neutral-900]="status() === ''"
              [class.text-white]="status() === ''"
              [class.bg-white]="status() !== ''"
              [class.text-neutral-700]="status() !== ''"
              [class.border]="status() !== ''"
              [class.border-neutral-200]="status() !== ''"
              (click)="status.set('')"
            >
              All
            </button>
            <button
              type="button"
              class="px-4 py-1.5 rounded-full transition"
              [class.bg-neutral-900]="status() === 'published'"
              [class.text-white]="status() === 'published'"
              [class.bg-white]="status() !== 'published'"
              [class.text-neutral-700]="status() !== 'published'"
              [class.border]="status() !== 'published'"
              [class.border-neutral-200]="status() !== 'published'"
              (click)="status.set('published')"
            >
              Published
            </button>
            <button
              type="button"
              class="px-4 py-1.5 rounded-full transition"
              [class.bg-neutral-900]="status() === 'draft'"
              [class.text-white]="status() === 'draft'"
              [class.bg-white]="status() !== 'draft'"
              [class.text-neutral-700]="status() !== 'draft'"
              [class.border]="status() !== 'draft'"
              [class.border-neutral-200]="status() !== 'draft'"
              (click)="status.set('draft')"
            >
              Draft
            </button>
            <button
              type="button"
              class="px-4 py-1.5 rounded-full transition"
              [class.bg-neutral-900]="status() === 'archived'"
              [class.text-white]="status() === 'archived'"
              [class.bg-white]="status() !== 'archived'"
              [class.text-neutral-700]="status() !== 'archived'"
              [class.border]="status() !== 'archived'"
              [class.border-neutral-200]="status() !== 'archived'"
              (click)="status.set('archived')"
            >
              Archived
            </button>
          </div>
        </ng-container>

        <div *ngIf="visible().length > 0; else emptyState" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <a
            *ngFor="let p of visible()"
            [routerLink]="cardLink(p)"
            class="group block rounded-2xl bg-white ring-1 ring-neutral-200 hover:ring-neutral-300 hover:shadow-md overflow-hidden transition"
          >
            <div class="aspect-[16/10] bg-neutral-100 relative">
              <img [src]="p.coverImageUrl" [alt]="p.title" class="w-full h-full object-cover" loading="lazy" />
              <span
                class="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 text-[11px] rounded-full font-semibold bg-white/90 backdrop-blur text-neutral-700"
              >
                {{ p.pricing.kind === 'free' ? 'Free' : (p.pricing.currency + ' ' + p.pricing.price) }}
              </span>
            </div>
            <div class="p-5">
              <h3 class="font-bold text-neutral-900 leading-snug line-clamp-1">{{ p.title }}</h3>
              <p class="text-sm text-neutral-500 mt-1.5 line-clamp-2 min-h-[40px]">{{ p.tagline }}</p>
              <div class="mt-4 flex items-center justify-between text-xs text-neutral-500">
                <span class="inline-flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                  {{ p.stats.memberCount | number }} {{ p.visibility === 'public' ? 'public' : 'private' }} members
                </span>
                <div class="flex -space-x-1.5" aria-hidden="true">
                  <span class="w-5 h-5 rounded-full bg-primary-200 border border-white"></span>
                  <span class="w-5 h-5 rounded-full bg-primary-300 border border-white"></span>
                  <span class="w-5 h-5 rounded-full bg-primary-400 border border-white"></span>
                </div>
              </div>
            </div>
          </a>
        </div>

        <ng-template #emptyState>
          <div class="bg-white border border-dashed border-neutral-300 rounded-2xl py-20 px-6 text-center">
            <div class="mx-auto w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-neutral-400">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <p class="text-neutral-700 font-medium">
              {{ viewAs() === 'student' ? "You haven't joined a program yet" : "You haven't created a program yet" }}
            </p>
            <p class="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
              {{
                viewAs() === 'student'
                  ? 'Browse the marketplace to discover guided journeys with mentors and cohorts.'
                  : "Create a program to bundle your courses, experiences and 1:1 expertise into one focused journey."
              }}
            </p>
            <a
              [routerLink]="viewAs() === 'student' ? '/programs' : '/programs/new'"
              class="inline-flex items-center gap-2 mt-5 px-5 h-10 rounded-full bg-neutral-900 text-white text-sm font-semibold"
            >
              {{ viewAs() === 'student' ? 'Browse programs' : '+ Create new' }}
            </a>
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class YourProgramsPage {
  private readonly programs = inject(ProgramsService);

  readonly viewAs = signal<ViewAs>('student');
  readonly status = signal<'' | 'published' | 'draft' | 'archived'>('');

  readonly student = toSignal(this.programs.myPrograms(), { initialValue: [] as Program[] });
  readonly creator = toSignal(this.programs.hubPrograms(), { initialValue: [] as Program[] });

  readonly visible = computed(() => {
    if (this.viewAs() === 'student') return this.student();
    const s = this.status();
    return s ? this.creator().filter((p) => p.status === s) : this.creator();
  });

  cardLink(p: Program): string[] {
    return this.viewAs() === 'student'
      ? ['/programs', p.slug]
      : ['/programs', p.slug, 'admin', 'dashboard'];
  }
}
