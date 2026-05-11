import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'mereka-gig-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-3xl mx-auto px-6 py-10">
      <a routerLink="/gigs/admin" class="text-sm text-neutral-500">← Back</a>
      <h1 class="text-2xl font-semibold mt-2 mb-2">Post a gig</h1>
      <p class="text-sm text-neutral-500 mb-6">Reach freelancers and contractors across the Mereka network.</p>
      <form class="bg-white border border-neutral-200 rounded-lg p-6 space-y-5" (submit)="$event.preventDefault(); post()">
        <label class="block">
          <span class="text-sm font-medium">Title</span>
          <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="title()" (ngModelChange)="title.set($event)" name="title" placeholder="Landing page for AI4U cohort 3" />
        </label>
        <label class="block">
          <span class="text-sm font-medium">Brief</span>
          <textarea rows="6" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="description()" (ngModelChange)="description.set($event)" name="description"></textarea>
        </label>
        <label class="block">
          <span class="text-sm font-medium">Skills (comma-separated)</span>
          <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="skills()" (ngModelChange)="skills.set($event)" name="skills" placeholder="Next.js, Tailwind, Copywriting" />
        </label>
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium">Engagement</span>
            <select class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="engagement()" (ngModelChange)="engagement.set($event)" name="engagement">
              <option value="one-off">One-off</option>
              <option value="contract">Contract</option>
              <option value="part-time">Part-time</option>
              <option value="full-time">Full-time</option>
            </select>
          </label>
          <label class="block">
            <span class="text-sm font-medium">Remote</span>
            <select class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="remote()" (ngModelChange)="remote.set($event)" name="remote">
              <option value="remote">Remote</option>
              <option value="on-site">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <label class="block">
            <span class="text-sm font-medium">Min budget</span>
            <input type="number" min="0" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="min()" (ngModelChange)="min.set($event)" name="min" />
          </label>
          <label class="block">
            <span class="text-sm font-medium">Max budget</span>
            <input type="number" min="0" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="max()" (ngModelChange)="max.set($event)" name="max" />
          </label>
          <label class="block">
            <span class="text-sm font-medium">Period</span>
            <select class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="period()" (ngModelChange)="period.set($event)" name="period">
              <option value="project">Per project</option>
              <option value="hour">Per hour</option>
              <option value="month">Per month</option>
            </select>
          </label>
        </div>
        <button type="submit" [disabled]="!canPost()" [class.opacity-40]="!canPost()"
                class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm">Post gig</button>
      </form>
    </div>
  `,
})
export class GigCreatePage {
  private readonly router = inject(Router);
  readonly title = signal(''); readonly description = signal(''); readonly skills = signal('');
  readonly engagement = signal('one-off'); readonly remote = signal('remote');
  readonly min = signal<number | null>(null); readonly max = signal<number | null>(null);
  readonly period = signal('project');
  readonly canPost = computed(() => this.title().length > 3 && (this.min() ?? 0) > 0 && (this.max() ?? 0) >= (this.min() ?? 0));
  post(): void { alert(`Gig "${this.title()}" posted.`); this.router.navigate(['/gigs/admin']); }
}
