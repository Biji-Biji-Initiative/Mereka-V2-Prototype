import type {
  ApplicationForm, CurriculumItem, DashboardSnapshot, HubRef,
  InboxChannel, InboxThread, LearnerProgress, Program, ProgramAnalytics,
  ProgramFeedPost, ProgramFeedback, ProgramMember,
} from '../features/programs/models/program.model';

const bijibiji: HubRef = { hubId: 'hub_bijibiji', hubName: 'Bijibiji Initiative', hubLogo: 'https://api.dicebear.com/9.x/initials/svg?seed=Bijibiji', slug: 'bijibiji' };
const microsoft: HubRef = { hubId: 'hub_microsoft', hubName: 'Microsoft Malaysia', hubLogo: 'https://api.dicebear.com/9.x/initials/svg?seed=Microsoft', slug: 'microsoft' };
const hubAi4u: HubRef = { hubId: 'hub_ai4u', hubName: 'AI4U Collective', hubLogo: 'https://api.dicebear.com/9.x/initials/svg?seed=AI4U', slug: 'ai4u' };

const sampleCurriculum: CurriculumItem[] = [
  { id: 'item_course_genai', type: 'course', title: 'Generative AI Fundamentals', slug: 'generative-ai-fundamentals', blurb: 'Discover the foundations of generative AI.', ownerHub: bijibiji, isMandatory: true, deadline: '2026-06-15', prerequisiteIds: [], badge: { name: 'GenAI Foundation', imageUrl: '/assets/badges/genai.svg' }, sourceId: 'course-v1:Mereka+GENAI101+2026' },
  { id: 'item_exp_imagecrash', type: 'experience', title: 'Image Gen Crash Course', slug: 'image-gen-crash-course', blurb: 'Hands-on Saturday workshop. 4 hours, KL.', ownerHub: bijibiji, isMandatory: false, prerequisiteIds: ['item_course_genai'], sourceId: '6531f1b9c3a2e4001a9b1234' },
  { id: 'item_expertise_pm', type: 'expertise', title: 'AI Product Management', slug: 'ai-product-management', blurb: '1:1 mentoring with senior AI PMs.', ownerHub: bijibiji, isMandatory: false, prerequisiteIds: [], sourceId: '6531f1b9c3a2e4001a9b5678' },
  { id: 'item_course_responsibleai', type: 'course', title: 'Explore Responsible AI', slug: 'explore-responsible-ai', blurb: 'Bias detection and responsible AI.', ownerHub: microsoft, isMandatory: false, prerequisiteIds: [], sourceId: 'course-v1:Mereka+RAI201+2026' },
  { id: 'item_course_promptcraft', type: 'course', title: 'Prompt Craft for Builders', slug: 'prompt-craft-for-builders', blurb: 'From "asking ChatGPT" to shipping prompts.', ownerHub: hubAi4u, isMandatory: true, deadline: '2026-07-01', prerequisiteIds: ['item_course_genai'], sourceId: 'course-v1:Mereka+PROMPT201+2026' },
];

const samplePosts: ProgramFeedPost[] = [
  { id: 'post_welcome', authorName: 'Aisha', authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aisha', authorRole: 'admin', postedAt: '2026-05-09T03:00:00Z', channel: 'announcement', title: 'Welcome to AI4U!', body: 'Introduce yourself and tell us why you joined this community.', reactions: [{ emoji: '👋', count: 14 }, { emoji: '🎉', count: 9 }], commentCount: 12 },
  { id: 'post_30day', authorName: 'Justin', authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Justin', authorRole: 'mentor', postedAt: '2026-05-08T11:30:00Z', channel: 'discussion', title: 'The 30 Day Challenge', body: 'I created this challenge to help keep you on track and get quick breakthroughs.', reactions: [{ emoji: '🔥', count: 22 }, { emoji: '💪', count: 17 }], commentCount: 31 },
  { id: 'post_chris', authorName: 'Chris W', authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ChrisW', authorRole: 'member', postedAt: '2026-05-07T08:15:00Z', channel: 'discussion', title: 'My Day 7 reflection', body: 'Halfway through the 30 day challenge.', reactions: [{ emoji: '👏', count: 6 }], commentCount: 4 },
  { id: 'post_feed_demo', authorName: 'Florence J', authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=FlorenceJ', authorRole: 'member', postedAt: '2026-05-06T16:00:00Z', channel: 'feed', body: 'Quick demo of the image-gen technique we covered yesterday.', reactions: [{ emoji: '🙌', count: 9 }], commentCount: 8 },
];

function makeMember(seed: string, isOnline: boolean, role?: ProgramMember['role'], completionPercent?: number): ProgramMember {
  return { id: 'member_' + seed.toLowerCase().replace(/\s+/g, '_'), name: seed, avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=' + encodeURIComponent(seed), isOnline, role, joinedAt: '2026-04-21T00:00:00Z', email: seed.toLowerCase().replace(/\s+/g, '') + '@example.com', completionPercent };
}

const sampleMembers: ProgramMember[] = [
  makeMember('Jessica B', true, 'admin', 100), makeMember('Jason B', true, 'mentor', 90),
  makeMember('Florence J', true, 'member', 65), makeMember('Natalie A', true, 'member', 70),
  makeMember('Sarah L', true, 'member', 40), makeMember('Nicholas H', true, 'member', 32),
  makeMember('Marcus Lee', false, 'member', 78), makeMember('Elena Rodrigues', false, 'member', 88),
  makeMember('Jordan Smith', false, 'member', 22), makeMember('Chris W', false, 'member', 55),
];

export const PROGRAMS: Program[] = [
  { id: 'prog_ai4u', slug: 'ai4u', title: 'AI4U — Practical AI for Everyone', tagline: 'A 12-week guided journey from prompts to product.', description: 'AI4U combines self-paced LMS courses, live workshops, and 1:1 mentoring into a single guided program.', coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=70&auto=format&fit=crop', ownerHub: hubAi4u, collaborators: [{ hub: bijibiji, role: 'editor', invitedAt: '2026-04-01', acceptedAt: '2026-04-02' }, { hub: microsoft, role: 'viewer', invitedAt: '2026-04-12', acceptedAt: '2026-04-14' }], pricing: { kind: 'paid', price: 1499, currency: 'MYR' }, status: 'published', visibility: 'public', timeline: { enrollStart: '2026-04-15', enrollEnd: '2026-05-30', startsAt: '2026-06-03', endsAt: '2026-08-26' }, curriculum: sampleCurriculum, stats: { memberCount: 1713, expertCount: 3, mentorCount: 5 }, recentPosts: samplePosts },
  { id: 'prog_genai_microsoft', slug: 'boost-productivity-with-copilot', title: 'Boost Your Productivity with Microsoft Copilot', tagline: 'Leverage Copilot to streamline workflows.', description: '7-module program co-created with Microsoft.', coverImageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1600&q=70&auto=format&fit=crop', ownerHub: microsoft, collaborators: [], pricing: { kind: 'free' }, status: 'published', visibility: 'public', timeline: { enrollStart: '2026-05-01' }, curriculum: sampleCurriculum.slice(0, 2), stats: { memberCount: 482, expertCount: 1, mentorCount: 2 }, recentPosts: samplePosts.slice(0, 2) },
  { id: 'prog_search', slug: 'internet-search-and-beyond', title: 'Internet Search & Beyond', tagline: 'Master research-quality search.', description: 'Free 5-module course teaching research skills.', coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=70&auto=format&fit=crop', ownerHub: bijibiji, collaborators: [], pricing: { kind: 'free' }, status: 'draft', visibility: 'private', timeline: {}, curriculum: sampleCurriculum.slice(2, 4), stats: { memberCount: 219, expertCount: 0, mentorCount: 1 }, recentPosts: [] },
];

export const PROGRAM_MEMBERS: Record<string, ProgramMember[]> = {
  ai4u: sampleMembers,
  'boost-productivity-with-copilot': sampleMembers.slice(0, 6),
  'internet-search-and-beyond': sampleMembers.slice(0, 3),
};

export const LEARNER_PROGRESS: Record<string, LearnerProgress> = {
  ai4u: {
    programId: 'prog_ai4u', itemsCompleted: 2, itemsTotal: sampleCurriculum.length,
    percentComplete: Math.round((2 / sampleCurriculum.length) * 100),
    perItem: {
      item_course_genai: { status: 'completed', progressPercent: 100 },
      item_exp_imagecrash: { status: 'in_progress', progressPercent: 40 },
      item_expertise_pm: { status: 'locked', progressPercent: 0 },
      item_course_responsibleai: { status: 'locked', progressPercent: 0 },
      item_course_promptcraft: { status: 'locked', progressPercent: 0 },
    },
  },
};

export const PROGRAM_FEEDBACK: Record<string, ProgramFeedback> = {
  ai4u: {
    averageRating: 4.5, totalReviews: 1538,
    ratingDistribution: { 5: 1010, 4: 320, 3: 130, 2: 50, 1: 28 },
    reviews: [
      { id: 'r1', reviewer: { name: 'Florence Jones', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=FJones', completionPercent: 92 }, rating: 5, title: 'Very insightful and practical', body: 'The course was easy to follow and the speakers were very knowledgeable.', tags: ['comprehensive', 'engaging'], createdAt: '2026-04-12' },
      { id: 'r2', reviewer: { name: 'Natalie Andrew', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=NatalieA', completionPercent: 85 }, rating: 5, title: 'A great learning community', body: 'One of the best parts was being able to interact with other participants.', tags: ['community'], createdAt: '2026-04-08' },
      { id: 'r3', reviewer: { name: 'Marcus Lee', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=MarcusL', completionPercent: 100 }, rating: 5, title: 'Engaging content', body: 'Modules were well-structured and kept me engaged.', tags: ['engaging'], createdAt: '2026-04-05' },
      { id: 'r4', reviewer: { name: 'Elena Rodrigues', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ElenaR', completionPercent: 88 }, rating: 5, title: 'Transformative experience', body: 'This program exceeded my expectations in every way.', tags: ['transformative'], createdAt: '2026-04-03' },
      { id: 'r5', reviewer: { name: 'Jordan Smith', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=JordanS', completionPercent: 30 }, rating: 3, title: 'Good start but needs improvement', body: 'I found the initial modules helpful but some areas felt rushed.', tags: ['needs-improvement'], createdAt: '2026-03-30' },
    ],
  },
};

export const PROGRAM_ANALYTICS: Record<string, ProgramAnalytics> = {
  ai4u: {
    overview: { activeLearners: 1509, activeLearnersDelta: 12, retentionRate: 67, retentionRateDelta: 4, completionRate: 67, completionRateDelta: -2, confidenceBoost: 412, certificatesIssued: 72, npsScore: 47 },
    composition: { programmes: 14, courses: 68, experiences: 56, expertise: 94 },
    funnel: [
      { stage: 'Impressions', count: 18420, percent: 100 },
      { stage: 'Visitors', count: 9210, percent: 50 },
      { stage: 'Registered', count: 2480, percent: 13.5 },
      { stage: 'Applied', count: 1800, percent: 9.8 },
      { stage: 'Enrolled', count: 1713, percent: 9.3 },
      { stage: 'Active', count: 1509, percent: 8.2 },
      { stage: 'Completed', count: 723, percent: 3.9 },
    ],
    geographic: [
      { country: 'Malaysia', code: 'MY', count: 921, percent: 60 },
      { country: 'Singapore', code: 'SG', count: 184, percent: 12 },
      { country: 'Indonesia', code: 'ID', count: 138, percent: 9 },
      { country: 'Philippines', code: 'PH', count: 92, percent: 6 },
      { country: 'Vietnam', code: 'VN', count: 77, percent: 5 },
    ],
    cohorts: [
      { id: 'C1', name: 'AI4U Cohort 2025 Jan', enrolled: 220, active: 198, completion: 76, avgScore: 81 },
      { id: 'C2', name: 'AI4U Cohort 2025 Feb', enrolled: 280, active: 244, completion: 70, avgScore: 79 },
      { id: 'C3', name: 'AI4U Cohort 2025 Mar', enrolled: 332, active: 286, completion: 68, avgScore: 78 },
      { id: 'C4', name: 'AI4U Cohort 2025 Apr', enrolled: 405, active: 351, completion: 64, avgScore: 76 },
      { id: 'C5', name: 'AI4U Cohort 2025 May', enrolled: 476, active: 430, completion: 60, avgScore: 74 },
    ],
    feedbackSummary: { average: 4.5, total: 1538 },
    monthlyCompletion: [
      { month: 'Dec', rate: 58 }, { month: 'Jan', rate: 61 }, { month: 'Feb', rate: 63 },
      { month: 'Mar', rate: 66 }, { month: 'Apr', rate: 67 }, { month: 'May', rate: 69 },
    ],
  },
};

export const PROGRAM_INBOX_CHANNELS: Record<string, InboxChannel[]> = {
  ai4u: [
    { id: 'ch_announcements', name: 'Announcements', kind: 'channel', unread: 0 },
    { id: 'ch_product_design', name: 'Product design', kind: 'channel', unread: 3 },
    { id: 'mng_hiring', name: 'Hiring: Senior Frontend Dev', kind: 'managing', unread: 0 },
    { id: 'dm_florence', name: 'Florence Jones', kind: 'direct', unread: 3 },
    { id: 'dm_gurpreet', name: 'Gurpreet Singh', kind: 'direct', unread: 0 },
    { id: 'dm_mereka_admin', name: 'Mereka admin', kind: 'direct', unread: 0 },
    { id: 'dm_design_group', name: 'Design group', kind: 'direct', unread: 2 },
  ],
};

export const PROGRAM_INBOX_THREADS: Record<string, InboxThread> = {
  dm_florence: {
    channelId: 'dm_florence', channelName: 'Florence Jones',
    messages: [
      { id: 'm1', authorName: 'You', authorAvatar: null, isMine: true, postedAt: '2026-05-09T07:00:00Z', body: 'Hi! 👋 Welcome to the Product Design Bootcamp. You\'re officially enrolled 🎉 Your first session starts on 12 March, 7:00 PM.', meta: 'Program enrolment message' },
      { id: 'm2', authorName: 'Florence Jones', authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=FlorenceJ', isMine: false, postedAt: '2026-05-09T07:08:00Z', body: 'Hi! Got it, thank you 🙂' },
      { id: 'm3', authorName: 'You', authorAvatar: null, isMine: true, postedAt: '2026-05-09T07:12:00Z', body: 'No problem! Let me know if you have any questions.' },
    ],
  },
  ch_product_design: {
    channelId: 'ch_product_design', channelName: 'Product design',
    messages: [
      { id: 'p1', authorName: 'Aisha (Admin)', authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aisha', isMine: false, postedAt: '2026-05-09T08:00:00Z', body: 'Reminder: Module 3 critique session tomorrow at 7pm. Bring your draft posters!' },
      { id: 'p2', authorName: 'Jason B', authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=JasonB', isMine: false, postedAt: '2026-05-09T08:10:00Z', body: 'Quick question — can we use Figma or do we need to bring printouts?' },
    ],
  },
};

export const PROGRAM_FORMS: Record<string, ApplicationForm[]> = {
  ai4u: [
    { id: 'f1', title: 'AI4U June 2026 — Interest Form', kind: 'interest', status: 'live', responseCount: 482, updatedAt: '2026-05-04' },
    { id: 'f2', title: 'AI4U June 2026 — Application', kind: 'application', status: 'live', responseCount: 167, updatedAt: '2026-05-09' },
    { id: 'f3', title: 'AI4U March 2026 — Application', kind: 'application', status: 'closed', responseCount: 1290, updatedAt: '2026-03-15' },
  ],
};

export const DASHBOARD: DashboardSnapshot = {
  user: { name: 'Nicholas Hon', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=NicholasH', profileCompletion: 40 },
  earnings: { amount: 1000, currency: 'USD' },
  enrolledPrograms: [PROGRAMS[0], PROGRAMS[1]],
  listings: { services: 0, experiences: 1, gigs: 0 },
  upcomingDeadlines: [
    { programSlug: 'ai4u', programTitle: 'AI4U — Practical AI for Everyone', itemTitle: 'Generative AI Fundamentals — Final Project', deadline: '2026-06-15' },
    { programSlug: 'ai4u', programTitle: 'AI4U — Practical AI for Everyone', itemTitle: 'Prompt Craft for Builders — Week 2 Quiz', deadline: '2026-06-22' },
  ],
  recentOrders: [
    { id: 'ord_001', kind: 'experience', customer: 'Marcus Lee', expertise: 'Image Gen Crash Course', bookedAt: '2026-05-04', mode: 'in-person', status: 'in_progress', amount: 240, currency: 'MYR' },
  ],
};
