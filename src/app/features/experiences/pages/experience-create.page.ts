import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface Step { key: 'basics' | 'session' | 'tickets' | 'publish'; label: string; }

@Component({
  selector: 'mereka-experience-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen">
      <div class="max-w-[1320px] mx-auto px-6 py-8 grid grid-cols-12 gap-6">
        <aside class="col-span-12 md:col-span-3">
          <div class="bg-white border border-neutral-200 rounded-lg p-5 sticky top-20">
            <a routerLink="/experiences/admin" class="text-neutral-400 mb-2 inline-block">←</a>
            <h2 class="text-xl font-semibold mb-6">Host an Experience</h2>
            <ul class="space-y-1">
              <li *ngFor="let s of steps">
                <button type="button" class="w-full text-left px-4 py-2 rounded-full text-sm"
                        [class.bg-neutral-900]="active() === s.key" [class.text-white]="active() === s.key"
                        [class.text-neutral-700]="active() !== s.key" [class.hover:bg-neutral-100]="active() !== s.key"
                        (click)="active.set(s.key)">{{ s.label }}</button>
              </li>
            </ul>
          </div>
        </aside>
        <main class="col-span-12 md:col-span-9">
          <div class="bg-white border border-neutral-200 rounded-lg p-8 min-h-[460px]">
            <ng-container [ngSwitch]="active()">
              <section *ngSwitchCase="'basics'" class="space-y-5 max-w-2xl">
                <header>
                  <h3 class="text-xl font-semibold">Basics</h3>
                  <p class="text-sm text-neutral-500">Tell learners what the experience is and where it happens.</p>
                </header>
                <label class="block">
                  <span class="text-sm font-medium">Title</span>
                  <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="title()" (ngModelChange)="title.set($event)" placeholder="Image Gen Crash Course" />
                </label>
                <label class="block">
                  <span class="text-sm font-medium">Tagline</span>
                  <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="tagline()" (ngModelChange)="tagline.set($event)" placeholder="From idea to shipped prompt pack in 4 hours" />
                </label>
                <label class="block">
                  <span class="text-sm font-medium">Description</span>
                  <textarea rows="6" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="description()" (ngModelChange)="description.set($event)"></textarea>
                </label>
                <label class="block">
                  <span class="text-sm font-medium">Mode</span>
                  <select class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="mode()" (ngModelChange)="mode.set($event)">
                    <option value="physical">In-person</option>
                    <option value="virtual">Virtual</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </label>
                <label class="block" *ngIf="mode() !== 'virtual'">
                  <span class="text-sm font-medium">Venue / city</span>
                  <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="city()" (ngModelChange)="city.set($event)" />
                </label>
              </section>

              <section *ngSwitchCase="'session'" class="space-y-5 max-w-2xl">
                <header>
                  <h3 class="text-xl font-semibold">Session</h3>
                  <p class="text-sm text-neutral-500">When does it run?</p>
                </header>
                <div class="grid grid-cols-2 gap-4">
                  <label class="block">
                    <span class="text-sm font-medium">Starts</span>
                    <input type="datetime-local" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="startsAt()" (ngModelChange)="startsAt.set($event)" />
                  </label>
                  <label class="block">
                    <span class="text-sm font-medium">Ends</span>
                    <input type="datetime-local" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="endsAt()" (ngModelChange)="endsAt.set($event)" />
                  </label>
                </div>
                <label class="block max-w-xs">
                  <span class="text-sm font-medium">Capacity</span>
                  <input type="number" min="0" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="capacity()" (ngModelChange)="capacity.set($event)" />
                </label>
              </section>

              <section *ngSwitchCase="'tickets'" class="space-y-5 max-w-2xl">
                <header>
                  <h3 class="text-xl font-semibold">Tickets</h3>
                  <p class="text-sm text-neutral-500">Set free for community walks/talks; otherwise choose pricing tiers.</p>
                </header>
                <div>
                  <label class="inline-flex items-center gap-2 mr-4 text-sm">
                    <input type="radio" [checked]="!isPaid()" (change)="isPaid.set(false)" /> Free
                  </label>
                  <label class="inline-flex items-center gap-2 text-sm">
                    <input type="radio" [checked]="isPaid()" (change)="isPaid.set(true)" /> Paid
                  </label>
                </div>
                <div *ngIf="isPaid()" class="grid grid-cols-2 gap-4">
                  <label class="block">
                    <span class="text-sm font-medium">Early bird price</span>
                    <input type="number" min="0" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="earlyBird()" (ngModelChange)="earlyBird.set($event)" placeholder="MYR" />
                  </label>
                  <label class="block">
                    <span class="text-sm font-medium">General price</span>
                    <input type="number" min="0" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="generalPrice()" (ngModelChange)="generalPrice.set($event)" placeholder="MYR" />
                  </label>
                </div>
              </section>

              <section *ngSwitchCase="'publish'" class="max-w-md">
                <h3 class="text-xl font-semibold mb-3">Ready to publish?</h3>
                <ul class="text-sm text-neutral-700 space-y-1 mb-5">
                  <li>• Title: {{ title() || '—' }}</li>
                  <li>• Mode: {{ mode() }}</li>
                  <li>• Pricing: {{ isPaid() ? 'Paid' : 'Free' }}</li>
                  <li>• Capacity: {{ capacity() || 0 }}</li>
                </ul>
                <button type="button" [disabled]="!canPublish()" [class.opacity-40]="!canPublish()"
                        (click)="publish()" class="px-5 py-2.5 rounded-full bg-neutral-900 text-white font-medium">
                  Publish experience
                </button>
                <a routerLink="/experiences/admin" class="block text-center text-xs text-neutral-500 mt-3">Save as draft →</a>
              </section>
            </ng-container>
          </div>
        </main>
      </div>
    </div>
  `,
})
export class ExperienceCreatePage {
  private readonly router = inject(Router);

  readonly steps: Step[] = [
    { key: 'basics', label: 'Basics' },
    { key: 'session', label: 'Session' },
    { key: 'tickets', label: 'Tickets' },
    { key: 'publish', label: 'Publish' },
  ];
  readonly active = signal<Step['key']>('basics');

  readonly title = signal(''); readonly tagline = signal(''); readonly description = signal('');
  readonly mode = signal<'physical' | 'virtual' | 'hybrid'>('physical');
  readonly city = signal('Kuala Lumpur');
  readonly startsAt = signal(''); readonly endsAt = signal('');
  readonly capacity = signal<number | null>(30);
  readonly isPaid = signal(true);
  readonly earlyBird = signal<number | null>(null);
  readonly generalPrice = signal<number | null>(null);

  readonly canPublish = computed(() =>
    this.title().length > 3 && this.tagline().length > 3 &&
    (this.isPaid() ? (this.generalPrice() ?? 0) > 0 : true),
  );

  publish(): void {
    alert(`Experience "${this.title()}" would be published.`);
    this.router.navigate(['/experiences/admin']);
  }
}
