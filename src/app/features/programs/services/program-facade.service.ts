import { Injectable, inject, signal, computed } from '@angular/core';
import { ProgramStoreService } from './program-store.service';
import type { Program, ProgramStatus, CurriculumItem, HubRef, ProgramCollaborator } from '../models/program.model';
import type { CreateProgramPayload } from './program-store.service';

/**
 * Hub reference constants for multi-hub sample programs.
 */
const HUBS = {
  mereka: { hubId: 'mereka', hubName: 'Mereka', hubLogo: null, slug: 'mereka' } as HubRef,
  bijibiji: { hubId: 'biji-biji', hubName: 'Biji-biji Initiative', hubLogo: null, slug: 'biji-biji-initiative' } as HubRef,
  microsoft: { hubId: 'microsoft-my', hubName: 'Microsoft Malaysia', hubLogo: null, slug: 'microsoft-malaysia' } as HubRef,
  mdec: { hubId: 'mdec', hubName: 'MDEC', hubLogo: null, slug: 'mdec' } as HubRef,
  wwf: { hubId: 'wwf-my', hubName: 'WWF Malaysia', hubLogo: null, slug: 'wwf-malaysia' } as HubRef,
};

/**
 * Built-in fixture programs that always exist (read-only seed data).
 * These represent programs across multiple hubs with collaborators.
 */
const FIXTURE_PROGRAMS: Program[] = [
  {
    id: 'fixture-ai4u',
    slug: 'ai4u-programme',
    title: 'AI4U Programme',
    tagline: 'Upskill in AI from fundamentals to real-world application',
    description: 'A comprehensive AI literacy programme designed for Malaysian professionals. Covers AI fundamentals, prompt engineering, generative AI tools, and AI product management.',
    coverImageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=ai4u-programme',
    ownerHub: HUBS.bijibiji,
    collaborators: [
      { hub: HUBS.microsoft, role: 'editor', invitedAt: '2025-09-01T00:00:00Z', acceptedAt: '2025-09-02T00:00:00Z' },
      { hub: HUBS.mdec, role: 'viewer', invitedAt: '2025-09-01T00:00:00Z', acceptedAt: '2025-09-03T00:00:00Z' },
    ],
    pricing: { kind: 'paid', price: 1499, currency: 'MYR' },
    status: 'published',
    visibility: 'public',
    timeline: { enrollStart: '2025-10-01', enrollEnd: '2026-01-31', startsAt: '2025-11-01', endsAt: '2026-06-30' },
    curriculum: [
      { id: 'cur-ai-fund', type: 'course', title: 'AI Fundamentals', slug: 'ai-fundamentals', blurb: 'Core AI concepts and terminology', ownerHub: HUBS.bijibiji, isMandatory: true, prerequisiteIds: [], sourceId: 'course-ai-fundamentals' },
      { id: 'cur-prompt', type: 'course', title: 'Prompt Engineering', slug: 'prompt-engineering', blurb: 'Master the art of prompting LLMs', ownerHub: HUBS.bijibiji, isMandatory: true, prerequisiteIds: ['cur-ai-fund'], sourceId: 'course-prompt-engineering' },
      { id: 'cur-ai-fluency', type: 'course', title: 'AI Fluency by Microsoft', slug: 'ai-fluency', blurb: 'Microsoft AI literacy certification', ownerHub: HUBS.microsoft, isMandatory: true, prerequisiteIds: ['cur-ai-fund'], sourceId: 'course-ai-fluency' },
      { id: 'cur-genai-ws', type: 'experience', title: 'Generative AI Workshop', slug: 'genai-workshop', blurb: '2-day hands-on workshop with industry experts', ownerHub: HUBS.bijibiji, isMandatory: false, prerequisiteIds: ['cur-prompt'], sourceId: 'exp-genai-workshop' },
      { id: 'cur-ai-pm', type: 'expertise', title: 'AI Product Management Mentoring', slug: 'ai-pm-mentoring', blurb: '1:1 sessions with senior AI product managers', ownerHub: HUBS.bijibiji, isMandatory: false, prerequisiteIds: [], sourceId: 'expertise-ai-pm' },
    ],
    stats: { memberCount: 148, expertCount: 5, mentorCount: 3 },
    recentPosts: [],
  },
  {
    id: 'fixture-career-accelerator',
    slug: 'career-accelerator',
    title: 'Career Accelerator',
    tagline: 'Fast-track your career transition with guided mentorship',
    description: 'A 3-month intensive programme combining career strategy courses, portfolio sprints, and 1:1 coaching sessions to help professionals pivot into tech roles.',
    coverImageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=career-accelerator',
    ownerHub: HUBS.mereka,
    collaborators: [
      { hub: HUBS.bijibiji, role: 'editor', invitedAt: '2025-08-15T00:00:00Z', acceptedAt: '2025-08-16T00:00:00Z' },
    ],
    pricing: { kind: 'paid', price: 899, currency: 'MYR' },
    status: 'published',
    visibility: 'public',
    timeline: { enrollStart: '2025-12-01', enrollEnd: '2026-02-28', startsAt: '2026-01-15', endsAt: '2026-04-15' },
    curriculum: [
      { id: 'cur-career-strat', type: 'course', title: 'Career Strategy & Planning', slug: 'career-strategy', blurb: 'Define your career direction and build a plan', ownerHub: HUBS.mereka, isMandatory: true, prerequisiteIds: [], sourceId: 'course-strategy' },
      { id: 'cur-portfolio', type: 'experience', title: 'Portfolio Sprint: Build Your First Case Study', slug: 'portfolio-sprint', blurb: '2-week sprint to create a compelling portfolio piece', ownerHub: HUBS.mereka, isMandatory: true, prerequisiteIds: ['cur-career-strat'], sourceId: 'exp-portfolio-sprint' },
      { id: 'cur-interview', type: 'expertise', title: 'Mock Interview Coaching', slug: 'mock-interview', blurb: '3 practice interviews with senior hiring managers', ownerHub: HUBS.bijibiji, isMandatory: false, prerequisiteIds: [], sourceId: 'expertise-mock-interview' },
      { id: 'cur-networking', type: 'experience', title: 'Industry Networking Event', slug: 'networking-event', blurb: 'Meet hiring managers from top tech companies', ownerHub: HUBS.mereka, isMandatory: false, prerequisiteIds: [], sourceId: 'exp-networking' },
    ],
    stats: { memberCount: 64, expertCount: 8, mentorCount: 4 },
    recentPosts: [],
  },
  {
    id: 'fixture-green-skills',
    slug: 'green-skills-programme',
    title: 'Green Skills Programme',
    tagline: 'Build expertise in sustainability and ESG for the green economy',
    description: 'A multi-hub sustainability programme covering carbon accounting, circular economy principles, ESG reporting, and sustainable business practices.',
    coverImageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=green-skills',
    ownerHub: HUBS.bijibiji,
    collaborators: [
      { hub: HUBS.mereka, role: 'editor', invitedAt: '2025-10-01T00:00:00Z', acceptedAt: '2025-10-02T00:00:00Z' },
      { hub: HUBS.wwf, role: 'viewer', invitedAt: '2025-10-01T00:00:00Z', acceptedAt: '2025-10-05T00:00:00Z' },
    ],
    pricing: { kind: 'free' },
    status: 'published',
    visibility: 'public',
    timeline: { enrollStart: '2026-01-01', startsAt: '2026-02-01', endsAt: '2026-08-31' },
    curriculum: [
      { id: 'cur-sustain-101', type: 'course', title: 'Sustainability 101', slug: 'sustainability-101', blurb: 'Foundations of environmental sustainability', ownerHub: HUBS.bijibiji, isMandatory: true, prerequisiteIds: [], sourceId: 'course-sustainability-101' },
      { id: 'cur-carbon', type: 'course', title: 'Carbon Accounting Basics', slug: 'carbon-accounting', blurb: 'Measure and report carbon emissions', ownerHub: HUBS.wwf, isMandatory: true, prerequisiteIds: ['cur-sustain-101'], sourceId: 'course-carbon-accounting' },
      { id: 'cur-circular', type: 'experience', title: 'Circular Economy Design Sprint', slug: 'circular-design', blurb: 'Hands-on workshop redesigning products for circularity', ownerHub: HUBS.bijibiji, isMandatory: false, prerequisiteIds: [], sourceId: 'exp-circular-design' },
      { id: 'cur-esg-mentor', type: 'expertise', title: 'ESG Reporting Mentorship', slug: 'esg-mentorship', blurb: 'Guided mentorship on ESG framework selection and reporting', ownerHub: HUBS.mereka, isMandatory: false, prerequisiteIds: ['cur-carbon'], sourceId: 'expertise-esg-mentor' },
    ],
    stats: { memberCount: 55, expertCount: 3, mentorCount: 2 },
    recentPosts: [],
  },
  {
    id: 'fixture-digital-hospitality',
    slug: 'digital-hospitality',
    title: 'Digital Hospitality Programme',
    tagline: 'Digital transformation skills for the hospitality industry',
    description: 'Equip hospitality professionals with digital marketing, revenue management, and customer experience technology skills. A collaboration between MDEC and industry partners.',
    coverImageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=digital-hospitality',
    ownerHub: HUBS.mdec,
    collaborators: [
      { hub: HUBS.bijibiji, role: 'editor', invitedAt: '2025-11-01T00:00:00Z', acceptedAt: '2025-11-02T00:00:00Z' },
      { hub: HUBS.mereka, role: 'viewer', invitedAt: '2025-11-01T00:00:00Z', acceptedAt: '2025-11-03T00:00:00Z' },
    ],
    pricing: { kind: 'paid', price: 599, currency: 'MYR' },
    status: 'published',
    visibility: 'public',
    timeline: { enrollStart: '2026-03-01', startsAt: '2026-04-01', endsAt: '2026-09-30' },
    curriculum: [
      { id: 'cur-digi-mkt', type: 'course', title: 'Digital Marketing 101', slug: 'digital-marketing-101', blurb: 'Fundamentals of digital marketing for hospitality', ownerHub: HUBS.bijibiji, isMandatory: true, prerequisiteIds: [], sourceId: 'course-digital-marketing-101' },
      { id: 'cur-revenue', type: 'course', title: 'Revenue Management Systems', slug: 'revenue-management', blurb: 'Optimize pricing with data-driven tools', ownerHub: HUBS.mdec, isMandatory: true, prerequisiteIds: [], sourceId: 'course-revenue-management' },
      { id: 'cur-cx-tech', type: 'experience', title: 'CX Technology Bootcamp', slug: 'cx-bootcamp', blurb: '3-day intensive on hotel tech stack', ownerHub: HUBS.mdec, isMandatory: false, prerequisiteIds: ['cur-digi-mkt'], sourceId: 'exp-cx-bootcamp' },
      { id: 'cur-hotel-mentor', type: 'expertise', title: 'Hotel GM Mentoring', slug: 'hotel-gm-mentoring', blurb: 'Monthly sessions with experienced hotel GMs', ownerHub: HUBS.mereka, isMandatory: false, prerequisiteIds: [], sourceId: 'expertise-hotel-gm' },
    ],
    stats: { memberCount: 37, expertCount: 4, mentorCount: 2 },
    recentPosts: [],
  },
  {
    id: 'fixture-internet-search',
    slug: 'internet-search-beyond',
    title: 'Internet Search & Beyond',
    tagline: 'Master advanced internet research and information literacy',
    description: 'Learn to find, evaluate, and synthesize information from the internet effectively. Covers advanced search operators, source verification, and research methodologies.',
    coverImageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=internet-search',
    ownerHub: HUBS.bijibiji,
    collaborators: [],
    pricing: { kind: 'free' },
    status: 'published',
    visibility: 'public',
    timeline: { startsAt: '2025-06-01' },
    curriculum: [
      { id: 'cur-search-fund', type: 'course', title: 'Internet Search & Beyond', slug: 'internet-search', blurb: 'Master search engines and research tools', ownerHub: HUBS.bijibiji, isMandatory: true, prerequisiteIds: [], sourceId: 'course-internet-search' },
      { id: 'cur-fact-check', type: 'experience', title: 'Fact-Checking Challenge', slug: 'fact-check-challenge', blurb: 'Team-based fact-checking competition', ownerHub: HUBS.bijibiji, isMandatory: false, prerequisiteIds: ['cur-search-fund'], sourceId: 'exp-fact-check' },
    ],
    stats: { memberCount: 210, expertCount: 2, mentorCount: 1 },
    recentPosts: [],
  },
  {
    id: 'fixture-copilot',
    slug: 'copilot-for-work',
    title: 'Copilot for Work',
    tagline: 'Leverage Microsoft Copilot to transform your productivity',
    description: 'Hands-on programme teaching professionals to use Microsoft 365 Copilot effectively across Word, Excel, PowerPoint, Teams, and Outlook.',
    coverImageUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=copilot-work',
    ownerHub: HUBS.microsoft,
    collaborators: [
      { hub: HUBS.bijibiji, role: 'editor', invitedAt: '2025-07-01T00:00:00Z', acceptedAt: '2025-07-02T00:00:00Z' },
    ],
    pricing: { kind: 'free' },
    status: 'published',
    visibility: 'public',
    timeline: { startsAt: '2025-08-01' },
    curriculum: [
      { id: 'cur-copilot-101', type: 'course', title: 'Copilot Fundamentals', slug: 'copilot-fundamentals', blurb: 'Introduction to AI-powered productivity', ownerHub: HUBS.microsoft, isMandatory: true, prerequisiteIds: [], sourceId: 'course-copilot-101' },
      { id: 'cur-copilot-adv', type: 'course', title: 'Advanced Copilot Workflows', slug: 'copilot-advanced', blurb: 'Complex multi-app automation with Copilot', ownerHub: HUBS.microsoft, isMandatory: true, prerequisiteIds: ['cur-copilot-101'], sourceId: 'course-copilot-advanced' },
      { id: 'cur-copilot-ws', type: 'experience', title: 'Copilot Power User Workshop', slug: 'copilot-workshop', blurb: 'Live workshop building custom Copilot prompts', ownerHub: HUBS.bijibiji, isMandatory: false, prerequisiteIds: ['cur-copilot-101'], sourceId: 'exp-copilot-workshop' },
    ],
    stats: { memberCount: 320, expertCount: 3, mentorCount: 2 },
    recentPosts: [],
  },
];

/**
 * Unified facade that merges fixture programs (read-only seed data)
 * with user-created programs (localStorage CRUD via ProgramStoreService).
 *
 * All consumers should use this service instead of ProgramStoreService directly.
 */
@Injectable({ providedIn: 'root' })
export class ProgramFacadeService {
  private readonly store = inject(ProgramStoreService);

  /** All programs: fixtures + user-created. */
  readonly allPrograms = computed<Program[]>(() => {
    return [...FIXTURE_PROGRAMS, ...this.store.programs()];
  });

  /** Programs relevant to the current user (all in prototype mode). */
  readonly myPrograms = computed<Program[]>(() => {
    // In prototype, show all programs (fixtures + user-created)
    return this.allPrograms();
  });

  /** Get a program by slug (searches fixtures first, then user-created). */
  bySlug(slug: string): Program | undefined {
    return FIXTURE_PROGRAMS.find(p => p.slug === slug)
      ?? this.store.bySlug(slug);
  }

  /** Create a new program (delegates to ProgramStoreService). */
  create(payload: CreateProgramPayload): Program {
    return this.store.create(payload);
  }

  /** Update a user-created program. Fixture programs cannot be modified. */
  update(slug: string, patch: Partial<Program>): void {
    if (this.isFixture(slug)) return; // Fixtures are read-only
    this.store.update(slug, patch);
  }

  /** Update a user-created program's status. */
  updateStatus(slug: string, status: ProgramStatus): void {
    if (this.isFixture(slug)) return;
    this.store.updateStatus(slug, status);
  }

  /** Delete a user-created program. Fixtures cannot be deleted. */
  delete(slug: string): void {
    if (this.isFixture(slug)) return;
    this.store.delete(slug);
  }

  /** Check if a program is a fixture (read-only). */
  isFixture(slug: string): boolean {
    return FIXTURE_PROGRAMS.some(p => p.slug === slug);
  }

  /** Get all unique hubs across all programs. */
  readonly allHubs = computed<HubRef[]>(() => {
    const hubMap = new Map<string, HubRef>();
    for (const p of this.allPrograms()) {
      hubMap.set(p.ownerHub.hubId, p.ownerHub);
      for (const c of p.collaborators) {
        hubMap.set(c.hub.hubId, c.hub);
      }
    }
    return Array.from(hubMap.values());
  });

  /** Get programs filtered by hub (as owner or collaborator). */
  programsByHub(hubId: string): Program[] {
    if (hubId === 'all') return this.allPrograms();
    return this.allPrograms().filter(p =>
      p.ownerHub.hubId === hubId ||
      p.collaborators.some(c => c.hub.hubId === hubId)
    );
  }

  /** Get curriculum items available for composing (across all programs from a hub). */
  availableCurriculum(hubId?: string): CurriculumItem[] {
    const programs = hubId ? this.programsByHub(hubId) : this.allPrograms();
    const items: CurriculumItem[] = [];
    const seen = new Set<string>();
    for (const p of programs) {
      for (const item of p.curriculum) {
        if (!seen.has(item.sourceId)) {
          seen.add(item.sourceId);
          items.push(item);
        }
      }
    }
    return items;
  }
}
