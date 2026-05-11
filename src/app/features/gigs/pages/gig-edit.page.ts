import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';

@Component({
  selector: 'mereka-gig-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="gig() as g">
      <div class="max-w-3xl mx-auto px-6 py-10">
        <a routerLink="/gigs/admin" class="text-sm text-neutral-500">← Back to my gigs</a>
        <h1 class="text-2xl font-semibold mt-2 mb-6">Edit Gig</h1>
        <form class="bg-white border border-neutral-200 rounded-lg p-6 space-y-5" (submit)="$event.preventDefault(); save()">
          <label class="block">
            <span class="text-sm font-medium">Title</span>
            <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="title()" (ngModelChange)="title.set($event)" name="title" />
          </label>
          <label class="block">
            <span class="text-sm font-medium">Brief</span>
            <textarea rows="5" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="description()" (ngModelChange)="description.set($event)" name="description"></textarea>
          </label>
          <label class="block">
            <span class="text-sm font-medium">Status</span>
            <select class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="status()" (ngModelChange)="status.set($event)" name="status">
              <option value="open">Open</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </label>
          <div class="flex items-center justify-between pt-2 border-t border-neutral-100">
            <button type="button" class="text-sm text-error" (click)="confirmDelete.set(true)">Close & remove</button>
            <button type="submit" class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm">Save changes</button>
          </div>
        </form>
        <div *ngIf="confirmDelete()" class="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 class="font-semibold text-lg">Close "{{ g.title }}"?</h2>
            <p class="text-sm text-neutral-600 mt-2">Applicants will be notified that the gig is no longer accepting proposals.</p>
            <div class="mt-5 flex justify-end gap-3">
              <button type="button" class="text-sm text-neutral-700" (click)="confirmDelete.set(false)">Cancel</button>
              <button type="button" class="px-4 py-2 rounded-full bg-error text-white text-sm" (click)="doClose()">Yes, close</button>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class GigEditPage {
  private readonly api = inject(MarketplaceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly gig = toSignal(this.route.paramMap.pipe(switchMap((p) => this.api.gigBySlug(p.get('slug') ?? ''))), { initialValue: null });
  readonly title = signal(''); readonly description = signal('');
  readonly status = signal<'open' | 'draft' | 'closed'>('open');
  readonly confirmDelete = signal(false);
  constructor() {
    effect(() => { const g = this.gig(); if (!g) return;
      this.title.set(g.title); this.description.set(g.description); this.status.set(g.status);
    }, { allowSignalWrites: true });
  }
  save(): void { alert('Saved (mock).'); this.router.navigate(['/gigs/admin']); }
  doClose(): void { this.confirmDelete.set(false); alert('Gig closed (mock).'); this.router.navigate(['/gigs/admin']); }
}
