import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mereka-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="text-center">
      <div class="w-16 h-16 rounded-full bg-info/10 text-info text-3xl flex items-center justify-center mx-auto">📬</div>
      <h2 class="text-2xl font-semibold mt-5">Check your inbox</h2>
      <p class="text-sm text-neutral-500 mt-2 max-w-sm mx-auto">
        We've sent a verification link to your email. Click the link to activate your Mereka account.
      </p>
      <button type="button" class="mt-6 text-sm text-primary-700 font-medium" (click)="resend()">
        {{ resent() ? 'Sent again ✓' : 'Resend verification email' }}
      </button>
      <p class="text-xs text-neutral-500 mt-8">Wrong email? <a routerLink="/auth/signup" class="text-primary-700">Start over →</a></p>
    </div>
  `,
})
export class VerifyEmailPage {
  readonly resent = signal(false);
  resend(): void { this.resent.set(true); setTimeout(() => this.resent.set(false), 3000); }
}
