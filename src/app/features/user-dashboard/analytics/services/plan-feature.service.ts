import { Injectable, signal } from '@angular/core';

export type MerekaPlan = 'free' | 'spark' | 'scale' | 'soar';

// Analytics is a Scale/Soar feature per the brief — keep the gate centralised so
// other premium surfaces can reuse it.
const ANALYTICS_PLANS: ReadonlySet<MerekaPlan> = new Set(['scale', 'soar']);

@Injectable({ providedIn: 'root' })
export class PlanFeatureService {
  // Defaulting to 'scale' so the route is reachable in dev; replace with the real
  // session source once the auth/plan API is wired.
  readonly currentPlan = signal<MerekaPlan>('scale');

  canAccessAnalytics(): boolean {
    return ANALYTICS_PLANS.has(this.currentPlan());
  }
}
