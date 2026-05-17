import type {
  CurriculumItem,
  HubRef,
  LearnerProgress,
  Program,
  ProgramFeedPost,
  ProgramLanding,
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

const hubMdec: HubRef = {
  hubId: 'hub_mdec',
  hubName: 'MDEC',
  hubLogo: 'https://api.dicebear.com/9.x/initials/svg?seed=MDEC',
  slug: 'mdec',
};

const hubGrab: HubRef = {
  hubId: 'hub_grab',
  hubName: 'Grab Malaysia',
  hubLogo: 'https://api.dicebear.com/9.x/initials/svg?seed=Grab',
  slug: 'grab',
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

/* ─────────────── Landing page data per program ─────────────── */

const landingAi4u: ProgramLanding = {
  partners: [
    { name: 'Bijibiji Initiative', logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Bijibiji' },
    { name: 'Microsoft', logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Microsoft' },
    { name: 'Google', logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Google' },
    { name: 'MDEC', logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=MDEC' },
  ],
  details: {
    duration: '12 weeks',
    format: 'Hybrid (online + in-person)',
    location: 'Mereka Space, KL + Online',
    targetAudience: 'Working professionals, career switchers, students',
    certificates: 'AI4U Certificate of Completion + GenAI Foundation Badge',
  },
  learningOutcomes: [
    'Build AI-powered applications using modern frameworks',
    'Write effective prompts for LLMs and image generators',
    'Evaluate and mitigate AI bias in real-world systems',
    'Manage AI product development lifecycle',
    'Design responsible AI governance policies',
    'Create portfolio-ready AI projects',
  ],
  features: [
    { icon: '📚', title: 'Self-Paced Courses', description: 'Learn at your own speed with structured modules on our LMS platform.' },
    { icon: '🎯', title: 'Live Workshops', description: 'Hands-on sessions led by practitioners every Saturday.' },
    { icon: '👤', title: '1:1 Mentoring', description: 'Get personalised guidance from senior AI professionals.' },
    { icon: '🏆', title: 'Industry Certification', description: 'Earn recognised certificates upon program completion.' },
  ],
  certificationPartner: {
    name: 'AI4U Collective',
    logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=AI4U',
    description: 'AI4U Collective is a leading AI education body in Southeast Asia, providing industry-recognised certifications.',
  },
  experts: [
    { name: 'Dr. Sarah Chen', title: 'AI Research Lead, Google DeepMind', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=SarahChen', bio: '10+ years in machine learning research with published papers in NeurIPS and ICML.' },
    { name: 'Aisha Rahman', title: 'Head of AI, Bijibiji Initiative', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aisha', bio: 'Former Microsoft AI engineer, now leading AI education initiatives across SEA.' },
    { name: 'Justin Lim', title: 'Senior PM, Microsoft Malaysia', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Justin', bio: 'Product manager shipping Copilot features to millions of enterprise users.' },
    { name: 'Priya Nair', title: 'ML Engineer, Grab', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Priya', bio: 'Building production ML systems serving 100M+ users across Southeast Asia.' },
  ],
  pricingTiers: [
    {
      name: 'Standard',
      price: 1499,
      currency: 'MYR',
      features: [
        'All 4 course modules',
        'Live workshop access',
        'Community forum access',
        'Certificate of Completion',
        'Lifetime material access',
      ],
      ctaLabel: 'Enroll Now',
    },
    {
      name: 'Premium',
      price: 2499,
      currency: 'MYR',
      isPopular: true,
      features: [
        'Everything in Standard',
        '4x 1:1 mentoring sessions',
        'Portfolio review by experts',
        'Priority workshop seating',
        'LinkedIn recommendation',
        'Job placement support',
      ],
      ctaLabel: 'Get Premium',
    },
  ],
  faqs: [
    { question: 'Do I need coding experience to join AI4U?', answer: 'No coding experience is required. The program starts from fundamentals and builds up progressively. However, basic computer literacy is expected.' },
    { question: 'What tools and software will I need?', answer: 'A laptop with internet access is all you need. All tools used in the program are either free or provided with your enrollment.' },
    { question: 'Can I attend workshops remotely?', answer: 'Yes, all workshops are available via live stream. In-person attendance at Mereka Space KL is optional but recommended for networking.' },
    { question: 'Is the certificate recognised by employers?', answer: 'Yes, the AI4U certificate is co-issued with our industry partners and recognised by major employers in Malaysia and the region.' },
    { question: 'What is the refund policy?', answer: 'Full refund within 14 days of enrollment if you have not completed more than 20% of the course materials.' },
  ],
};

const landingCopilot: ProgramLanding = {
  partners: [
    { name: 'Microsoft', logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Microsoft' },
    { name: 'Mereka', logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Mereka' },
  ],
  details: {
    duration: '4 weeks',
    format: 'Fully online, self-paced',
    location: 'Online',
    targetAudience: 'Office workers, managers, team leads',
    certificates: 'Microsoft Copilot Productivity Certificate',
  },
  learningOutcomes: [
    'Automate repetitive tasks using Microsoft Copilot',
    'Write effective prompts for Copilot in Word, Excel, and PowerPoint',
    'Streamline email management with Copilot in Outlook',
    'Build automated workflows with Power Automate + Copilot',
    'Analyse data faster using Copilot in Excel',
    'Create professional presentations in minutes',
  ],
  features: [
    { icon: '💻', title: 'Hands-On Labs', description: 'Practice with real Microsoft 365 environments and Copilot.' },
    { icon: '📋', title: 'Templates & Cheat Sheets', description: 'Ready-to-use prompt templates for every M365 app.' },
    { icon: '🎥', title: 'Video Walkthroughs', description: 'Step-by-step video guides you can revisit any time.' },
    { icon: '✅', title: 'Skill Assessment', description: 'Validate your Copilot skills with a final assessment.' },
  ],
  certificationPartner: {
    name: 'Microsoft',
    logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Microsoft',
    description: 'Earn a Microsoft-endorsed certificate that validates your proficiency in AI-powered productivity tools.',
  },
  experts: [
    { name: 'James Ong', title: 'Microsoft MVP, Productivity', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=JamesOng', bio: 'Microsoft Most Valuable Professional for 5 consecutive years, specialising in M365 adoption.' },
    { name: 'Lisa Tan', title: 'Digital Transformation Lead', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=LisaTan', bio: 'Helped 50+ companies in APAC adopt Microsoft Copilot and AI-first workflows.' },
  ],
  pricingTiers: [
    {
      name: 'Free Access',
      price: 'free',
      features: [
        'All 7 course modules',
        'Prompt templates library',
        'Community forum access',
        'Certificate of Completion',
        'Lifetime material access',
      ],
      ctaLabel: 'Enroll for Free',
    },
    {
      name: 'Pro (with Live Sessions)',
      price: 499,
      currency: 'MYR',
      isPopular: true,
      features: [
        'Everything in Free Access',
        '2x live Q&A sessions with experts',
        'Hands-on lab environment',
        'Priority support',
        'Team progress dashboard',
      ],
      ctaLabel: 'Upgrade to Pro',
    },
  ],
  faqs: [
    { question: 'Is this program really free?', answer: 'Yes, the self-paced modules and certificate are completely free, co-sponsored by Microsoft Malaysia. The optional Pro tier adds live sessions and lab access.' },
    { question: 'Do I need a Microsoft 365 subscription?', answer: 'A free Microsoft account is sufficient for most modules. Some advanced labs require a Microsoft 365 Business subscription (a free trial is available).' },
    { question: 'How much time should I dedicate per week?', answer: 'About 3-4 hours per week for 4 weeks. All content is self-paced so you can go faster or slower.' },
    { question: 'Can my whole team join?', answer: 'Absolutely. We offer team enrollment with a shared progress dashboard for managers. Contact us for team pricing on the Pro tier.' },
    { question: 'Will the content be updated as Copilot evolves?', answer: 'Yes, enrolled learners get access to all future content updates at no additional cost.' },
  ],
};

/* ─── Multi-hub program curriculum — each hub contributes modules ─── */

const multiHubCurriculum: CurriculumItem[] = [
  // Lead hub (Bijibiji) — core foundation modules
  {
    id: 'mh_course_digital_literacy',
    type: 'course',
    title: 'Digital Literacy Foundations',
    slug: 'digital-literacy-foundations',
    blurb: 'Core digital skills: cloud tools, collaboration platforms, and digital safety.',
    ownerHub: bijibiji,
    isMandatory: true,
    prerequisiteIds: [],
    badge: { name: 'Digital Ready', imageUrl: '/assets/badges/digital-ready.svg' },
    sourceId: 'course-v1:Mereka+DL101+2026',
  },
  {
    id: 'mh_exp_design_thinking',
    type: 'experience',
    title: 'Design Thinking Workshop',
    slug: 'design-thinking-workshop',
    blurb: '2-day in-person workshop at Mereka Space KL. Learn human-centred design.',
    ownerHub: bijibiji,
    isMandatory: true,
    prerequisiteIds: ['mh_course_digital_literacy'],
    sourceId: '6531f1b9c3a2e4001a9c1111',
  },
  // Supporting hub (Microsoft) — AI & productivity modules
  {
    id: 'mh_course_ai_productivity',
    type: 'course',
    title: 'AI-Powered Productivity',
    slug: 'ai-powered-productivity',
    blurb: 'Master Microsoft Copilot and AI tools for workplace efficiency.',
    ownerHub: microsoft,
    isMandatory: true,
    prerequisiteIds: ['mh_course_digital_literacy'],
    badge: { name: 'AI Productivity', imageUrl: '/assets/badges/ai-productivity.svg' },
    sourceId: 'course-v1:Mereka+AIP201+2026',
  },
  {
    id: 'mh_course_cloud_fundamentals',
    type: 'course',
    title: 'Cloud Computing Essentials',
    slug: 'cloud-computing-essentials',
    blurb: 'Azure fundamentals: deploy, manage, and scale cloud applications.',
    ownerHub: microsoft,
    isMandatory: false,
    prerequisiteIds: [],
    sourceId: 'course-v1:Mereka+CLOUD101+2026',
  },
  // Supporting hub (AI4U) — AI specialisation
  {
    id: 'mh_course_applied_ai',
    type: 'course',
    title: 'Applied AI for Business',
    slug: 'applied-ai-for-business',
    blurb: 'Build AI solutions for real business problems: chatbots, analytics, automation.',
    ownerHub: hubAi4u,
    isMandatory: true,
    prerequisiteIds: ['mh_course_ai_productivity'],
    badge: { name: 'Applied AI', imageUrl: '/assets/badges/applied-ai.svg' },
    sourceId: 'course-v1:Mereka+AAI301+2026',
  },
  {
    id: 'mh_expertise_ai_mentoring',
    type: 'expertise',
    title: 'AI Career Mentoring',
    slug: 'ai-career-mentoring',
    blurb: '1:1 sessions with AI industry professionals for career guidance.',
    ownerHub: hubAi4u,
    isMandatory: false,
    prerequisiteIds: [],
    sourceId: '6531f1b9c3a2e4001a9c2222',
  },
  // Supporting hub (MDEC) — policy & ecosystem
  {
    id: 'mh_course_digital_economy',
    type: 'course',
    title: 'Malaysia Digital Economy Blueprint',
    slug: 'digital-economy-blueprint',
    blurb: 'Understand MyDIGITAL initiatives, grants, and ecosystem opportunities.',
    ownerHub: hubMdec,
    isMandatory: false,
    prerequisiteIds: [],
    sourceId: 'course-v1:Mereka+MDE101+2026',
  },
];

const multiHubPosts: ProgramFeedPost[] = [
  {
    id: 'mhpost_launch',
    authorName: 'Faiz Soemawilaga',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Faiz',
    authorRole: 'admin',
    postedAt: '2026-05-12T09:00:00Z',
    channel: 'announcement',
    title: 'Digital Skills Accelerator is LIVE!',
    body: 'Excited to announce our biggest multi-hub program yet! Bijibiji Initiative is leading this program with Microsoft, AI4U Collective, and MDEC contributing specialised modules. Together we are upskilling 3,000+ Malaysians in digital and AI skills.',
    reactions: [
      { emoji: '🚀', count: 48 },
      { emoji: '🎉', count: 32 },
      { emoji: '🇲🇾', count: 21 },
    ],
    commentCount: 67,
  },
  {
    id: 'mhpost_microsoft',
    authorName: 'Lisa Tan',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=LisaTan',
    authorRole: 'mentor',
    postedAt: '2026-05-11T14:30:00Z',
    channel: 'feed',
    title: 'Microsoft modules are now available',
    body: 'The AI-Powered Productivity and Cloud Computing Essentials modules from Microsoft are now live. These cover Copilot, Azure basics, and real-world enterprise scenarios. Dive in!',
    reactions: [
      { emoji: '💡', count: 19 },
      { emoji: '🔥', count: 14 },
    ],
    commentCount: 23,
  },
  {
    id: 'mhpost_ai4u_mentor',
    authorName: 'Dr. Sarah Chen',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=SarahChen',
    authorRole: 'mentor',
    postedAt: '2026-05-10T10:15:00Z',
    channel: 'discussion',
    title: 'AI4U mentoring slots open for June',
    body: 'Hi everyone! We have opened 1:1 AI Career Mentoring sessions for June. These are contributed by AI4U Collective experts. Slots fill fast so register early.',
    reactions: [
      { emoji: '🙌', count: 27 },
      { emoji: '📅', count: 11 },
    ],
    commentCount: 19,
  },
  {
    id: 'mhpost_mdec',
    authorName: 'Ahmad Zulkifli',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ahmad',
    authorRole: 'mentor',
    postedAt: '2026-05-09T16:00:00Z',
    channel: 'feed',
    title: 'MDEC grants available for program graduates',
    body: 'Great news — MDEC is offering digital economy grants for graduates of this program. Complete the Digital Economy Blueprint module to qualify. Details in the resources tab.',
    reactions: [
      { emoji: '💰', count: 34 },
      { emoji: '🎯', count: 15 },
    ],
    commentCount: 41,
  },
  {
    id: 'mhpost_member_win',
    authorName: 'Nurul Izzah',
    authorAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Nurul',
    authorRole: 'member',
    postedAt: '2026-05-08T11:00:00Z',
    channel: 'discussion',
    title: 'Just completed Design Thinking Workshop!',
    body: 'Amazing 2-day workshop at Mereka Space. Learned so much about user research and prototyping. The cross-hub format really works — getting perspectives from different organisations is invaluable.',
    reactions: [
      { emoji: '👏', count: 18 },
      { emoji: '❤️', count: 9 },
    ],
    commentCount: 7,
  },
];

const multiHubMembers: ProgramMember[] = [
  makeMember('Faiz S', true, 'admin'),
  makeMember('Lisa Tan', true, 'mentor'),
  makeMember('Dr Sarah Chen', true, 'mentor'),
  makeMember('Ahmad Zulkifli', true, 'mentor'),
  makeMember('Nurul Izzah', true),
  makeMember('Wei Lun', true),
  makeMember('Priya M', true),
  makeMember('Hafiz R', true),
  makeMember('Siti Aminah', true),
  makeMember('James Ong', false, 'mentor'),
  makeMember('Amirah K', false),
  makeMember('Raj Kumar', false),
  makeMember('Mei Ling', false),
  makeMember('Danish A', false),
  makeMember('Zara N', false),
  makeMember('Kevin L', false),
  makeMember('Aina S', false),
  makeMember('Brandon T', false),
  makeMember('Farah Z', false),
  makeMember('Imran H', false),
];

const landingMultiHub: ProgramLanding = {
  partners: [
    { name: 'Bijibiji Initiative', logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Bijibiji' },
    { name: 'Microsoft', logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Microsoft' },
    { name: 'AI4U Collective', logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=AI4U' },
    { name: 'MDEC', logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=MDEC' },
    { name: 'Grab Malaysia', logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Grab' },
  ],
  details: {
    duration: '16 weeks',
    format: 'Hybrid (online + in-person workshops)',
    location: 'Mereka Space KL + Online',
    targetAudience: 'Working professionals, fresh graduates, career switchers',
    certificates: 'Digital Skills Accelerator Certificate + individual module badges',
  },
  learningOutcomes: [
    'Build digital literacy across collaboration tools and cloud platforms',
    'Apply design thinking to solve real-world problems',
    'Leverage AI tools like Microsoft Copilot for workplace productivity',
    'Develop and deploy AI-powered business solutions',
    'Understand the Malaysian digital economy landscape and available grants',
    'Build a portfolio of real projects with cross-hub mentorship',
  ],
  features: [
    { icon: '🏢', title: 'Multi-Hub Collaboration', description: '4 leading organisations contribute specialised modules and expert mentors.' },
    { icon: '🎓', title: 'Stackable Credentials', description: 'Earn individual badges per module plus the overall accelerator certificate.' },
    { icon: '🤝', title: 'Industry Mentoring', description: '1:1 sessions with professionals from Microsoft, AI4U, MDEC, and Bijibiji.' },
    { icon: '💼', title: 'Career Outcomes', description: 'Job placement support, MDEC grants, and alumni network access.' },
  ],
  certificationPartner: {
    name: 'Bijibiji Initiative',
    logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Bijibiji',
    description: 'Bijibiji Initiative coordinates the Digital Skills Accelerator as lead hub, with modules contributed by Microsoft, AI4U Collective, and MDEC.',
  },
  experts: [
    { name: 'Faiz Soemawilaga', title: 'Program Director, Bijibiji', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Faiz', bio: 'Leading the Digital Skills Accelerator vision and cross-hub coordination.' },
    { name: 'Lisa Tan', title: 'Digital Transformation Lead, Microsoft', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=LisaTan', bio: 'Helped 50+ companies adopt AI-first workflows across APAC.' },
    { name: 'Dr. Sarah Chen', title: 'AI Research Lead, AI4U Collective', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=SarahChen', bio: '10+ years in ML research with published papers in NeurIPS and ICML.' },
    { name: 'Ahmad Zulkifli', title: 'Director, MDEC Digital Skills', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ahmad', bio: 'Driving MyDIGITAL workforce development initiatives across Malaysia.' },
  ],
  pricingTiers: [
    {
      name: 'Standard',
      price: 999,
      currency: 'MYR',
      features: [
        'All 7 modules from 4 hubs',
        'Live workshop access',
        'Community forum & peer network',
        'Individual module badges',
        'Certificate of Completion',
      ],
      ctaLabel: 'Enroll Now',
    },
    {
      name: 'Premium',
      price: 1999,
      currency: 'MYR',
      isPopular: true,
      features: [
        'Everything in Standard',
        '6x 1:1 mentoring sessions (choose your hub)',
        'Portfolio review by industry experts',
        'MDEC grant application support',
        'Job placement assistance',
        'Alumni network lifetime access',
      ],
      ctaLabel: 'Get Premium',
    },
  ],
  faqs: [
    { question: 'What does "multi-hub" mean?', answer: 'This program is a collaboration between 4 organisations. Bijibiji Initiative leads the program, while Microsoft, AI4U Collective, and MDEC each contribute specialised modules and expert mentors in their domain.' },
    { question: 'Can I choose which modules to take?', answer: 'Some modules are mandatory (Digital Literacy, Design Thinking, AI Productivity, Applied AI) and others are elective. You can customise your path based on your career goals.' },
    { question: 'Are the mentors from all the partner hubs?', answer: 'Yes! Premium tier students can choose mentors from any of the 4 contributing hubs based on their area of interest.' },
    { question: 'What are the MDEC grants?', answer: 'MDEC offers digital economy grants for program graduates who complete the Digital Economy Blueprint module. Grants support starting a digital business or continuing advanced training.' },
    { question: 'Is this program subsidised?', answer: 'Yes, the multi-hub collaboration allows us to offer this program at below-market rates. Additional subsidies may be available for B40 applicants.' },
  ],
};

const landingSearch: ProgramLanding = {
  partners: [
    { name: 'Bijibiji Initiative', logoUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Bijibiji' },
  ],
  details: {
    duration: '3 weeks',
    format: 'Fully online, self-paced',
    location: 'Online',
    targetAudience: 'Students, researchers, knowledge workers',
    certificates: 'Internet Research Proficiency Certificate',
  },
  learningOutcomes: [
    'Master advanced search operators across major engines',
    'Evaluate source credibility and detect misinformation',
    'Use AI-powered research tools effectively',
    'Synthesise information from multiple sources',
    'Build research workflows for professional use',
  ],
  features: [
    { icon: '🔍', title: 'Search Labs', description: 'Hands-on exercises with real search challenges and scenarios.' },
    { icon: '🧠', title: 'Critical Thinking', description: 'Learn frameworks for evaluating sources and spotting misinformation.' },
    { icon: '🤖', title: 'AI Research Tools', description: 'Master Perplexity, Consensus, and other AI search tools.' },
    { icon: '📄', title: 'Research Templates', description: 'Download professional research report templates.' },
  ],
  experts: [
    { name: 'Ravi Kumar', title: 'Research Analyst, Bijibiji', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=RaviKumar', bio: 'Former intelligence analyst turned open-source research educator.' },
  ],
  pricingTiers: [
    {
      name: 'Free',
      price: 'free',
      features: [
        'All 5 course modules',
        'Search challenge exercises',
        'Research templates',
        'Certificate of Completion',
        'Community access',
      ],
      ctaLabel: 'Start Learning',
    },
  ],
  faqs: [
    { question: 'Is this suitable for beginners?', answer: 'Yes, the program starts from the basics and builds up to advanced techniques. No prior research experience needed.' },
    { question: 'How is this different from just Googling?', answer: 'You will learn advanced operators, alternative search engines, AI research tools, and critical evaluation frameworks that go far beyond basic web searching.' },
    { question: 'Can I use this for academic research?', answer: 'Absolutely. The skills taught are directly applicable to academic research, journalism, market research, and competitive intelligence.' },
  ],
};

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
    status: 'published', visibility: 'public',
    timeline: {
      enrollStart: '2026-04-15',
      enrollEnd: '2026-05-30',
      startsAt: '2026-06-03',
      endsAt: '2026-08-26',
    },
    curriculum: sampleCurriculum,
    stats: { memberCount: 1713, expertCount: 3, mentorCount: 5 },
    recentPosts: samplePosts,
    landing: landingAi4u,
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
    status: 'published', visibility: 'public',
    timeline: { enrollStart: '2026-05-01' },
    curriculum: sampleCurriculum.slice(0, 2),
    stats: { memberCount: 482, expertCount: 1, mentorCount: 2 },
    recentPosts: samplePosts.slice(0, 1),
    landing: landingCopilot,
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
    status: 'published', visibility: 'public',
    timeline: {},
    curriculum: sampleCurriculum.slice(2, 4),
    stats: { memberCount: 219, expertCount: 0, mentorCount: 1 },
    recentPosts: [],
    landing: landingSearch,
  },
  {
    id: 'prog_digital_skills',
    slug: 'digital-skills-accelerator',
    title: 'Digital Skills Accelerator',
    tagline: 'A multi-hub program to upskill Malaysia in digital and AI — led by Bijibiji with Microsoft, AI4U, and MDEC.',
    description:
      'The Digital Skills Accelerator brings together 4 leading organisations to deliver a comprehensive ' +
      '16-week program. Bijibiji Initiative leads and coordinates, while Microsoft contributes AI productivity ' +
      'and cloud modules, AI4U Collective provides applied AI training and career mentoring, and MDEC offers ' +
      'digital economy insights and grant opportunities. Each hub owns its modules and provides expert mentors.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=70&auto=format&fit=crop',
    ownerHub: bijibiji,
    collaborators: [
      {
        hub: microsoft,
        role: 'editor',
        invitedAt: '2026-03-15',
        acceptedAt: '2026-03-16',
      },
      {
        hub: hubAi4u,
        role: 'editor',
        invitedAt: '2026-03-15',
        acceptedAt: '2026-03-17',
      },
      {
        hub: hubMdec,
        role: 'editor',
        invitedAt: '2026-03-20',
        acceptedAt: '2026-03-22',
      },
      {
        hub: hubGrab,
        role: 'viewer',
        invitedAt: '2026-04-01',
        acceptedAt: '2026-04-03',
      },
    ],
    pricing: { kind: 'paid', price: 999, currency: 'MYR' },
    status: 'published', visibility: 'public',
    timeline: {
      enrollStart: '2026-04-01',
      enrollEnd: '2026-06-15',
      startsAt: '2026-06-23',
      endsAt: '2026-10-13',
    },
    curriculum: multiHubCurriculum,
    stats: { memberCount: 3247, expertCount: 8, mentorCount: 12 },
    recentPosts: multiHubPosts,
    landing: landingMultiHub,
  },
];

export const PROGRAM_MEMBERS: Record<string, ProgramMember[]> = {
  ai4u: sampleMembers,
  'boost-productivity-with-copilot': sampleMembers.slice(0, 6),
  'internet-search-and-beyond': sampleMembers.slice(0, 3),
  'digital-skills-accelerator': multiHubMembers,
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
