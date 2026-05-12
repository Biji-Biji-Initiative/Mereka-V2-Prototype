import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { PlanFeatureService } from './plan-feature.service';

export const analyticsPlanGuard: CanMatchFn = () => {
  const plans = inject(PlanFeatureService);
  if (plans.canAccessAnalytics()) return true;
  const router = inject(Router);
  return router.createUrlTree(['/dashboard'], { queryParams: { upgrade: 'analytics' } });
};
