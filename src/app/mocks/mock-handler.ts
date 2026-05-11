import { HttpRequest } from '@angular/common/http';
import {
  DASHBOARD, LEARNER_PROGRESS, PROGRAMS, PROGRAM_ANALYTICS,
  PROGRAM_FEEDBACK, PROGRAM_FORMS, PROGRAM_INBOX_CHANNELS,
  PROGRAM_INBOX_THREADS, PROGRAM_MEMBERS,
} from './programs.fixtures';
import {
  EXPERIENCES, EXPERTISES, GIGS, GIG_APPLICANTS, HUBS, ORDERS,
} from './marketplace.fixtures';

export function mockHandler(req: HttpRequest<unknown>): unknown | null {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;

  if (req.method === 'GET') {
    /* ─── Programs ─── */
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
    if ((m = path.match(/\/programs\/([^/]+)\/curriculum$/))) { const p = PROGRAMS.find((p) => p.slug === m![1]); return p ? p.curriculum : null; }
    if ((m = path.match(/\/programs\/([^/]+)\/members$/))) return PROGRAM_MEMBERS[m[1]] ?? [];
    if ((m = path.match(/\/programs\/([^/]+)\/me\/progress$/))) return LEARNER_PROGRESS[m[1]] ?? null;
    if ((m = path.match(/\/programs\/([^/]+)\/feedback$/))) return PROGRAM_FEEDBACK[m[1]] ?? null;
    if ((m = path.match(/\/programs\/([^/]+)\/analytics$/))) return PROGRAM_ANALYTICS[m[1]] ?? null;
    if ((m = path.match(/\/programs\/([^/]+)\/inbox\/channels$/))) return PROGRAM_INBOX_CHANNELS[m[1]] ?? [];
    if ((m = path.match(/\/programs\/([^/]+)\/inbox\/threads\/([^/]+)$/))) return PROGRAM_INBOX_THREADS[m[2]] ?? null;
    if ((m = path.match(/\/programs\/([^/]+)\/forms$/))) return PROGRAM_FORMS[m[1]] ?? [];

    /* ─── Experiences ─── */
    if (path.endsWith('/experiences')) {
      const search = (url.searchParams.get('search') ?? '').toLowerCase();
      const mode = url.searchParams.get('mode');
      const items = EXPERIENCES.filter((e) => {
        if (mode && e.mode !== mode) return false;
        if (!search) return true;
        return e.title.toLowerCase().includes(search) || e.tagline.toLowerCase().includes(search);
      });
      return { items, total: items.length, page: 1, pageSize: items.length };
    }
    if ((m = path.match(/\/experiences\/([^/]+)$/))) return EXPERIENCES.find((e) => e.slug === m![1]) ?? null;
    if (path.endsWith('/me/experiences')) return EXPERIENCES.filter((_, i) => i < 2);

    /* ─── Expertise ─── */
    if (path.endsWith('/expertise')) {
      const search = (url.searchParams.get('search') ?? '').toLowerCase();
      const items = EXPERTISES.filter((e) => !search ||
        e.title.toLowerCase().includes(search) || e.expertName.toLowerCase().includes(search));
      return { items, total: items.length, page: 1, pageSize: items.length };
    }
    if ((m = path.match(/\/expertise\/([^/]+)$/))) return EXPERTISES.find((e) => e.slug === m![1]) ?? null;
    if (path.endsWith('/me/expertise')) return EXPERTISES.filter((_, i) => i < 2);

    /* ─── Gigs ─── */
    if (path.endsWith('/gigs')) {
      const search = (url.searchParams.get('search') ?? '').toLowerCase();
      const engagement = url.searchParams.get('engagement');
      const items = GIGS.filter((g) => {
        if (engagement && g.engagement !== engagement) return false;
        if (!search) return true;
        return g.title.toLowerCase().includes(search) || g.skills.join(' ').toLowerCase().includes(search);
      });
      return { items, total: items.length, page: 1, pageSize: items.length };
    }
    if ((m = path.match(/\/gigs\/([^/]+)\/applicants$/))) return GIG_APPLICANTS[m[1]] ?? [];
    if ((m = path.match(/\/gigs\/([^/]+)$/))) return GIGS.find((g) => g.slug === m![1]) ?? null;
    if (path.endsWith('/me/gigs')) return GIGS;

    /* ─── Hubs ─── */
    if (path.endsWith('/hubs')) return { items: HUBS, total: HUBS.length, page: 1, pageSize: HUBS.length };
    if ((m = path.match(/\/hubs\/([^/]+)$/))) return HUBS.find((h) => h.slug === m![1]) ?? null;

    /* ─── Orders ─── */
    if (path.endsWith('/me/orders')) return ORDERS;
    if ((m = path.match(/\/me\/orders\/([^/]+)$/))) return ORDERS.find((o) => o.id === m![1]) ?? null;

    /* ─── Me ─── */
    if (path.endsWith('/me/dashboard')) return DASHBOARD;
    if (path.endsWith('/me/programs')) return DASHBOARD.enrolledPrograms;
    if (path.endsWith('/me/hubs/programs')) return PROGRAMS;
  }

  // POST mocks return the request body wrapped as an entity for the few flows that need it.
  if (req.method === 'POST') {
    if (path.endsWith('/checkout/intent')) {
      // Pretend Stripe gave us a PaymentIntent. Reply with a fake client secret.
      return { clientSecret: 'pi_mock_' + Math.random().toString(36).slice(2, 10) + '_secret_test' };
    }
    if (path.endsWith('/checkout/confirm')) {
      const body = (req.body ?? {}) as { items?: unknown[]; total?: number; currency?: string };
      return {
        id: 'ord_' + Math.random().toString(36).slice(2, 8),
        placedAt: new Date().toISOString(),
        items: body.items ?? [], subtotal: body.total ?? 0, fees: 0, discount: 0,
        total: body.total ?? 0, currency: body.currency ?? 'MYR', status: 'paid',
        receiptUrl: 'https://pay.stripe.com/receipts/mock',
      };
    }
  }

  return null;
}
