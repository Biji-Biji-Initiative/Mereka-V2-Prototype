import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProgramsService } from '../../services/programs.service';
import type { Program } from '../../models/program.model';

@Component({
  selector: 'mereka-program-admin-all',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[1320px] mx-auto px-6 py-10">
      <header class="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 class="text-2xl font-semibold">Your Programs</h1>
          <p class="text-sm text-neutral-500">Manage and monitor all your active and draft programs.</p>
        </div>
        <a routerLink="../new" class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm">+ Create New</a>
      </header>
      <div class="flex flex-wrap gap-2 mb-5 text-sm">
        <button type="button" class="px-3 py-1.5 rounded-full"
          [class.bg-neutral-900]="status() === ''" [class.text-white]="status() === ''"
          [class.bg-white]="status() !== ''" [class.text-neutral-700]="status() !== ''"
          [class.border]="status() !== ''" [class.border-neutral-200]="status() !== ''"
          (click)="status.set('')">All</button>
        <button type="button" class="px-3 py-1.5 rounded-full"
          [class.bg-neutral-900]="status() === 'published'" [class.text-white]="status() === 'published'"
          [class.bg-white]="status() !== 'published'" [class.text-neutral-700]="status() !== 'published'"
          [class.border]="status() !== 'published'" [class.border-neutral-200]="status() !== 'published'"
          (click)="status.set('published')">Published</button>
        <button type="button" class="px-3 py-1.5 rounded-full"
          [class.bg-neutral-900]="status() === 'draft'" [class.text-white]="status() === 'draft'"
          [class.bg-white]="status() !== 'draft'" [class.text-neutral-700]="status() !== 'draft'"
          [class.border]="status() !== 'draft'" [class.border-neutral-200]="status() !== 'draft'"
          (click)="status.set('draft')">Draft</button>
        <button type="button" class="px-3 py-1.5 rounded-full"
          [class.bg-neutral-900]="status() === 'archived'" [class.text-white]="status() === 'archived'"
          [class.bg-white]="status() !== 'archived'" [class.text-neutral-700]="status() !== 'archived'"
          [class.border]="status() !== 'archived'" [class.border-neutral-200]="status() !== 'archived'"
          (click)="status.set('archived')">Archived</button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a *ngFor="let p of filtered()" [routerLink]="['..', p.slug, 'admin', 'dashboard']"
           class="block rounded-lg overflow-hidden bg-white border border-neutral-200 hover:shadow-md transition group">
          <div class="aspect-[16/9] bg-neutral-100 relative">
            <img [src]="p.coverImageUrl" [alt]="p.title" class="w-full h-full object-cover" />
            <span class="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-sm font-medium text-white"
                  [class.bg-success]="p.status === 'published'"
                  [class.bg-neutral-500]="p.status === 'draft'"
                  [class.bg-neutral-700]="p.status === 'archived'">
              {{ p.status }}
            </span>
          </div>
          <div class="p-5">
            <h3 class="font-semibold leading-snug">{{ p.title }}</h3>
            <p class="text-sm text-neutral-500 mt-1 line-clamp-2">{{ p.tagline }}</p>
            <div class="mt-4 grid grid-cols-3 gap-2 text-xs text-neutral-500">
              <span>📚 {{ p.curriculum.length }} modules</span>
              <span>👥 {{ p.stats.memberCount | number }}</span>
              <span>{{ p.visibility === 'public' ? '🌍 Public' : '🔒 Private' }}</span>
            </div>
          </div>
        </a>
        <div *ngIf="filtered().length === 0" class="col-span-full text-center py-16 text-neutral-500 border border-dashed border-neutral-200 rounded-lg">
          No programs with that status yet — create one to get started.
        </div>
      </div>
    </div>
  `,
})
export class ProgramAdminAllPage {
  private readonly programs = inject(ProgramsService);
  readonly status = signal<'' | 'published' | 'draft' | 'archived'>('');
  readonly all = toSignal(this.programs.hubPrograms(), { initialValue: [] as Program[] });
  readonly filtered = computed(() => {
    const s = this.status(); return s ? this.all().filter((p) => p.status === s) : this.all();
  });
}
