import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'mereka-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-2xl font-semibold">Create your account</h2>
    <p class="text-sm text-neutral-500 mt-1">Free to join. No credit card required.</p>
    <form class="mt-6 space-y-4" (submit)="$event.preventDefault(); signup()">
      <label class="block">
        <span class="text-sm font-medium">I want to</span>
        <div class="mt-1 grid grid-cols-2 gap-2 text-sm">
          <button type="button" class="px-3 py-2 rounded border" [class.border-neutral-900]="role() === 'learner'" [class.border-neutral-200]="role() !== 'learner'" (click)="role.set('learner')">Learn / book</button>
          <button type="button" class="px-3 py-2 rounded border" [class.border-neutral-900]="role() === 'hub'" [class.border-neutral-200]="role() !== 'hub'" (click)="role.set('hub')">Run a hub</button>
        </div>
      </label>
      <label class="block">
        <span class="text-sm font-medium">Full name</span>
        <input type="text" required [ngModel]="name()" (ngModelChange)="name.set($event)" name="name" class="mt-1 w-full px-3 py-2.5 rounded border border-neutral-200" />
      </label>
      <label class="block">
        <span class="text-sm font-medium">Email</span>
        <input type="email" required [ngModel]="email()" (ngModelChange)="email.set($event)" name="email" class="mt-1 w-full px-3 py-2.5 rounded border border-neutral-200" />
      </label>
      <label class="block">
        <span class="text-sm font-medium">Password</span>
        <input type="password" required minlength="8" [ngModel]="password()" (ngModelChange)="password.set($event)" name="password" class="mt-1 w-full px-3 py-2.5 rounded border border-neutral-200" />
        <span class="text-xs text-neutral-500 mt-1 block">8+ characters with a number.</span>
      </label>
      <label class="flex items-start gap-2 text-xs text-neutral-600">
        <input type="checkbox" required [ngModel]="agree()" (ngModelChange)="agree.set($event)" name="agree" class="mt-0.5" />
        <span>I agree to Mereka's <a class="text-primary-700">Terms of Use</a> and <a class="text-primary-700">Privacy Policy</a>.</span>
      </label>
      <button type="submit" [disabled]="!canSubmit()" [class.opacity-40]="!canSubmit()" class="w-full py-2.5 rounded-full bg-neutral-900 text-white font-medium">Create account</button>
    </form>
    <p class="text-sm text-neutral-600 mt-6 text-center">
      Already a Mereka member? <a routerLink="/auth/login" class="text-primary-700 font-medium">Sign in</a>
    </p>
  `,
})
export class SignupPage {
  private readonly router = inject(Router);
  readonly role = signal<'learner' | 'hub'>('learner');
  readonly name = signal(''); readonly email = signal('');
  readonly password = signal(''); readonly agree = signal(false);
  canSubmit(): boolean {
    return this.name().length > 1 && this.email().includes('@') && this.password().length >= 8 && this.agree();
  }
  signup(): void {
    if (!this.canSubmit()) return;
    // After signup, route into onboarding for the chosen role.
    this.router.navigate(['/onboarding', this.role()]);
  }
}
