import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'mereka-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-2xl font-semibold">Welcome back</h2>
    <p class="text-sm text-neutral-500 mt-1">Sign in to your Mereka account.</p>

    <form class="mt-6 space-y-4" (submit)="$event.preventDefault(); signIn()">
      <label class="block">
        <span class="text-sm font-medium">Email</span>
        <input type="email" required [ngModel]="email()" (ngModelChange)="email.set($event)" name="email"
               class="mt-1 w-full px-3 py-2.5 rounded border border-neutral-200 focus:outline-none focus:border-neutral-400" />
      </label>
      <label class="block">
        <div class="flex justify-between items-baseline">
          <span class="text-sm font-medium">Password</span>
          <a routerLink="/auth/forgot-password" class="text-xs text-primary-700">Forgot password?</a>
        </div>
        <input type="password" required [ngModel]="password()" (ngModelChange)="password.set($event)" name="password"
               class="mt-1 w-full px-3 py-2.5 rounded border border-neutral-200 focus:outline-none focus:border-neutral-400" />
      </label>
      <p *ngIf="error()" class="text-sm text-error">{{ error() }}</p>
      <button type="submit" [disabled]="loading()" [class.opacity-40]="loading()"
              class="w-full py-2.5 rounded-full bg-neutral-900 text-white font-medium">
        {{ loading() ? 'Signing in…' : 'Sign in' }}
      </button>
    </form>

    <div class="my-6 flex items-center gap-3 text-xs text-neutral-400">
      <hr class="flex-1 border-neutral-200" /><span>or continue with</span><hr class="flex-1 border-neutral-200" />
    </div>
    <div class="grid grid-cols-2 gap-3">
      <button type="button" class="px-3 py-2.5 rounded border border-neutral-200 bg-white text-sm">Google</button>
      <button type="button" class="px-3 py-2.5 rounded border border-neutral-200 bg-white text-sm">LinkedIn</button>
    </div>

    <p class="text-sm text-neutral-600 mt-6 text-center">
      New to Mereka? <a routerLink="/auth/signup" class="text-primary-700 font-medium">Create an account</a>
    </p>
  `,
})
export class LoginPage {
  private readonly router = inject(Router);
  readonly email = signal(''); readonly password = signal('');
  readonly loading = signal(false); readonly error = signal('');
  signIn(): void {
    this.loading.set(true); this.error.set('');
    // Mock: any non-empty form succeeds and bounces to dashboard.
    setTimeout(() => {
      if (!this.email() || this.password().length < 4) {
        this.error.set('Email and password are required (password ≥ 4 chars in demo).');
        this.loading.set(false); return;
      }
      this.router.navigate(['/dashboard']);
    }, 400);
  }
}
