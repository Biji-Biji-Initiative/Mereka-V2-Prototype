import { Injectable, computed, signal } from '@angular/core';
import { DASHBOARD } from '../../../mocks/programs.fixtures';

/**
 * Prototype-only enrollment state. In production this would come from
 * GET /api/v1/me/programs (already typed on ProgramsService.myPrograms())
 * but for the demo we keep it client-side so 'Join Program' on the
 * landing page can flip the flag and the route guard sees it immediately.
 */
@Injectable({ providedIn: 'root' })
export class EnrollmentStore {
  private readonly _slugs = signal<Set<string>>(
    new Set(DASHBOARD.enrolledPrograms.map((p) => p.slug)),
  );
  readonly slugs = computed(() => Array.from(this._slugs()));

  isEnrolled(slug: string): boolean {
    return this._slugs().has(slug);
  }
  enroll(slug: string): void {
    this._slugs.update((s) => new Set([...s, slug]));
  }
  unenroll(slug: string): void {
    this._slugs.update((s) => {
      const n = new Set(s); n.delete(slug); return n;
    });
  }
}
