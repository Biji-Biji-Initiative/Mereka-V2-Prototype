import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mereka-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-2xl font-semibold">Forgot your password?</h2>
    <p class="text-sm text-neutral-500 mt-1">Enter the email associated with your Mereka account and we'll send a reset link.</p>
    <form *ngIf="!sent()" class="mt-6 space-y-4" (submit)="$event.preventDefault(); send()">
      <label class="block">
        <span class="text-sm font-medium">Email</span>
        <input type="email" required [ngModel]="email()" (ngModelChange)="email.set($event)" name="email" class="mt-1 w-full px-3 py-2.5 rounded border border-neutral-200" />
      </label>
      <button type="submit" class="w-full py-2.5 rounded-full bg-neutral-900 text-white font-medium">Send reset link</button>
    </form>
    <div *ngIf="sent()" class="mt-6 bg-success/10 border border-success/30 rounded-md p-5 text-sm">
      ✓ Reset link sent. Check your inbox — links expire in 30 minutes.
    </div>
    <p class="text-sm text-neutral-600 mt-6 text-center">
      Remember your password? <a routerLink="/auth/login" class="text-primary-700 font-medium">Sign in</a>
    </p>
  `,
})
export class ForgotPasswordPage {
  readonly email = signal(''); readonly sent = signal(false);
  send(): void { if (this.email().includes('@')) this.sent.set(true); }
}
