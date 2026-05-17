/**
 * Programs domain model.
 *
 * Programs combine three reusable Mereka primitives:
 *   • Course   — fetched from mereka-lms (Open edX `/api/courses/v1/courses/{course_id}`)
 *   • Experience — owned by mereka-backend-v2 (`/api/v1/experiences/:slug`)
 *   • Expertise  — owned by mereka-backend-v2 (`/api/v1/expertises/:slug`)
 *
 * A Program belongs to one *owning* Hub, and may have *collaborating* Hubs (each
 * carrying a role — admin / editor / viewer). Free programs unlock all included
 * content for enrolled learners; paid programs treat the program price as the
 * single all-in fee (the included course/experience/expertise prices are absorbed).
 */

export type HubRole = 'admin' | 'editor' | 'viewer';

export type CurriculumItemType = 'course' | 'experience' | 'expertise';

export type ProgramStatus = 'draft' | 'published' | 'archived';

export type ProgramPricing =
  | { kind: 'free' }
  | { kind: 'paid'; price: number; currency: 'MYR' | 'USD' | 'SGD' | 'IDR' };

export interface HubRef {
  hubId: string;
  hubName: string;
  hubLogo: string | null;
  /** A short slug used in /hubs/:slug — handy for cross-linking */
  slug?: string;
}

export interface ProgramCollaborator {
  hub: HubRef;
  role: HubRole;
  invitedAt: string; // ISO
  acceptedAt?: string; // ISO; absent until invitation is accepted
}

export interface CurriculumItem {
  id: string;
  type: CurriculumItemType;

  /** Human-readable title shown in feed cards and curriculum tables. */
  title: string;

  /** Slug used to deep-link out to the source surface (LMS course page, experience page, etc.). */
  slug: string;

  /** Short blurb shown in the inventory drawer during program creation. */
  blurb?: string;

  /** Owning hub — informational only; the program may belong to a different hub. */
  ownerHub: HubRef;

  /** True if learners must complete this item to graduate from the program. */
  isMandatory: boolean;

  /** ISO deadline. Absent = no deadline. */
  deadline?: string;

  /** Other curriculum item IDs that must be completed before this one unlocks. */
  prerequisiteIds: string[];

  /** Optional badge/certificate awarded on completion. */
  badge?: { name: string; imageUrl: string };

  /**
   * Type-specific source ID:
   *  - course   → Open edX course key e.g. "course-v1:Mereka+AI101+2026"
   *  - experience → Mongo ObjectId from mereka-backend-v2
   *  - expertise  → Mongo ObjectId from mereka-backend-v2
   */
  sourceId: string;
}

/** Sidebar navigation entries for the Program profile. Designs label them under three groups. */
export type ProgramNavGroup = 'community' | 'learning' | 'events';

export interface ProgramFeedPost {
  id: string;
  authorName: string;
  authorAvatar: string | null;
  authorRole?: 'admin' | 'mentor' | 'member';
  postedAt: string; // ISO
  channel: 'announcement' | 'discussion' | 'feed';
  title?: string;
  body: string;
  reactions?: { emoji: string; count: number }[];
  commentCount: number;
}

export interface ProgramMember {
  id: string;
  name: string;
  avatar: string | null;
  isOnline: boolean;
  role?: 'admin' | 'mentor' | 'member';
  /** ISO date the user joined the program. */
  joinedAt: string;
}

export interface ProgramTimeline {
  /** ISO — first day learners can join. */
  enrollStart?: string;
  /** ISO — last day to enroll. */
  enrollEnd?: string;
  /** ISO — program officially begins. */
  startsAt?: string;
  /** ISO — program ends. */
  endsAt?: string;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  coverImageUrl: string;

  ownerHub: HubRef;
  collaborators: ProgramCollaborator[];

  pricing: ProgramPricing;
  status: ProgramStatus;
  timeline: ProgramTimeline;

  /** Stable, ordered list — drives the curriculum table and locks/unlocks. */
  curriculum: CurriculumItem[];

  /** Aggregates surfaced by the feed and profile pages. */
  stats: {
    memberCount: number;
    expertCount: number;
    mentorCount: number;
  };

  /** Latest community posts shown on the Feed tab. */
  recentPosts: ProgramFeedPost[];
}

/** Pagination wrapper used by list endpoints. */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Filters accepted by the program list endpoint — kept narrow on purpose. */
export interface ProgramFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  hubSlug?: string;
  pricing?: 'free' | 'paid';
}

/** Learner-facing progress snapshot used by the curriculum overview page. */
export interface LearnerProgress {
  programId: string;
  itemsCompleted: number;
  itemsTotal: number;
  percentComplete: number;
  perItem: Record<
    string,
    {
      status: 'locked' | 'in_progress' | 'completed' | 'overdue';
      progressPercent: number;
      lastTouchedAt?: string;
    }
  >;
}
