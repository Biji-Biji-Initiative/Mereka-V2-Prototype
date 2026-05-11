import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'mereka-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.auth.user;
  readonly isLoading = this.auth.isLoading;
  readonly isLoggedIn = this.auth.isLoggedIn;

  /** Initials shown when the avatar URL is missing (matches workspace UI pattern). */
  readonly initials = computed(() => {
    const u = this.user();
    if (!u) return '';
    return u.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('');
  });

  signOut(): void {
    this.auth.clear();
    this.router.navigate(['/programs']);
  }
}
