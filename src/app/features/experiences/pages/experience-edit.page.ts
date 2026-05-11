import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';

@Component({
  selector: 'mereka-experience-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="experience() as e">
      <div class="max-w-3xl mx-auto px-6 py-10">
        <a routerLink="/experiences/admin" class="text-sm text-neutral-500">← Back to my experiences</a>
        <h1 class="text-2xl font-semibold mt-2 mb-6">Edit Experience</h1>

        <form class="bg-white border border-neutral-200 rounded-lg p-6 space-y-5" (submit)="$event.preventDefault(); save()">
          <label class="block">
            <span class="text-sm font-medium">Title</span>
            <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="title()" (ngModelChange)="title.set($event)" name="title" />
          </label>
          <label class="block">
            <span class="text-sm font-medium">Tagline</span>
            <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="tagline()" (ngModelChange)="tagline.set($event)" name="tagline" />
          </label>
          <label class="block">
            <span class="text-sm font-medium">Description</span>
            <textarea rows="5" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="description()" (ngModelChange)="description.set($event)" name="description"></textarea>
          </label>
          <label class="block">
            <span class="text-sm font-medium">Status</span>
            <select class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="status()" (ngModelChange)="status.set($event)" name="status">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <div class="flex items-center justify-between pt-2 border-t border-neutral-100">
            <button type="button" class="text-sm text-error" (click)="confirmDelete.set(true)">Delete experience</button>
            <button type="submit" class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm">Save changes</button>
          </div>
        </form>

        <div *ngIf="confirmDelete()" class="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 class="font-semibold text-lg">Delete "{{ e.title }}"?</h2>
            <p class="text-sm text-neutral-600 mt-2">This can't be undone. Existing bookings will be cancelled and refunded automatically.</p>
            <div class="mt-5 flex justify-end gap-3">
              <button type="button" class="text-sm text-neutral-700" (click)="confirmDelete.set(false)">Cancel</button>
              <button type="button" class="px-4 py-2 rounded-full bg-error text-white text-sm" (click)="doDelete()">Yes, delete</button>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class ExperienceEditPage {
  private readonly api = inject(MarketplaceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly experience = toSignal(
    this.route.paramMap.pipe(switchMap((p) => this.api.experienceBySlug(p.get('slug') ?? ''))),
    { initialValue: null },
  );

  readonly title = signal('');
  readonly tagline = signal('');
  readonly description = signal('');
  readonly status = signal<'draft' | 'published' | 'archived'>('draft');
  readonly confirmDelete = signal(false);

  constructor() {
    // Once the experience fetch resolves, seed the editable form signals.
    effect(() => {
      const e = this.experience();
      if (!e) return;
      this.title.set(e.title);
      this.tagline.set(e.tagline);
      this.description.set(e.description);
      this.status.set(e.status);
    }, { allowSignalWrites: true });
  }

  save(): void {
    alert('Saved (mock).');
    this.router.navigate(['/experiences/admin']);
  }
  doDelete(): void {
    this.confirmDelete.set(false);
    alert('Deleted (mock).');
    this.router.navigate(['/experiences/admin']);
  }
}
