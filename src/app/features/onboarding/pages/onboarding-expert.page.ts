import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { OnboardingShellComponent, type OnboardingStep } from '../components/onboarding-shell.component';

@Component({
  selector: 'mereka-onboarding-expert',
  standalone: true,
  imports: [CommonModule, FormsModule, OnboardingShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mereka-onboarding-shell kind="Expert" title="Become an Expert" [steps]="steps" [active]="active()" (activate)="active.set($event)">
      <ng-container [ngSwitch]="active()">
        <section *ngSwitchCase="'basics'" class="max-w-md space-y-4">
          <h3 class="text-xl font-semibold">Basics</h3>
          <label class="block"><span class="text-sm font-medium">Title</span>
            <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="title()" (ngModelChange)="title.set($event)" name="title" /></label>
          <label class="block"><span class="text-sm font-medium">Short description</span>
            <textarea rows="5" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="desc()" (ngModelChange)="desc.set($event)" name="desc"></textarea></label>
          <button class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm" (click)="active.set('details')">Continue →</button>
        </section>
        <section *ngSwitchCase="'details'" class="max-w-md space-y-4">
          <h3 class="text-xl font-semibold">Add a little more</h3>
          <label class="block"><span class="text-sm font-medium">Categories / skills</span>
            <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" placeholder="e.g. AI, Design" [ngModel]="tags()" (ngModelChange)="tags.set($event)" name="tags" /></label>
          <div class="flex justify-between">
            <button class="text-sm text-neutral-500" (click)="active.set('basics')">← Back</button>
            <button class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm" (click)="active.set('publish')">Continue →</button>
          </div>
        </section>
        <section *ngSwitchCase="'publish'" class="max-w-md">
          <h3 class="text-xl font-semibold">Ready to publish</h3>
          <p class="text-sm text-neutral-500 mt-2">You can polish things further once it's live.</p>
          <button class="mt-6 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm" (click)="finish()">Publish →</button>
        </section>
      </ng-container>
    </mereka-onboarding-shell>
  `,
})
export class OnboardingExpertPage {
  private readonly router = inject(Router);
  readonly steps: OnboardingStep[] = [
    { key: 'basics', label: 'Basics' },
    { key: 'details', label: 'Details' },
    { key: 'publish', label: 'Publish' },
  ];
  readonly active = signal('basics');
  readonly title = signal(''); readonly desc = signal(''); readonly tags = signal('');
  finish(): void { this.router.navigate(['/dashboard']); }
}
