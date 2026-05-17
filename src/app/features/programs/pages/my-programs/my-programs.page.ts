import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { ProgramStoreService } from '../../services/program-store.service';

@Component({
  selector: 'mereka-my-programs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen">
      <div class="max-w-5xl mx-auto px-6 py-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-neutral-900">My Programs</h1>
            <p class="text-sm text-neutral-500 mt-1">Programs you've created and manage.</p>
          </div>
          <a routerLink="/programs/new"
             class="px-5 py-2.5 rounded-full bg-neutral-900 text-white font-medium text-sm hover:bg-neutral-800 transition-colors">
            + Create Program
          </a>
        </div>

        <!-- Empty state -->
        <div *ngIf="store.myPrograms().length === 0"
             class="bg-white rounded-lg border border-neutral-200 p-12 text-center">
          <div class="text-4xl mb-3">📋</div>
          <h3 class="text-lg font-semibold text-neutral-900 mb-1">No programs yet</h3>
          <p class="text-sm text-neutral-500 mb-4">Create your first program to get started.</p>
          <a routerLink="/programs/new"
             class="inline-block px-5 py-2.5 rounded-full bg-neutral-900 text-white font-medium text-sm">
            Create your first program
          </a>
        </div>

        <!-- Program cards -->
        <div *ngIf="store.myPrograms().length > 0" class="space-y-4">
          <div *ngFor="let program of store.myPrograms()"
               class="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-sm transition-shadow">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-neutral-900">{{ program.title }}</h3>
                  <span class="text-xs font-medium px-2.5 py-0.5 rounded-full"
                        [class.bg-green-100]="program.status === 'published'"
                        [class.text-green-700]="program.status === 'published'"
                        [class.bg-yellow-100]="program.status === 'draft'"
                        [class.text-yellow-700]="program.status === 'draft'"
                        [class.bg-neutral-100]="program.status === 'archived'"
                        [class.text-neutral-600]="program.status === 'archived'">
                    {{ program.status | titlecase }}
                  </span>
                  <span *ngIf="program.collaborators.length > 0"
                        class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                    Multi-hub
                  </span>
                </div>
                <p class="text-sm text-neutral-500 mb-3">{{ program.tagline }}</p>
                <div class="flex items-center gap-4 text-xs text-neutral-400">
                  <span>{{ program.curriculum.length }} items</span>
                  <span>{{ program.stats.memberCount }} member{{ program.stats.memberCount !== 1 ? 's' : '' }}</span>
                  <span>{{ program.pricing.kind === 'free' ? 'Free' : 'Paid' }}</span>
                  <span>{{ program.ownerHub.hubName }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 ml-4">
                <a [routerLink]="['/programs', program.slug, 'feed']"
                   class="px-4 py-2 text-sm font-medium rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors">
                  Manage
                </a>
                <a [routerLink]="['/programs', program.slug, 'landing']"
                   class="px-4 py-2 text-sm font-medium rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors">
                  View Landing
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MyProgramsPage {
  readonly auth = inject(AuthService);
  readonly store = inject(ProgramStoreService);
}
