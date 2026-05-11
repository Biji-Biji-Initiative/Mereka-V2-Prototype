import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'mereka-accept-invite',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-2xl font-semibold">You're invited to Mereka</h2>
    <p class="text-sm text-neutral-500 mt-1">Token: <span class="font-mono text-xs bg-neutral-100 px-2 py-0.5 rounded">{{ token() }}</span></p>
    <div class="mt-6 p-5 rounded-lg bg-program-hero-end/40 border border-program-hero-end">
      <p class="text-sm"><span class="font-medium">Aisha (AI4U Collective)</span> has invited you to join their hub as a <span class="font-medium">collaborator</span>.</p>
    </div>
    <div class="mt-6 grid grid-cols-2 gap-3">
      <button type="button" class="px-4 py-2.5 rounded-full border border-neutral-200" (click)="decline()">Decline</button>
      <button type="button" class="px-4 py-2.5 rounded-full bg-neutral-900 text-white" (click)="accept()">Accept invite</button>
    </div>
    <p class="text-sm text-neutral-600 mt-6 text-center">Not signed in? <a routerLink="/auth/login" class="text-primary-700 font-medium">Sign in first</a></p>
  `,
})
export class AcceptInvitePage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly token = toSignal(this.route.paramMap.pipe(map((p) => p.get('token') ?? '')), { initialValue: '' });
  accept(): void { this.router.navigate(['/dashboard']); }
  decline(): void { this.router.navigate(['/']); }
}
