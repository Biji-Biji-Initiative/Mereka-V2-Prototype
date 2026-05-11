import type {
  Experience, Expertise, Gig, GigApplicant, HubProfile, Order,
} from '../features/marketplace/models/marketplace.model';
import type { HubRef } from '../features/programs/models/program.model';

const bijibiji: HubRef = { hubId: 'hub_bijibiji', hubName: 'Bijibiji Initiative', hubLogo: 'https://api.dicebear.com/9.x/initials/svg?seed=Bijibiji', slug: 'bijibiji' };
const microsoft: HubRef = { hubId: 'hub_microsoft', hubName: 'Microsoft Malaysia', hubLogo: 'https://api.dicebear.com/9.x/initials/svg?seed=Microsoft', slug: 'microsoft' };
const hubAi4u: HubRef = { hubId: 'hub_ai4u', hubName: 'AI4U Collective', hubLogo: 'https://api.dicebear.com/9.x/initials/svg?seed=AI4U', slug: 'ai4u' };
const hubGreenSchool: HubRef = { hubId: 'hub_greenschool', hubName: 'Green School KL', hubLogo: 'https://api.dicebear.com/9.x/initials/svg?seed=GreenSchool', slug: 'green-school' };

export const EXPERIENCES: Experience[] = [
  {
    id: 'exp_image_gen', slug: 'image-gen-crash-course',
    title: 'Image Gen Crash Course',
    tagline: 'Hands-on Saturday workshop. From "I tried Midjourney once" to shipping prompt packs in 4 hours.',
    description: 'Bring a laptop. We provide the API keys, the playground accounts, and the bagels. You leave with a refined prompt library, a portfolio piece, and a peer cohort to riff with.',
    coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=70&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1670272504528-790c24957dda?w=1200&q=70&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=1200&q=70&auto=format&fit=crop',
    ],
    themes: ['Generative AI', 'Design'], mode: 'physical', hub: bijibiji,
    location: { city: 'Kuala Lumpur', country: 'Malaysia', venue: 'Mereka HQ' },
    tickets: [
      { id: 't1', name: 'Early bird', description: 'Sold to 15 May', price: 180, currency: 'MYR', capacity: 30, sold: 22 },
      { id: 't2', name: 'General admission', price: 240, currency: 'MYR', capacity: 50, sold: 12 },
    ],
    slots: [
      { id: 's1', startsAt: '2026-06-07T02:00:00Z', endsAt: '2026-06-07T06:00:00Z', timeZone: 'Asia/Kuala_Lumpur', ticketsAvailable: 46 },
      { id: 's2', startsAt: '2026-06-21T02:00:00Z', endsAt: '2026-06-21T06:00:00Z', timeZone: 'Asia/Kuala_Lumpur', ticketsAvailable: 12 },
    ],
    rating: { average: 4.7, total: 84 }, status: 'published', createdAt: '2026-04-12',
  },
  {
    id: 'exp_design_thinking', slug: 'design-thinking-bootcamp',
    title: 'Design Thinking Bootcamp',
    tagline: '2-day intensive — empathise, ideate, prototype, test.',
    description: 'A practitioner-led intro to Design Thinking with one team-based project carried end-to-end across both days.',
    coverImageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1600&q=70&auto=format&fit=crop',
    themes: ['Design', 'Leadership'], mode: 'hybrid', hub: hubAi4u,
    location: { city: 'Kuala Lumpur', country: 'Malaysia' },
    tickets: [
      { id: 't1', name: 'Standard', price: 540, currency: 'MYR', capacity: 24, sold: 8 },
    ],
    slots: [
      { id: 's1', startsAt: '2026-06-14T01:00:00Z', endsAt: '2026-06-15T09:00:00Z', timeZone: 'Asia/Kuala_Lumpur', ticketsAvailable: 16 },
    ],
    rating: { average: 4.5, total: 41 }, status: 'published', createdAt: '2026-03-22',
  },
  {
    id: 'exp_climate_walk', slug: 'climate-walk-kl',
    title: 'Climate Walk: KL Heritage Edition',
    tagline: 'Free 2-hour walking tour exploring KL’s climate resilience efforts.',
    description: 'Open to all. Bring water + comfortable shoes. Donations welcome — proceeds go to Bjorn Foundation.',
    coverImageUrl: 'https://images.unsplash.com/photo-1610015386480-a9b1bc6e2e95?w=1600&q=70&auto=format&fit=crop',
    themes: ['Climate', 'Walking tour'], mode: 'physical', hub: hubGreenSchool,
    location: { city: 'Kuala Lumpur', country: 'Malaysia', venue: 'Merdeka 118 lobby' },
    tickets: [
      { id: 't1', name: 'Free', price: 0, currency: 'MYR', capacity: 30, sold: 21 },
    ],
    slots: [
      { id: 's1', startsAt: '2026-05-24T01:00:00Z', endsAt: '2026-05-24T03:00:00Z', timeZone: 'Asia/Kuala_Lumpur', ticketsAvailable: 9 },
    ],
    rating: { average: 4.9, total: 27 }, status: 'published', createdAt: '2026-04-30',
  },
  {
    id: 'exp_copilot_for_msft', slug: 'copilot-for-msft-teams',
    title: 'Microsoft Copilot for Operations Teams',
    tagline: 'Virtual 90-min workshop showing 8 specific Copilot workflows.',
    description: 'Co-delivered with Microsoft Malaysia. Bring a real workflow problem; we’ll co-design a Copilot solution and you’ll leave with a runbook.',
    coverImageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=70&auto=format&fit=crop',
    themes: ['Generative AI', 'Operations'], mode: 'virtual', hub: microsoft,
    tickets: [
      { id: 't1', name: 'Standard', price: 80, currency: 'MYR', capacity: -1, sold: 132 },
    ],
    slots: [
      { id: 's1', startsAt: '2026-05-30T07:00:00Z', endsAt: '2026-05-30T08:30:00Z', timeZone: 'Asia/Kuala_Lumpur', ticketsAvailable: 200 },
    ],
    rating: { average: 4.6, total: 132 }, status: 'published', createdAt: '2026-04-02',
  },
];

export const EXPERTISES: Expertise[] = [
  {
    id: 'expt_ai_pm', slug: 'ai-product-management',
    title: 'AI Product Management',
    tagline: '1:1 mentoring on shipping AI features in production.',
    description: 'Senior PM with 8 years shipping AI features at scale. Bring a real product question — we’ll co-prioritise, sketch metrics, and de-risk together.',
    coverImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1600&q=70&auto=format&fit=crop',
    expertName: 'Aisha Rahman', expertAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=AishaR',
    expertBio: 'Ex-Google PM, currently leading AI products at a Series C startup. Mentor at AI4U.',
    hub: hubAi4u, format: '1:1', sessionMinutes: 60, pricePerSession: 280, currency: 'MYR',
    themes: ['AI', 'Product'], rating: { average: 4.9, total: 38 },
    upcomingSlots: [
      { id: 's1', startsAt: '2026-05-20T08:00:00Z', endsAt: '2026-05-20T09:00:00Z' },
      { id: 's2', startsAt: '2026-05-22T08:00:00Z', endsAt: '2026-05-22T09:00:00Z' },
      { id: 's3', startsAt: '2026-05-24T10:00:00Z', endsAt: '2026-05-24T11:00:00Z' },
    ],
    status: 'published', createdAt: '2026-02-14',
  },
  {
    id: 'expt_design_critique', slug: 'product-design-critique',
    title: 'Product Design Critique',
    tagline: 'Bring 1–3 screens; leave with sharper hierarchy and a punch-list.',
    description: 'I review Figma files like I review code — tight, specific, no fluff. Best for early-stage designers shipping their first 0–1.',
    coverImageUrl: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1600&q=70&auto=format&fit=crop',
    expertName: 'Jonas Lee', expertAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=JonasL',
    expertBio: 'Design Manager at a regional fintech. Critiqued 400+ portfolios.',
    hub: bijibiji, format: '1:1', sessionMinutes: 45, pricePerSession: 180, currency: 'MYR',
    themes: ['Design', 'UX'], rating: { average: 4.8, total: 56 },
    upcomingSlots: [
      { id: 's1', startsAt: '2026-05-19T06:00:00Z', endsAt: '2026-05-19T06:45:00Z' },
      { id: 's2', startsAt: '2026-05-21T06:00:00Z', endsAt: '2026-05-21T06:45:00Z' },
    ],
    status: 'published', createdAt: '2026-01-22',
  },
  {
    id: 'expt_grant_writing', slug: 'grant-writing-clinic',
    title: 'Grant Writing Clinic (Group)',
    tagline: 'Group session, 4 people max, one grant draft each.',
    description: 'Tight 90-minute group critique on your draft grant proposals. Best after you’ve written a first pass.',
    coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=70&auto=format&fit=crop',
    expertName: 'Marisa Hassan', expertAvatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=MarisaH',
    expertBio: 'Helped social enterprises raise USD 6M+. Mentor at Green School.',
    hub: hubGreenSchool, format: 'group', sessionMinutes: 90, pricePerSession: 120, currency: 'MYR',
    themes: ['Funding', 'Writing'], rating: { average: 4.7, total: 21 },
    upcomingSlots: [
      { id: 's1', startsAt: '2026-05-25T03:00:00Z', endsAt: '2026-05-25T04:30:00Z' },
    ],
    status: 'published', createdAt: '2026-03-11',
  },
];

export const GIGS: Gig[] = [
  {
    id: 'gig_landing_page', slug: 'landing-page-for-ai4u',
    title: 'Landing page rebuild for AI4U cohort 3',
    hub: hubAi4u,
    description: 'We need a marketing landing page for the upcoming AI4U cohort. Tailwind/Next.js stack, copywriting included, Figma provided.',
    skills: ['Next.js', 'Tailwind', 'Copywriting'],
    engagement: 'one-off', remote: 'remote',
    budget: { min: 2500, max: 4500, currency: 'MYR', period: 'project' },
    applicantCount: 12, postedAt: '2026-05-04', expiresAt: '2026-06-04', status: 'open',
  },
  {
    id: 'gig_motion_designer', slug: 'motion-designer-program-launch',
    title: 'Motion designer for program launch reel',
    hub: bijibiji,
    description: '30s vertical reel and 6s hero animation for our June program launch. Looking for someone who can move fast and respond to direction.',
    skills: ['After Effects', 'Motion design', 'Branding'],
    engagement: 'contract', remote: 'hybrid',
    budget: { min: 80, max: 130, currency: 'MYR', period: 'hour' },
    applicantCount: 4, postedAt: '2026-05-08', expiresAt: '2026-05-29', status: 'open',
  },
  {
    id: 'gig_grant_writer', slug: 'grant-writer-climate-program',
    title: 'Grant writer for climate-resilience program',
    hub: hubGreenSchool,
    description: 'Lead writer for a USD 250K grant proposal. Public-sector and DFI experience preferred.',
    skills: ['Grant writing', 'Public sector', 'Climate'],
    engagement: 'part-time', remote: 'remote',
    budget: { min: 6000, max: 9000, currency: 'MYR', period: 'month' },
    applicantCount: 3, postedAt: '2026-04-21', expiresAt: '2026-06-21', status: 'open',
  },
];

export const GIG_APPLICANTS: Record<string, GigApplicant[]> = {
  'landing-page-for-ai4u': [
    { id: 'a1', name: 'Florence Jones', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=FlorenceJ', appliedAt: '2026-05-06', proposal: 'I can ship the landing in 5 working days. Strong Next.js + Tailwind background. Portfolio link in profile.', rateOffer: { amount: 3200, currency: 'MYR', period: 'project' }, status: 'shortlisted' },
    { id: 'a2', name: 'Marcus Lee', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=MarcusL', appliedAt: '2026-05-05', proposal: 'Did the AI4U cohort 2 landing — happy to repeat with a refreshed system.', rateOffer: { amount: 4000, currency: 'MYR', period: 'project' }, status: 'new' },
    { id: 'a3', name: 'Elena R.', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ElenaR', appliedAt: '2026-05-05', proposal: 'Available for a faster turnaround. References on request.', rateOffer: { amount: 2800, currency: 'MYR', period: 'project' }, status: 'new' },
  ],
};

export const HUBS: HubProfile[] = [
  { hubId: 'hub_ai4u', slug: 'ai4u', name: 'AI4U Collective', logo: 'https://api.dicebear.com/9.x/initials/svg?seed=AI4U', banner: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=70&auto=format&fit=crop', tagline: 'Practical AI for everyone in Southeast Asia.', about: 'AI4U is a learning collective focused on demystifying AI for non-engineers — designers, ops folks, comms teams.', location: { city: 'Kuala Lumpur', country: 'Malaysia' }, founded: '2023-09-01', programCount: 3, experienceCount: 8, expertiseCount: 12, memberCount: 1820 },
  { hubId: 'hub_bijibiji', slug: 'bijibiji', name: 'Bijibiji Initiative', logo: 'https://api.dicebear.com/9.x/initials/svg?seed=Bijibiji', banner: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1600&q=70&auto=format&fit=crop', tagline: 'Co-creating the future of meaningful work.', about: 'The original Mereka hub. We build programs at the intersection of livelihood, learning, and the future of work.', location: { city: 'Kuala Lumpur', country: 'Malaysia' }, founded: '2019-03-21', programCount: 14, experienceCount: 32, expertiseCount: 41, memberCount: 8420 },
  { hubId: 'hub_microsoft', slug: 'microsoft', name: 'Microsoft Malaysia', logo: 'https://api.dicebear.com/9.x/initials/svg?seed=Microsoft', banner: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&q=70&auto=format&fit=crop', tagline: 'Empowering every Malaysian to achieve more.', about: 'Microsoft Malaysia partners with Mereka hubs to deliver Copilot-led upskilling programs nationwide.', location: { city: 'Kuala Lumpur', country: 'Malaysia' }, founded: '1992-01-01', programCount: 2, experienceCount: 14, expertiseCount: 6, memberCount: 12340 },
];

export const ORDERS: Order[] = [
  {
    id: 'ord_1742', placedAt: '2026-05-04T10:00:00Z',
    items: [
      { id: 'ci1', kind: 'experience', title: 'Image Gen Crash Course', subtitle: 'Early bird · 7 Jun 10am', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=60&auto=format&fit=crop', unitPrice: 180, currency: 'MYR', quantity: 1, hub: bijibiji },
    ],
    subtotal: 180, fees: 5.22, discount: 0, total: 185.22, currency: 'MYR', status: 'paid',
    receiptUrl: 'https://pay.stripe.com/receipts/sample',
  },
];
