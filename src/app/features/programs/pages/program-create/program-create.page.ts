import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth.service';
import type { CurriculumItem, HubRole } from '../../models/program.model';

interface Step {
  key: 'basic' | 'timeline' | 'collaborators' | 'structure' | 'landing' | 'publish';
  label: string;
}

const STEPS: Step[] = [
  { key: 'basic', label: 'Basic Info' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'collaborators', label: 'Collaborators' },
  { key: 'structure', label: 'Structure' },
  { key: 'landing', label: 'Landing Page' },
  { key: 'publish', label: 'Publish' },
];

const TIPS: Record<Step['key'], string> = {
  basic:
    'Make your title descriptive and exciting! Use key words that you would think your clients would likely use to search for services like yours. E.g. LinkedIn Zero to Hero: LinkedIn Profile Review & Optimisation',
  timeline: 'Programs with a clear cohort window convert ~38% better than always-open programs.',
  collaborators:
    'Collaborator hubs see your draft and can co-edit curriculum, but only program owners can publish.',
  structure: 'Mix at least one course, one experience and one expertise for the strongest learner outcomes.',
  landing:
    'A great landing page is concise. Keep it under 8 sections — hero, modules, mentors, alumni, FAQ, CTA.',
  publish: "You're moments away. Once published, learners can enrol immediately if visibility is Public.",
};

const ROLES: { value: HubRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Admin', description: 'Full edit access; can publish and invite.' },
  { value: 'editor', label: 'Editor', description: 'Edit curriculum and posts; cannot publish.' },
  { value: 'viewer', label: 'Viewer', description: 'View program structure & track progress.' },
];

const INVENTORY: CurriculumItem[] = [
  {
    id: 'inv_course_genai',
    type: 'course',
    title: 'Generative AI Fundamentals',
    slug: 'generative-ai-fundamentals',
    blurb: 'Discover the foundations of generative AI.',
    ownerHub: { hubId: 'h1', hubName: 'Bijibiji Initiative', hubLogo: null },
    isMandatory: false,
    prerequisiteIds: [],
    sourceId: 'course-v1:Mereka+GENAI101+2026',
  },
  {
    id: 'inv_exp_image',
    type: 'experience',
    title: 'Image Gen Crash Course',
    slug: 'image-gen-crash-course',
    blurb: 'In-person hands-on workshop.',
    ownerHub: { hubId: 'h1', hubName: 'Bijibiji Initiative', hubLogo: null },
    isMandatory: false,
    prerequisiteIds: [],
    sourceId: 'exp_001',
  },
  {
    id: 'inv_expertise_pm',
    type: 'expertise',
    title: 'AI Product Management',
    slug: 'ai-product-management',
    blurb: '1:1 sessions with senior PMs.',
    ownerHub: { hubId: 'h1', hubName: 'Bijibiji Initiative', hubLogo: null },
    isMandatory: false,
    prerequisiteIds: [],
    sourceId: 'expertise_001',
  },
  {
    id: 'inv_course_ux',
    type: 'course',
    title: 'UX Design Principles',
    slug: 'ux-design-principles',
    blurb: 'Foundational UX research, IA and prototyping.',
    ownerHub: { hubId: 'h1', hubName: 'Bijibiji Initiative', hubLogo: null },
    isMandatory: false,
    prerequisiteIds: [],
    sourceId: 'course-v1:Mereka+UXDP101+2026',
  },
  {
    id: 'inv_expertise_ux',
    type: 'expertise',
    title: 'UX Mentorship',
    slug: 'ux-mentorship',
    blurb: 'Weekly 1:1 portfolio reviews with senior designers.',
    ownerHub: { hubId: 'h1', hubName: 'Bijibiji Initiative', hubLogo: null },
    isMandatory: false,
    prerequisiteIds: [],
    sourceId: 'expertise_002',
  },
];

type InvFilter = 'all' | 'course' | 'experience' | 'expertise';

/**
 * Program creation wizard — Figma 5208:67078.
 * Steps: Basic Info → Timeline → Collaborators → Structure → Landing Page → Publish.
 * Right-side TIPS column updates per step.
 */
@Component({
  selector: 'mereka-program-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-create.page.html',
})
export class ProgramCreatePage {
  private readonly auth = inject(AuthService);
  readonly user = this.auth.user;
  readonly hubs = this.auth.hubs;

  readonly steps = STEPS;
  readonly roles = ROLES;
  readonly inventory = INVENTORY;
  readonly invFilters: InvFilter[] = ['all', 'course', 'experience', 'expertise'];

  readonly active = signal<Step['key']>('basic');
  readonly activeTip = computed(() => TIPS[this.active()]);
  readonly hasPrev = computed(() => this.active() !== 'basic');

  // Basic Info
  readonly title = signal('');
  readonly tagline = signal('');
  readonly description = signal('');
  readonly hosting = signal<'physical' | 'online'>('online');
  readonly visibility = signal<'public' | 'private'>('public');
  readonly addrStreet = signal('');
  readonly addrCountry = signal('');
  readonly addrState = signal('');
  readonly addrCity = signal('');
  readonly addrPost = signal('');
  readonly tags = signal<string[]>([]);
  readonly tagDraft = signal('');

  commitTag(): void {
    const t = this.tagDraft().trim();
    if (!t) return;
    if (this.tags().length >= 5) return;
    if (this.tags().includes(t)) return;
    this.tags.update((arr) => [...arr, t]);
    this.tagDraft.set('');
  }
  removeTag(idx: number): void {
    this.tags.update((arr) => arr.filter((_, i) => i !== idx));
  }

  // Timeline
  readonly enrollStart = signal('');
  readonly enrollEnd = signal('');
  readonly startsAt = signal('');
  readonly endsAt = signal('');

  // Collaborators
  readonly collaborators = signal<Array<{ hubId: string | null; role: HubRole }>>([
    { hubId: null, role: 'viewer' },
  ]);
  addCollaborator(): void {
    this.collaborators.update((c) => [...c, { hubId: null, role: 'viewer' }]);
  }
  removeCollaborator(idx: number): void {
    this.collaborators.update((c) => c.filter((_, i) => i !== idx));
  }
  updateCollaborator(idx: number, patch: Partial<{ hubId: string | null; role: HubRole }>): void {
    this.collaborators.update((c) => c.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  }

  // Structure / Add curriculum modal
  readonly curriculum = signal<CurriculumItem[]>([]);
  readonly openCurriculumPicker = signal(false);
  readonly invSearch = signal('');
  readonly invFilter = signal<InvFilter>('all');

  readonly filteredInventory = computed(() => {
    const q = this.invSearch().trim().toLowerCase();
    const f = this.invFilter();
    return this.inventory.filter((it) => {
      if (f !== 'all' && it.type !== f) return false;
      if (q && !it.title.toLowerCase().includes(q)) return false;
      return true;
    });
  });

  addToCurriculum(item: CurriculumItem): void {
    this.curriculum.update((c) => (c.find((i) => i.id === item.id) ? c : [...c, { ...item }]));
  }
  removeFromCurriculum(id: string): void {
    this.curriculum.update((c) => c.filter((i) => i.id !== id));
  }
  toggleMandatory(id: string): void {
    this.curriculum.update((c) =>
      c.map((i) => (i.id === id ? { ...i, isMandatory: !i.isMandatory } : i)),
    );
  }

  // Pricing (kept from original)
  readonly isPaid = signal(false);
  readonly price = signal<number | null>(null);

  // Step navigation
  setActive(step: Step['key']): void {
    this.active.set(step);
  }
  nextStep(): void {
    const i = STEPS.findIndex((s) => s.key === this.active());
    if (i < 0) return;
    if (i === STEPS.length - 1) {
      this.publish();
      return;
    }
    this.active.set(STEPS[i + 1].key);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  prevStep(): void {
    const i = STEPS.findIndex((s) => s.key === this.active());
    if (i > 0) this.active.set(STEPS[i - 1].key);
  }

  readonly canPublish = computed(
    () =>
      this.title().length > 3 &&
      this.curriculum().length > 0 &&
      (this.isPaid() ? (this.price() ?? 0) > 0 : true),
  );

  readonly validCollaboratorCount = computed(
    () => this.collaborators().filter((c) => c.hubId !== null).length,
  );

  goBack(): void {
    history.back();
  }

  publish(): void {
    // eslint-disable-next-line no-alert
    alert(
      `Program "${this.title()}" would be published with ${this.curriculum().length} items, ` +
        `${this.validCollaboratorCount()} collaborators, ${this.hosting()} hosting, ${this.visibility()} visibility.`,
    );
  }
}
