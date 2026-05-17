export type HubRole = 'admin' | 'editor' | 'viewer';
export type CurriculumItemType = 'course' | 'experience' | 'expertise';
export type ProgramStatus = 'draft' | 'published' | 'archived';
export type ProgramPricing =
  | { kind: 'free' }
  | { kind: 'paid'; price: number; currency: 'MYR' | 'USD' | 'SGD' | 'IDR' };

export interface HubRef { hubId: string; hubName: string; hubLogo: string | null; slug?: string; }
export interface ProgramCollaborator { hub: HubRef; role: HubRole; invitedAt: string; acceptedAt?: string; }
export interface CurriculumItem {
  id: string; type: CurriculumItemType; title: string; slug: string; blurb?: string;
  ownerHub: HubRef; isMandatory: boolean; deadline?: string; prerequisiteIds: string[];
  badge?: { name: string; imageUrl: string }; sourceId: string;
}
export type ProgramNavGroup = 'community' | 'learning' | 'events' | 'admin';
export interface ProgramFeedPost {
  id: string; authorName: string; authorAvatar: string | null;
  authorRole?: 'admin' | 'mentor' | 'member'; postedAt: string;
  channel: 'announcement' | 'discussion' | 'feed'; title?: string; body: string;
  reactions?: { emoji: string; count: number }[]; commentCount: number;
}
export interface ProgramMember {
  id: string; name: string; avatar: string | null; isOnline: boolean;
  role?: 'admin' | 'mentor' | 'member'; joinedAt: string; email?: string;
  completionPercent?: number;
}
export interface ProgramTimeline { enrollStart?: string; enrollEnd?: string; startsAt?: string; endsAt?: string; }
export interface Program {
  id: string; slug: string; title: string; tagline: string; description: string;
  coverImageUrl: string; ownerHub: HubRef; collaborators: ProgramCollaborator[];
  pricing: ProgramPricing; status: ProgramStatus; visibility: 'public' | 'private';
  timeline: ProgramTimeline; curriculum: CurriculumItem[];
  stats: { memberCount: number; expertCount: number; mentorCount: number };
  recentPosts: ProgramFeedPost[];
  landing?: ProgramLanding;
}
export interface PaginatedResponse<T> { items: T[]; total: number; page: number; pageSize: number; }
export interface ProgramFilters {
  page?: number; pageSize?: number; search?: string; hubSlug?: string; pricing?: 'free' | 'paid';
}
export interface LearnerProgress {
  programId: string; itemsCompleted: number; itemsTotal: number; percentComplete: number;
  perItem: Record<string, {
    status: 'locked' | 'in_progress' | 'completed' | 'overdue';
    progressPercent: number; lastTouchedAt?: string;
  }>;
}
export interface ProgramReview {
  id: string; reviewer: { name: string; avatar: string | null; completionPercent?: number };
  rating: 1 | 2 | 3 | 4 | 5; title: string; body: string; tags?: string[]; createdAt: string;
}
export interface ProgramFeedback {
  averageRating: number; totalReviews: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>; reviews: ProgramReview[];
}
export interface ProgramAnalytics {
  overview: {
    activeLearners: number; activeLearnersDelta: number;
    retentionRate: number; retentionRateDelta: number;
    completionRate: number; completionRateDelta: number;
    confidenceBoost: number; certificatesIssued: number; npsScore: number;
  };
  composition: { programmes: number; courses: number; experiences: number; expertise: number };
  funnel: { stage: string; count: number; percent: number }[];
  geographic: { country: string; code: string; count: number; percent: number }[];
  cohorts: { id: string; name: string; enrolled: number; active: number; completion: number; avgScore: number }[];
  feedbackSummary: { average: number; total: number };
  monthlyCompletion: { month: string; rate: number }[];
}
export type InboxFolder = 'broadcast' | 'inbox' | 'drafts' | 'sent';
export interface InboxChannel { id: string; name: string; kind: 'channel' | 'direct' | 'managing'; unread: number; }
export interface InboxMessage {
  id: string; authorName: string; authorAvatar: string | null; body: string;
  postedAt: string; isMine: boolean; meta?: string;
}
export interface InboxThread { channelId: string; channelName: string; messages: InboxMessage[]; }
export type ApplicationFormStatus = 'draft' | 'live' | 'closed';
export interface ApplicationForm {
  id: string; title: string; kind: 'interest' | 'application';
  status: ApplicationFormStatus; responseCount: number; updatedAt: string;
}
export interface DashboardListings { services: number; experiences: number; gigs: number; }
export interface DashboardOrder {
  id: string; kind: 'service' | 'experience' | 'gig'; customer: string; expertise?: string;
  bookedAt: string; mode: 'online' | 'in-person';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  amount: number; currency: 'MYR' | 'USD';
}
export interface DashboardSnapshot {
  user: { name: string; avatar: string | null; profileCompletion: number };
  earnings: { amount: number; currency: 'MYR' | 'USD' };
  enrolledPrograms: Program[]; listings: DashboardListings;
  upcomingDeadlines: { programSlug: string; programTitle: string; itemTitle: string; deadline: string }[];
  recentOrders: DashboardOrder[];
}

/* ─────────────── Landing-page specific types ─────────────── */
export interface ProgramPartner { name: string; logoUrl: string; }
export interface ProgramDetails { duration: string; format: string; location: string; targetAudience: string; certificates: string; }
export interface ProgramFeatureCard { icon: string; title: string; description: string; }
export interface ProgramExpert { name: string; title: string; avatarUrl: string; bio?: string; }
export interface ProgramPricingTier { name: string; price: number | 'free'; currency?: string; period?: string; features: string[]; isPopular?: boolean; ctaLabel: string; }
export interface ProgramFaq { question: string; answer: string; }
export interface ProgramLanding {
  partners: ProgramPartner[];
  details: ProgramDetails;
  learningOutcomes: string[];
  features: ProgramFeatureCard[];
  certificationPartner?: ProgramPartner & { description: string };
  experts: ProgramExpert[];
  pricingTiers: ProgramPricingTier[];
  faqs: ProgramFaq[];
}
