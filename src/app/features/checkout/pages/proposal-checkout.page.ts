import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'mereka-proposal-checkout', standalone: true, imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[1100px] mx-auto px-6 py-10 grid grid-cols-12 gap-8">
      <main class="col-span-12 md:col-span-7 space-y-6">
        <h1 class="text-2xl font-semibold">Hire freelancer</h1>
        <section class="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
          <h2 class="font-semibold">Engagement details</h2>
          <label class="block"><span class="text-sm font-medium">Project title</span>
            <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="title()" (ngModelChange)="title.set($event)" name="title" /></label>
          <label class="block"><span class="text-sm font-medium">Scope</span>
            <textarea rows="5" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="scope()" (ngModelChange)="scope.set($event)" name="scope"></textarea></label>
          <div class="grid grid-cols-2 gap-4">
            <label class="block"><span class="text-sm font-medium">Start date</span>
              <input type="date" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="start()" (ngModelChange)="start.set($event)" name="start" /></label>
            <label class="block"><span class="text-sm font-medium">Deadline</span>
              <input type="date" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="end()" (ngModelChange)="end.set($event)" name="end" /></label>
          </div>
        </section>
        <section class="bg-white border border-neutral-200 rounded-lg p-6">
          <h2 class="font-semibold mb-3">Milestones</h2>
          <ul class="space-y-2">
            <li *ngFor="let m of milestones(); let i = index" class="grid grid-cols-[1fr_120px_30px] gap-2">
              <input [ngModel]="m.label" (ngModelChange)="m.label = $event" class="px-3 py-2 rounded border border-neutral-200 text-sm" />
              <input type="number" [ngModel]="m.amount" (ngModelChange)="m.amount = $event" class="px-3 py-2 rounded border border-neutral-200 text-sm tabular-nums" />
              <button (click)="remove(i)" class="text-neutral-400 hover:text-error">×</button>
            </li>
          </ul>
          <button type="button" class="mt-3 text-sm text-primary-700" (click)="add()">+ Add milestone</button>
        </section>
      </main>
      <aside class="col-span-12 md:col-span-5">
        <div class="sticky top-20 bg-white border border-neutral-200 rounded-lg p-6">
          <h2 class="font-semibold mb-4">Total</h2>
          <dl class="space-y-1 text-sm">
            <div class="flex justify-between"><dt class="text-neutral-500">Milestones</dt><dd>MYR {{ subtotal() | number: '1.0-0' }}</dd></div>
            <div class="flex justify-between"><dt class="text-neutral-500">Mereka fee (5%)</dt><dd>MYR {{ fee() | number: '1.0-0' }}</dd></div>
            <div class="flex justify-between pt-2 border-t border-neutral-100 font-semibold"><dt>Escrow</dt><dd>MYR {{ total() | number: '1.0-0' }}</dd></div>
          </dl>
          <button (click)="hire()" [disabled]="subtotal() === 0" [class.opacity-40]="subtotal() === 0"
                  class="mt-6 w-full px-4 py-3 rounded-full bg-neutral-900 text-white font-medium">Fund escrow</button>
          <p class="text-[10px] text-neutral-400 mt-2 text-center">Funds released to the freelancer when each milestone is approved.</p>
        </div>
      </aside>
    </div>
  `,
})
export class ProposalCheckoutPage {
  private readonly router = inject(Router);
  readonly title = signal(''); readonly scope = signal('');
  readonly start = signal(''); readonly end = signal('');
  readonly milestones = signal<{ label: string; amount: number }[]>([
    { label: 'Kickoff & wireframes', amount: 1000 },
    { label: 'Final delivery', amount: 2000 },
  ]);
  readonly subtotal = computed(() => this.milestones().reduce((s, m) => s + (Number(m.amount) || 0), 0));
  readonly fee = computed(() => Math.round(this.subtotal() * 0.05));
  readonly total = computed(() => this.subtotal() + this.fee());
  add(): void { this.milestones.update((ms) => [...ms, { label: '', amount: 0 }]); }
  remove(i: number): void { this.milestones.update((ms) => ms.filter((_, idx) => idx !== i)); }
  hire(): void { this.router.navigate(['/checkout/success']); }
}
