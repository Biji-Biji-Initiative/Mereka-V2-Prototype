import { HttpRequest } from '@angular/common/http';
import {
  DASHBOARD, LEARNER_PROGRESS, PROGRAMS, PROGRAM_ANALYTICS,
  PROGRAM_FEEDBACK, PROGRAM_FORMS, PROGRAM_INBOX_CHANNELS,
  PROGRAM_INBOX_THREADS, PROGRAM_MEMBERS,
} from './programs.fixtures';

export function mockHandler(req: HttpRequest<unknown>): unknown | null {
  if (req.method !== 'GET') return null;
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;

  if (path.endsWith('/programs')) {
    const search = (url.searchParams.get('search') ?? '').toLowerCase();
    const pricing = url.searchParams.get('pricing');
    const items = PROGRAMS.filter((p) => {
      if (pricing && p.pricing.kind !== pricing) return false;
      if (!search) return true;
      return p.title.toLowerCase().includes(search) ||
        p.tagline.toLowerCase().includes(search) ||
        p.ownerHub.hubName.toLowerCase().includes(search);
    });
    return { items, total: items.length, page: 1, pageSize: items.length };
  }
  let m: RegExpMatchArray | null;
  if ((m = path.match(/\/programs\/([^/]+)$/))) return PROGRAMS.find((p) => p.slug === m![1]) ?? null;
  if ((m = path.match(/\/programs\/([^/]+)\/curriculum$/))) {
    const p = PROGRAMS.find((p) => p.slug === m![1]); return p ? p.curriculum : null;
  }
  if ((m = path.match(/\/programs\/([^/]+)\/members$/))) return PROGRAM_MEMBERS[m[1]] ?? [];
  if ((m = path.match(/\/programs\/([^/]+)\/me\/progress$/))) return LEARNER_PROGRESS[m[1]] ?? null;
  if ((m = path.match(/\/programs\/([^/]+)\/feedback$/))) return PROGRAM_FEEDBACK[m[1]] ?? null;
  if ((m = path.match(/\/programs\/([^/]+)\/analytics$/))) return PROGRAM_ANALYTICS[m[1]] ?? null;
  if ((m = path.match(/\/programs\/([^/]+)\/inbox\/channels$/))) return PROGRAM_INBOX_CHANNELS[m[1]] ?? [];
  if ((m = path.match(/\/programs\/([^/]+)\/inbox\/threads\/([^/]+)$/))) return PROGRAM_INBOX_THREADS[m[2]] ?? null;
  if ((m = path.match(/\/programs\/([^/]+)\/forms$/))) return PROGRAM_FORMS[m[1]] ?? [];
  if (path.endsWith('/me/dashboard')) return DASHBOARD;
  if (path.endsWith('/me/programs')) return DASHBOARD.enrolledPrograms;
  if (path.endsWith('/me/hubs/programs')) return PROGRAMS;
  return null;
}
