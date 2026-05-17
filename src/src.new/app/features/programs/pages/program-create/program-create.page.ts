import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../../core/services/auth.service';
import type { CurriculumItem, HubRole, ProgramCollaborator } from '../../models/program.model';

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
];

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

  readonly active = signal<Step['key']>('basic');

  // Basic Info ----------------------------------------------------------------
  readonly title = signal('');
  readonly tagline = signal('');
  readonly description = signal('');

  // Timeline ------------------------------------------------------------------
  readonly enrollStart = signal('');
  readonly enrollEnd = signal('');
  readonly startsAt = signal('');
  readonly endsAt = signal('');

  // Collaborators -------------------------------------------------------------
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

  // Structure -----------------------------------------------------------------
  readonly curriculum = signal<CurriculumItem[]>([]);

  addToCurriculum(item: CurriculumItem): void {
    this.curriculum.update((c) =>
      c.find((i) => i.id === item.id) ? c : [...c, { ...item }],
    );
  }
  removeFromCurriculum(id: string): void {
    this.curriculum.update((c) => c.filter((i) => i.id !== id));
  }
  toggleMandatory(id: string): void {
    this.curriculum.update((c) =>
      c.map((i) => (i.id === id ? { ...i, isMandatory: !i.isMandatory } : i)),
    );
  }

  // Pricing -------------------------------------------------------------------
  readonly isPaid = signal(false);
  readonly price = signal<number | null>(null);

  // Navigation ----------------------------------------------------------------
  setActive(step: Step['key']): void {
    this.active.set(step);
  }

  readonly canPublish = computed(
    () =>
      this.title().length > 3 &&
      this.tagline().length > 3 &&
      this.curriculum().length > 0 &&
      (this.isPaid() ? (this.price() ?? 0) > 0 : true),
  );

  /** Number of collaborator rows where a hub has actually been picked. */
  readonly validCollaboratorCount = computed(
    () => this.collaborators().filter((c) => c.hubId !== null).length,
  );

  /** Bound to the back button — Angular templates can't call `history` directly. */
  goBack(): void {
    history.back();
  }

  publish(): void {
    // In a real impl this calls ProgramsService.create — stubbed for the demo.
    // eslint-disable-next-line no-alert
    alert(
      `Program "${this.title()}" would be published with ${this.curriculum().length} items and ` +
        `${this.collaborators().filter((c) => c.hubId).length} collaborators.`,
    );
  }
}
