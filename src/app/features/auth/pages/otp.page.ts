import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'mereka-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-2xl font-semibold">Enter your one-time code</h2>
    <p class="text-sm text-neutral-500 mt-1">We sent a 6-digit code to your email. It expires in 10 minutes.</p>
    <form class="mt-8" (submit)="$event.preventDefault(); verify()">
      <input #otpInput class="w-full text-center tracking-[0.4em] text-2xl font-mono px-3 py-3 rounded border border-neutral-200 focus:outline-none focus:border-neutral-400"
             maxlength="6" inputmode="numeric" pattern="\\d{6}"
             [ngModel]="code()" (ngModelChange)="code.set($event)" name="code" />
      <button type="submit" [disabled]="!isValid()" [class.opacity-40]="!isValid()"
              class="mt-6 w-full py-2.5 rounded-full bg-neutral-900 text-white font-medium">Verify</button>
    </form>
    <button type="button" class="mt-4 w-full text-sm text-neutral-500 hover:text-neutral-900">Resend code</button>
  `,
})
export class OtpPage {
  private readonly router = inject(Router);
  readonly code = signal('');
  isValid(): boolean { return /^\d{6}$/.test(this.code()); }
  verify(): void { if (this.isValid()) this.router.navigate(['/dashboard']); }
}
