import type { HubRef } from '../../programs/models/program.model';
export type { HubRef };

/* ─── Common ──────────────────────────────────────────────────────────── */

export type Currency = 'MYR' | 'USD' | 'SGD' | 'IDR';

export interface PaginatedResponse<T> {
  items: T[]; total: number; page: number; pageSize: number;
}

/* ─── Experience ──────────────────────────────────────────────────────── */

export type ExperienceMode = 'physical' | 'virtual' | 'hybrid';

export interface ExperienceTicket {
  id: string;
  name: string;
  /** e.g. "Early bird" or "General admission" */
  description?: string;
  price: number;
  currency: Currency;
  /** Max tickets in stock for this tier; -1 means unlimited. */
  capacity: number;
  /** Tickets already sold (drives the "X left" UI). */
  sold: number;
}

export interface ExperienceSlot {
  id: string;
  startsAt: string;     // ISO
  endsAt: string;       // ISO
  timeZone: string;     // IANA tz
  ticketsAvailable: number;
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  coverImageUrl: string;
  gallery?: string[];
  /** "Mereka categories" the user can browse by */
  themes: string[];
  mode: ExperienceMode;
  hub: HubRef;
  /** Optional location for physical/hybrid experiences. */
  location?: { city: string; country: string; venue?: string };
  /** Free is allowed: pricing[0].price === 0. */
  tickets: ExperienceTicket[];
  /** Upcoming sessions a learner can book. */
  slots: ExperienceSlot[];
  rating: { average: number; total: number };
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
}

/* ─── Expertise (1:1 mentoring sessions) ───────────────────────────────── */

export type ExpertiseFormat = '1:1' | 'group';

export interface ExpertiseSlot {
  id: string;
  startsAt: string;
  endsAt: string;
  /** Slot is booked when bookedBy is set. */
  bookedBy?: string;
}

export interface Expertise {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  coverImageUrl: string;
  expertName: string;
  expertAvatar: string;
  expertBio: string;
  hub: HubRef;
  format: ExpertiseFormat;
  /** Duration of a single session in minutes. */
  sessionMinutes: number;
  pricePerSession: number;
  currency: Currency;
  themes: string[];
  rating: { average: number; total: number };
  upcomingSlots: ExpertiseSlot[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
}

/* ─── Gigs (jobs) ──────────────────────────────────────────────────────── */

export type GigEngagement = 'one-off' | 'part-time' | 'full-time' | 'contract';
export type GigRemote = 'remote' | 'on-site' | 'hybrid';

export interface Gig {
  id: string;
  slug: string;
  title: string;
  hub: HubRef;
  description: string;
  /** Required skills, surfaced as chips. */
  skills: string[];
  engagement: GigEngagement;
  remote: GigRemote;
  budget: { min: number; max: number; currency: Currency; period: 'project' | 'hour' | 'month' };
  /** Application count for the admin view; learner side just sees count when applying. */
  applicantCount: number;
  postedAt: string;
  /** ISO; expired gigs are hidden from /gigs but shown in admin/edit. */
  expiresAt: string;
  status: 'draft' | 'open' | 'closed';
}

export interface GigApplicant {
  id: string;
  name: string;
  avatar: string;
  appliedAt: string;
  proposal: string;
  rateOffer?: { amount: number; currency: Currency; period: 'project' | 'hour' };
  status: 'new' | 'shortlisted' | 'declined' | 'hired';
}

/* ─── Cart / Checkout / Orders ─────────────────────────────────────────── */

export type CartKind = 'experience' | 'expertise' | 'program';

export interface CartItem {
  id: string;
  kind: CartKind;
  /** Display title at the time of adding. */
  title: string;
  /** Generic sub-line — e.g. ticket name + slot, expertise format, etc. */
  subtitle: string;
  thumbnail: string;
  unitPrice: number;
  currency: Currency;
  quantity: number;
  /** For analytics / discount eligibility: the owning hub. */
  hub: HubRef;
}

export interface Order {
  id: string;
  placedAt: string;
  items: CartItem[];
  subtotal: number;
  fees: number;
  discount: number;
  total: number;
  currency: Currency;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  /** Stripe-style fake receipt URL. */
  receiptUrl?: string;
}

/* ─── Hub (public profile) ─────────────────────────────────────────────── */

export interface HubProfile {
  hubId: string;
  slug: string;
  name: string;
  logo: string;
  banner: string;
  tagline: string;
  about: string;
  location: { city: string; country: string };
  founded: string; // ISO date
  programCount: number;
  experienceCount: number;
  expertiseCount: number;
  memberCount: number;
}
