import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'mereka-expertise-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-3xl mx-auto px-6 py-10">
      <a routerLink="/expertise/admin" class="text-sm text-neutral-500">← Back</a>
      <h1 class="text-2xl font-semibold mt-2 mb-2">Offer your expertise</h1>
      <p class="text-sm text-neutral-500 mb-6">Set up a 1:1 or group session. Mereka takes 10% on each booking.</p>
      <form class="bg-white border border-neutral-200 rounded-lg p-6 space-y-5" (submit)="$event.preventDefault(); publish()">
        <label class="block">
          <span class="text-sm font-medium">Title</span>
          <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="title()" (ngModelChange)="title.set($event)" name="title" placeholder="Product Design Critique" />
        </label>
        <label class="block">
          <span class="text-sm font-medium">Tagline</span>
          <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="tagline()" (ngModelChange)="tagline.set($event)" name="tagline" />
        </label>
        <label class="block">
          <span class="text-sm font-medium">Description</span>
          <textarea rows="5" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="description()" (ngModelChange)="description.set($event)" name="description"></textarea>
        </label>
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium">Format</span>
            <select class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="format()" (ngModelChange)="format.set($event)" name="format">
              <option value="1:1">1:1</option>
              <option value="group">Group</option>
            </select>
          </label>
          <label class="block">
            <span class="text-sm font-medium">Session length (minutes)</span>
            <input type="number" min="15" step="15" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="length()" (ngModelChange)="length.set($event)" name="length" />
          </label>
        </div>
        <label class="block max-w-xs">
          <span class="text-sm font-medium">Price per session (MYR)</span>
          <input type="number" min="0" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="price()" (ngModelChange)="price.set($event)" name="price" />
        </label>
        <button type="submit" [disabled]="!canPublish()" [class.opacity-40]="!canPublish()"
                class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm">Publish</button>
      </form>
    </div>
  `,
})
export class ExpertiseCreatePage {
  private readonly router = inject(Router);
  readonly title = signal(''); readonly tagline = signal(''); readonly description = signal('');
  readonly format = signal<'1:1' | 'group'>('1:1');
  readonly length = signal(60); readonly price = signal<number | null>(null);
  readonly canPublish = computed(() => this.title().length > 3 && (this.price() ?? 0) > 0);
  publish(): void {
    alert(`Expertise "${this.title()}" would be published.`);
    this.router.navigate(['/expertise/admin']);
  }
}
