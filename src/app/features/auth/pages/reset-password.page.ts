import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'mereka-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-2xl font-semibold">Set a new password</h2>
    <p class="text-sm text-neutral-500 mt-1">Pick something you'll remember — 8+ chars with at least one number.</p>
    <form class="mt-6 space-y-4" (submit)="$event.preventDefault(); save()">
      <label class="block">
        <span class="text-sm font-medium">New password</span>
        <input type="password" required minlength="8" [ngModel]="pw1()" (ngModelChange)="pw1.set($event)" name="pw1" class="mt-1 w-full px-3 py-2.5 rounded border border-neutral-200" />
      </label>
      <label class="block">
        <span class="text-sm font-medium">Confirm password</span>
        <input type="password" required [ngModel]="pw2()" (ngModelChange)="pw2.set($event)" name="pw2" class="mt-1 w-full px-3 py-2.5 rounded border border-neutral-200" />
        <span *ngIf="mismatch()" class="text-xs text-error mt-1 block">Passwords don't match.</span>
      </label>
      <button type="submit" [disabled]="!canSubmit()" [class.opacity-40]="!canSubmit()" class="w-full py-2.5 rounded-full bg-neutral-900 text-white font-medium">Save password</button>
    </form>
    <p class="text-sm text-neutral-600 mt-6 text-center"><a routerLink="/auth/login" class="text-primary-700 font-medium">Back to sign in</a></p>
  `,
})
export class ResetPasswordPage {
  private readonly router = inject(Router);
  readonly pw1 = signal(''); readonly pw2 = signal('');
  readonly mismatch = computed(() => this.pw2().length > 0 && this.pw1() !== this.pw2());
  canSubmit(): boolean { return this.pw1().length >= 8 && this.pw1() === this.pw2(); }
  save(): void { if (this.canSubmit()) this.router.navigate(['/auth/login']); }
}
