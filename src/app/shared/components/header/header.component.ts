import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'mereka-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.auth.user;
  readonly isLoading = this.auth.isLoading;
  readonly isLoggedIn = this.auth.isLoggedIn;

  readonly headerSearch = signal('');

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

  /** Navigate to programs page with search query */
  onSearch(): void {
    const q = this.headerSearch().trim();
    if (q) {
      this.router.navigate(['/programs'], { queryParams: { q } });
    } else {
      this.router.navigate(['/programs']);
    }
    this.headerSearch.set('');
  }

  signOut(): void {
    this.auth.clear();
    this.router.navigate(['/']);
  }
}
