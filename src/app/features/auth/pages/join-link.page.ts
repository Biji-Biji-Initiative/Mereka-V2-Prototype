import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'mereka-join-link',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="text-2xl font-semibold">Joining via shared link</h2>
    <p class="text-sm text-neutral-500 mt-1">Token: <span class="font-mono text-xs bg-neutral-100 px-2 py-0.5 rounded">{{ token() }}</span></p>
    <p class="text-sm text-neutral-700 mt-6">Click below to attach this invitation to your account.</p>
    <button type="button" class="mt-6 w-full px-4 py-2.5 rounded-full bg-neutral-900 text-white" (click)="redeem()">Redeem invite</button>
  `,
})
export class JoinLinkPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly token = toSignal(this.route.paramMap.pipe(map((p) => p.get('token') ?? '')), { initialValue: '' });
  redeem(): void { this.router.navigate(['/dashboard']); }
}
