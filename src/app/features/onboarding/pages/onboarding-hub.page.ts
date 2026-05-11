import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { OnboardingShellComponent, type OnboardingStep } from '../components/onboarding-shell.component';

@Component({
  selector: 'mereka-onboarding-hub',
  standalone: true,
  imports: [CommonModule, FormsModule, OnboardingShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mereka-onboarding-shell kind="Hub" title="Set up your hub" [steps]="steps" [active]="active()" (activate)="active.set($event)">
      <ng-container [ngSwitch]="active()">
        <section *ngSwitchCase="'details'" class="max-w-md space-y-4">
          <h3 class="text-xl font-semibold">Hub details</h3>
          <label class="block"><span class="text-sm font-medium">Hub name</span>
            <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="name()" (ngModelChange)="name.set($event)" name="name" /></label>
          <label class="block"><span class="text-sm font-medium">Tagline</span>
            <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="tagline()" (ngModelChange)="tagline.set($event)" name="tagline" /></label>
          <label class="block"><span class="text-sm font-medium">City</span>
            <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="city()" (ngModelChange)="city.set($event)" name="city" /></label>
          <button class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm" (click)="active.set('about')">Continue →</button>
        </section>
        <section *ngSwitchCase="'about'" class="max-w-lg space-y-4">
          <h3 class="text-xl font-semibold">About your hub</h3>
          <label class="block"><span class="text-sm font-medium">What does your hub focus on?</span>
            <textarea rows="6" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="about()" (ngModelChange)="about.set($event)" name="about"></textarea></label>
          <div class="flex justify-between">
            <button class="text-sm text-neutral-500" (click)="active.set('details')">← Back</button>
            <button class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm" (click)="active.set('pricing')">Continue →</button>
          </div>
        </section>
        <section *ngSwitchCase="'pricing'" class="max-w-md space-y-4">
          <h3 class="text-xl font-semibold">Pricing plan</h3>
          <p class="text-sm text-neutral-500">Mereka takes 10% on bookings; we cover Stripe fees on plans above Starter.</p>
          <div class="space-y-3">
            <button type="button" class="w-full text-left p-4 rounded border" [class.border-neutral-900]="plan() === 'starter'" [class.border-neutral-200]="plan() !== 'starter'" (click)="plan.set('starter')">
              <div class="font-medium">Starter — Free</div>
              <div class="text-xs text-neutral-500">Up to 5 listings, Mereka branding shown.</div>
            </button>
            <button type="button" class="w-full text-left p-4 rounded border" [class.border-neutral-900]="plan() === 'pro'" [class.border-neutral-200]="plan() !== 'pro'" (click)="plan.set('pro')">
              <div class="font-medium">Pro — MYR 199/mo</div>
              <div class="text-xs text-neutral-500">Unlimited listings, custom branding, priority support.</div>
            </button>
          </div>
          <div class="flex justify-between">
            <button class="text-sm text-neutral-500" (click)="active.set('about')">← Back</button>
            <button class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm" (click)="active.set('confirm')">Continue →</button>
          </div>
        </section>
        <section *ngSwitchCase="'confirm'" class="max-w-md">
          <h3 class="text-xl font-semibold">Confirm and launch</h3>
          <ul class="mt-3 space-y-1 text-sm">
            <li>• Hub: <strong>{{ name() || '—' }}</strong></li>
            <li>• City: {{ city() || '—' }}</li>
            <li>• Plan: <strong class="capitalize">{{ plan() }}</strong></li>
          </ul>
          <button class="mt-6 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm" (click)="finish()">Launch hub →</button>
        </section>
      </ng-container>
    </mereka-onboarding-shell>
  `,
})
export class OnboardingHubPage {
  private readonly router = inject(Router);
  readonly steps: OnboardingStep[] = [
    { key: 'details', label: 'Details' },
    { key: 'about', label: 'About' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'confirm', label: 'Confirm' },
  ];
  readonly active = signal('details');
  readonly name = signal(''); readonly tagline = signal(''); readonly city = signal(''); readonly about = signal('');
  readonly plan = signal<'starter' | 'pro'>('starter');
  finish(): void { this.router.navigate(['/dashboard']); }
}
