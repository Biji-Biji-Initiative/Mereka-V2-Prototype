import type {
  CurriculumItem,
  HubRef,
  LearnerProgress,
  Program,
  ProgramFeedPost,
  ProgramMember,
} from '../features/programs/models/program.model';

const bijibiji: HubRef = {
  hubId: 'hub_bijibiji',
  hubName: 'Bijibiji Initiative',
  hubLogo: 'https://api.dicebear.com/9.x/initials/svg?seed=Bijibiji',
  slug: 'bijibiji',
};

const microsoft: HubRef = {
  hubId: 'hub_microsoft',
  hubName: 'Microsoft Malaysia',
  hubLogo: 'https://api.dicebear.com/9.x/initials/svg?seed=Microsoft',
  slug: 'microsoft',
};

const hubAi4u: HubRef = {
  hubId: 'hub_ai4u',
  hubName: 'AI4U Collective',
  hubLogo: 'https://api.dicebear.com/9.x/initials/svg?seed=AI4U',
  slug: 'ai4u',
};

const sampleCurriculum: CurriculumItem[] = [
  {
    id: 'item_course_genai',
    type: 'course',
    title: 'Generative AI Fundamentals',
    slug: 'generative-ai-fundamentals',
    blurb: 'Discover the foundations of generative AI and how the tech is transforming…',
    ownerHub: bijibiji,
    isMandatory: true,
    deadline: '2026-06-15',
    prerequisiteIds: [],
    badge: { name: 'GenAI Foundation', imageUrl: '/assets/badges/genai.svg' },
    sourceId: 'course-v1:Mereka+GENAI101+2026',
  },
  {
    id: 'item_exp_imagecrash',
    type: 'experience',
    title: 'Image Gen Crash Course',
    slug: 'image-gen-crash-course',
    blurb: 'Hands-on Saturday workshop with practitioners. 4 hours, in-person KL.',
    ownerHub: bijibiji,
    isMandatory: false,
    prerequisiteIds: ['item_course_genai'],
    sourceId: '6531f1b9c3a2e4001a9b1234',
  },
  {
    id: 'item_expertise_pm',
    type: 'expertise',
    title: 'AI Product Management',
    slug: 'ai-product-management',
    blurb: '1:1 mentoring sessions with senior PMs shipping AI features in production.',
    ownerHub: bijibiji,
    isMandatory: false,
    prerequisiteIds: [],
    sourceId: '6531f1b9c3a2e4001a9b5678',
  },
  {
    id: 'item_course_responsibleai',
    type: 'course',
    title: 'Explore Responsible AI',
    slug: 'explore-responsible-ai',
    blurb: 'Understand and implement responsible AI practices including bias detection.',
    ownerHub: microsoft,
    isMandatory: false,
    prerequisiteIds: [],
    sourceId: 'course-v1:Mereka+RAI201+2026',
  },
];

const samplePosts: ProgramFeedPost[] = [
  {
    id: 'post_welcome',
    authorName: 'Aisha',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aisha',
    authorRole: 'admin',
    postedAt: '2026-05-09T03:00:00Z',
    channel: 'feed',
    title: 'Welcome to AI4U!',
    body: 'Introduce yourself and tell us why you joined this community.',
    reactions: [
      { emoji: '👋', count: 14 },
      { emoji: '🎉', count: 9 },
    ],
    commentCount: 12,
  },
  {
    id: 'post_30day',
    authorName: 'Justin',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Justin',
    authorRole: 'mentor',
    postedAt: '2026-05-08T11:30:00Z',
    channel: 'discussion',
    title: 'The 30 Day Challenge',
    body:
      'I created this challenge to help keep you on track and get quick breakthroughs. ' +
      'Check out the #30dayChallenge — you should be able to complete it with a 1 hour commitment per day.',
    reactions: [
      { emoji: '🔥', count: 22 },
      { emoji: '💪', count: 17 },
    ],
    commentCount: 31,
  },
  {
    id: 'post_chris',
    authorName: 'Chris W',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ChrisW',
    authorRole: 'member',
    postedAt: '2026-05-07T08:15:00Z',
    channel: 'discussion',
    title: 'My Day 7 reflection',
    body: 'Halfway through the 30 day challenge — sharing what worked and what didn’t.',
    reactions: [{ emoji: '👏', count: 6 }],
    commentCount: 4,
  },
];

function makeMember(seed: string, isOnline: boolean, role?: ProgramMember['role']): ProgramMember {
  return {
    id: `member_${seed.toLowerCase().replace(/\s+/g, '_')}`,
    name: seed,
    avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}`,
    isOnline,
    role,
    joinedAt: '2026-04-21T00:00:00Z',
  };
}

const sampleMembers: ProgramMember[] = [
  makeMember('Jessica B', true, 'admin'),
  makeMember('Jason B', true, 'mentor'),
  makeMember('Florence J', true),
  makeMember('Natalie A', true),
  makeMember('Sarah L', true),
  makeMember('Nicholas H', true),
  makeMember('Florence J', false),
  makeMember('Sarah L', false),
  makeMember('Chris W', false),
  makeMember('Natalie A', false),
  makeMember('Florence J', false),
  makeMember('Sarah L', false),
  makeMember('Chris W', false),
  makeMember('Natalie A', false),
  makeMember('Florence J', false),
  makeMember('Sarah L', false),
  makeMember('Chris W', false),
];

export const PROGRAMS: Program[] = [
  {
    id: 'prog_ai4u',
    slug: 'ai4u',
    title: 'AI4U — Practical AI for Everyone',
    tagline: 'A 12-week guided journey from prompts to product.',
    description:
      'AI4U combines self-paced LMS courses, live workshops, and 1:1 mentoring into a single ' +
      'guided program. Build a portfolio piece, get certified, and join a peer cohort of 200+ learners.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=70&auto=format&fit=crop',
    ownerHub: hubAi4u,
    collaborators: [
      {
        hub: bijibiji,
        role: 'editor',
        invitedAt: '2026-04-01',
        acceptedAt: '2026-04-02',
      },
      {
        hub: microsoft,
        role: 'viewer',
        invitedAt: '2026-04-12',
        acceptedAt: '2026-04-14',
      },
    ],
    pricing: { kind: 'paid', price: 1499, currency: 'MYR' },
    status: 'published',
    timeline: {
      enrollStart: '2026-04-15',
      enrollEnd: '2026-05-30',
      startsAt: '2026-06-03',
      endsAt: '2026-08-26',
    },
    curriculum: sampleCurriculum,
    stats: { memberCount: 1713, expertCount: 3, mentorCount: 5 },
    recentPosts: samplePosts,
  },
  {
    id: 'prog_genai_microsoft',
    slug: 'boost-productivity-with-copilot',
    title: 'Boost Your Productivity with Microsoft Copilot',
    tagline: 'Leverage Copilot to streamline workflows.',
    description:
      'Enhance creativity and support professional growth with a 7-module program co-created with Microsoft.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1600&q=70&auto=format&fit=crop',
    ownerHub: microsoft,
    collaborators: [],
    pricing: { kind: 'free' },
    status: 'published',
    timeline: { enrollStart: '2026-05-01' },
    curriculum: sampleCurriculum.slice(0, 2),
    stats: { memberCount: 482, expertCount: 1, mentorCount: 2 },
    recentPosts: samplePosts.slice(0, 1),
  },
  {
    id: 'prog_search',
    slug: 'internet-search-and-beyond',
    title: 'Internet Search & Beyond',
    tagline: 'Master research-quality search and information synthesis.',
    description:
      'A free 5-module course teaching internet search experts and intelligence-grade research skills.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=70&auto=format&fit=crop',
    ownerHub: bijibiji,
    collaborators: [],
    pricing: { kind: 'free' },
    status: 'published',
    timeline: {},
    curriculum: sampleCurriculum.slice(2, 4),
    stats: { memberCount: 219, expertCount: 0, mentorCount: 1 },
    recentPosts: [],
  },
];

export const PROGRAM_MEMBERS: Record<string, ProgramMember[]> = {
  ai4u: sampleMembers,
  'boost-productivity-with-copilot': sampleMembers.slice(0, 6),
  'internet-search-and-beyond': sampleMembers.slice(0, 3),
};

export const LEARNER_PROGRESS: Record<string, LearnerProgress> = {
  ai4u: {
    programId: 'prog_ai4u',
    itemsCompleted: 2,
    itemsTotal: sampleCurriculum.length,
    percentComplete: Math.round((2 / sampleCurriculum.length) * 100),
    perItem: {
      item_course_genai: { status: 'completed', progressPercent: 100 },
      item_exp_imagecrash: { status: 'in_progress', progressPercent: 40 },
      item_expertise_pm: { status: 'locked', progressPercent: 0 },
      item_course_responsibleai: { status: 'locked', progressPercent: 0 },
    },
  },
};
