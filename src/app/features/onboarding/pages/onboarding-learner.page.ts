import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { OnboardingShellComponent, type OnboardingStep } from '../components/onboarding-shell.component';

@Component({
  selector: 'mereka-onboarding-learner',
  standalone: true,
  imports: [CommonModule, FormsModule, OnboardingShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mereka-onboarding-shell kind="Learner" title="Welcome to Mereka" [steps]="steps" [active]="active()" (activate)="active.set($event)">
      <ng-container [ngSwitch]="active()">
        <section *ngSwitchCase="'profile'" class="max-w-md space-y-4">
          <h3 class="text-xl font-semibold">Tell us about yourself</h3>
          <label class="block">
            <span class="text-sm font-medium">Full name</span>
            <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="name()" (ngModelChange)="name.set($event)" name="name" />
          </label>
          <label class="block">
            <span class="text-sm font-medium">Where are you based?</span>
            <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" placeholder="Kuala Lumpur, Malaysia" [ngModel]="city()" (ngModelChange)="city.set($event)" name="city" />
          </label>
          <label class="block">
            <span class="text-sm font-medium">Short bio</span>
            <textarea rows="4" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="bio()" (ngModelChange)="bio.set($event)" name="bio"></textarea>
          </label>
          <button type="button" class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm" (click)="active.set('interests')">Continue →</button>
        </section>
        <section *ngSwitchCase="'interests'" class="max-w-2xl">
          <h3 class="text-xl font-semibold">What are you interested in?</h3>
          <p class="text-sm text-neutral-500 mb-4">Pick up to 5 to personalise your home feed.</p>
          <ul class="flex flex-wrap gap-2">
            <li *ngFor="let i of interestOptions">
              <button type="button" class="px-3 py-1.5 rounded-full border text-sm"
                      [class.bg-neutral-900]="picked().includes(i)" [class.text-white]="picked().includes(i)"
                      [class.border-neutral-200]="!picked().includes(i)"
                      (click)="toggle(i)">{{ i }}</button>
            </li>
          </ul>
          <div class="mt-6 flex justify-between">
            <button class="text-sm text-neutral-500" (click)="active.set('profile')">← Back</button>
            <button class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm" (click)="active.set('finish')">Continue →</button>
          </div>
        </section>
        <section *ngSwitchCase="'finish'" class="max-w-md">
          <h3 class="text-xl font-semibold">You're all set, {{ name() || 'friend' }} 🎉</h3>
          <p class="text-sm text-neutral-500 mt-2">Your home feed is being built. Head to the dashboard to see your first recommendations.</p>
          <button type="button" class="mt-6 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm" (click)="finish()">Go to dashboard</button>
        </section>
      </ng-container>
    </mereka-onboarding-shell>
  `,
})
export class OnboardingLearnerPage {
  private readonly router = inject(Router);
  readonly steps: OnboardingStep[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'interests', label: 'Interests' },
    { key: 'finish', label: 'Finish' },
  ];
  readonly active = signal('profile');
  readonly name = signal(''); readonly city = signal(''); readonly bio = signal('');
  readonly interestOptions = ['Generative AI', 'Design', 'Engineering', 'Climate', 'Funding', 'Leadership', 'Marketing', 'Operations'];
  readonly picked = signal<string[]>([]);
  toggle(i: string): void {
    this.picked.update((p) => p.includes(i) ? p.filter((x) => x !== i) : (p.length >= 5 ? p : [...p, i]));
  }
  finish(): void { this.router.navigate(['/dashboard']); }
}
