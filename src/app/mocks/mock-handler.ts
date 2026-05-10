import { HttpRequest } from '@angular/common/http';

import { LEARNER_PROGRESS, PROGRAMS, PROGRAM_MEMBERS } from './programs.fixtures';

/**
 * Returns the mocked payload for a request, or `null` to fall through to the network.
 *
 * Routes are intentionally pattern-matched (not regex-driven) for grep-ability —
 * when the real backend ships, the mock can be removed by environment.useMocks=false.
 */
export function mockHandler(req: HttpRequest<unknown>): unknown | null {
  if (req.method !== 'GET') return null;
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;

  // GET /api/v1/programs?... → list
  if (path.endsWith('/programs')) {
    const search = (url.searchParams.get('search') ?? '').toLowerCase();
    const pricing = url.searchParams.get('pricing');
    const items = PROGRAMS.filter((p) => {
      if (pricing && p.pricing.kind !== pricing) return false;
      if (!search) return true;
      return (
        p.title.toLowerCase().includes(search) ||
        p.tagline.toLowerCase().includes(search) ||
        p.ownerHub.hubName.toLowerCase().includes(search)
      );
    });
    return { items, total: items.length, page: 1, pageSize: items.length };
  }

  // GET /api/v1/programs/:slug
  let m = path.match(/\/programs\/([^/]+)$/);
  if (m) return PROGRAMS.find((p) => p.slug === m![1]) ?? null;

  // GET /api/v1/programs/:slug/curriculum
  m = path.match(/\/programs\/([^/]+)\/curriculum$/);
  if (m) {
    const p = PROGRAMS.find((p) => p.slug === m![1]);
    return p ? p.curriculum : null;
  }

  // GET /api/v1/programs/:slug/members
  m = path.match(/\/programs\/([^/]+)\/members$/);
  if (m) return PROGRAM_MEMBERS[m[1]] ?? [];

  // GET /api/v1/programs/:slug/me/progress
  m = path.match(/\/programs\/([^/]+)\/me\/progress$/);
  if (m) return LEARNER_PROGRESS[m[1]] ?? null;

  // GET /api/v1/auth/me — not mocked: we want the SSO contract to actually fire so the
  // logged-in / logged-out UX works against a real backend during dev.
  return null;
}
