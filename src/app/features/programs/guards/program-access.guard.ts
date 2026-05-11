import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { EnrollmentStore } from '../services/enrollment.store';

/**
 * Gates /programs/:slug (the community shell):
 *   - Guest → redirect to /programs/:slug/landing
 *   - Logged-in but not enrolled → redirect to /programs/:slug/landing
 *   - Logged-in + enrolled → render feed/curriculum/members as normal
 */
export const programAccessGuard: CanActivateFn = (route) => {
  const slug = route.paramMap.get('slug');
  if (!slug) return true;

  const router = inject(Router);
  const auth = inject(AuthService);
  const store = inject(EnrollmentStore);

  if (!auth.isLoggedIn()) return router.createUrlTree(['/programs', slug, 'landing']);
  if (!store.isEnrolled(slug)) return router.createUrlTree(['/programs', slug, 'landing']);
  return true;
};
