import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'mereka-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly auth = inject(AuthService);

  readonly user = this.auth.user;
  readonly isLoading = this.auth.isLoading;
  readonly isLoggedIn = this.auth.isLoggedIn;

  readonly authUrl = environment.appUrls.auth;
  readonly appUrl = environment.appUrls.app;

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

  loginUrl(): string {
    return this.auth.loginUrl();
  }

  async signOut(): Promise<void> {
    await this.auth.logout();
    window.location.href = this.appUrl;
  }
}
