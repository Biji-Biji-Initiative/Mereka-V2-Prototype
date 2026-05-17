import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { ProgramStoreService } from '../../services/program-store.service';
import { ProgramFacadeService } from '../../services/program-facade.service';
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
  { key: 'landing', label: 'Landing page' },
  { key: 'publish', label: 'Publish' },
];

const ROLES: { value: HubRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Admin', description: 'Full edit access; can publish and invite.' },
  { value: 'editor', label: 'Editor', description: 'Edit curriculum and posts; cannot publish.' },
  { value: 'viewer', label: 'Viewer', description: 'View program structure & track progress.' },
];

interface StructureItem extends CurriculumItem {
  hasDeadline: boolean;
  hasBadge: boolean;
  hasPrerequisite: boolean;
  badgeFile: string;
}

const MOCK_EXPERTS = [
  { id: 'exp1', name: 'Jey Bala', hub: 'Bijibiji Initiative', avatar: '' },
  { id: 'exp2', name: 'Rashvin Pal Singh', hub: 'Bijibiji Initiative', avatar: '' },
  { id: 'exp3', name: 'Mala K', hub: 'Bijibiji Initiative', avatar: '' },
];

const INVENTORY: CurriculumItem[] = [
  {
    id: 'inv_course_genai', type: 'course', title: 'Generative AI Fundamentals',
    slug: 'generative-ai-fundamentals', blurb: 'Discover the foundations of generative AI.',
    ownerHub: { hubId: 'h1', hubName: 'Bijibiji Initiative', hubLogo: null },
    isMandatory: false, prerequisiteIds: [], sourceId: 'course-v1:Mereka+GENAI101+2026',
  },
  {
    id: 'inv_exp_image', type: 'experience', title: 'Image Gen Crash Course',
    slug: 'image-gen-crash-course', blurb: 'In-person hands-on workshop.',
    ownerHub: { hubId: 'h1', hubName: 'Bijibiji Initiative', hubLogo: null },
    isMandatory: false, prerequisiteIds: [], sourceId: 'exp_001',
  },
  {
    id: 'inv_expertise_pm', type: 'expertise', title: 'AI Product Management',
    slug: 'ai-product-management', blurb: '1:1 sessions with senior PMs.',
    ownerHub: { hubId: 'h1', hubName: 'Bijibiji Initiative', hubLogo: null },
    isMandatory: false, prerequisiteIds: [], sourceId: 'expertise_001',
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
  private readonly store = inject(ProgramStoreService);
  private readonly facade = inject(ProgramFacadeService);
  private readonly router = inject(Router);
  readonly user = this.auth.user;
  readonly hubs = this.auth.hubs;
  readonly isPublishing = signal(false);
  readonly isSaving = signal(false);
  readonly saveSuccess = signal('');

  readonly steps = STEPS;
  readonly roles = ROLES;
  /** Dynamic inventory: combines hardcoded items with items from all existing programs. */
  readonly inventory = computed<CurriculumItem[]>(() => {
    const fromFacade = this.facade.availableCurriculum();
    // Merge: static INVENTORY first, then deduplicated facade items
    const seen = new Set(INVENTORY.map(i => i.sourceId));
    const extra = fromFacade.filter(i => !seen.has(i.sourceId));
    return [...INVENTORY, ...extra];
  });
  readonly mockExperts = MOCK_EXPERTS;

  readonly active = signal<Step['key']>('basic');

  // ── Basic Info ──────────────────────────────────────────────────────
  readonly title = signal('');
  readonly tagline = signal('');
  readonly description = signal('');

  // ── Timeline ───────────────────────────────────────────────────────
  readonly enrollStart = signal('');
  readonly enrollEnd = signal('');
  readonly startsAt = signal('');
  readonly endsAt = signal('');

  // ── Collaborators ──────────────────────────────────────────────────
  readonly collaborators = signal<Array<{ hubId: string | null; role: HubRole }>>(
    this.hubs().length > 0
      ? [{ hubId: this.hubs()[0].hubId, role: 'admin' }]
      : [{ hubId: null, role: 'viewer' }],
  );

  addCollaborator(): void {
    this.collaborators.update((c) => [...c, { hubId: null, role: 'viewer' }]);
  }
  removeCollaborator(idx: number): void {
    this.collaborators.update((c) => c.filter((_, i) => i !== idx));
  }
  updateCollaborator(idx: number, patch: Partial<{ hubId: string | null; role: HubRole }>): void {
    this.collaborators.update((c) => c.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  }

  // ── Structure ──────────────────────────────────────────────────────
  readonly structureItems = signal<StructureItem[]>([]);
  readonly structureExpanded = signal<Record<string, boolean>>({ course: true, experience: true, expertise: true });

  readonly courses = computed(() => this.structureItems().filter((i) => i.type === 'course'));
  readonly experiences = computed(() => this.structureItems().filter((i) => i.type === 'experience'));
  readonly expertiseItems = computed(() => this.structureItems().filter((i) => i.type === 'expertise'));

  /** For backward compat with save — extract CurriculumItem[] from structureItems */
  readonly curriculum = computed(() =>
    this.structureItems().map((s): CurriculumItem => ({
      id: s.id, type: s.type, title: s.title, slug: s.slug, blurb: s.blurb,
      ownerHub: s.ownerHub, isMandatory: s.isMandatory,
      deadline: s.hasDeadline ? s.deadline : undefined,
      prerequisiteIds: s.prerequisiteIds, sourceId: s.sourceId,
    })),
  );

  toggleSection(section: string): void {
    this.structureExpanded.update((s) => ({ ...s, [section]: !s[section] }));
  }

  addStructureItem(type: 'course' | 'experience' | 'expertise'): void {
    const existing = this.structureItems();
    // Pick from inventory items of same type that aren't already added
    const available = this.inventory().filter(
      (inv) => inv.type === type && !existing.find((e) => e.id === inv.id),
    );
    if (available.length > 0) {
      const item = available[0];
      this.structureItems.update((items) => [
        ...items,
        { ...item, hasDeadline: true, hasBadge: true, hasPrerequisite: true, badgeFile: '' },
      ]);
    } else {
      // Create a placeholder
      const id = `new_${type}_${Date.now()}`;
      this.structureItems.update((items) => [
        ...items,
        {
          id, type, title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`, slug: id,
          blurb: '', ownerHub: { hubId: 'h1', hubName: 'Bijibiji Initiative', hubLogo: null },
          isMandatory: false, prerequisiteIds: [], sourceId: id,
          hasDeadline: true, hasBadge: true, hasPrerequisite: true, badgeFile: '',
        },
      ]);
    }
  }

  removeStructureItem(id: string): void {
    this.structureItems.update((items) => items.filter((i) => i.id !== id));
  }

  toggleStructureMandatory(id: string): void {
    this.structureItems.update((items) =>
      items.map((i) => (i.id === id ? { ...i, isMandatory: !i.isMandatory } : i)),
    );
  }

  toggleStructureFlag(id: string, flag: 'hasDeadline' | 'hasBadge' | 'hasPrerequisite'): void {
    this.structureItems.update((items) =>
      items.map((i) => (i.id === id ? { ...i, [flag]: !i[flag] } : i)),
    );
  }

  updateStructureDeadline(id: string, date: string): void {
    this.structureItems.update((items) =>
      items.map((i) => (i.id === id ? { ...i, deadline: date } : i)),
    );
  }

  // ── Landing Page ───────────────────────────────────────────────────
  readonly landingNameSameAsBasic = signal(true);
  readonly landingDescSameAsBasic = signal(false);
  readonly landingName = computed(() => this.landingNameSameAsBasic() ? this.title() : this.landingNameOverride());
  readonly landingNameOverride = signal('');
  readonly landingDesc = computed(() => this.landingDescSameAsBasic() ? this.description() : this.landingDescOverride());
  readonly landingDescOverride = signal('');

  readonly partners = signal<Array<{ name: string; logoUrl: string; website: string }>>([
    { name: '', logoUrl: '', website: '' },
  ]);
  addPartner(): void {
    this.partners.update((p) => [...p, { name: '', logoUrl: '', website: '' }]);
  }
  removePartner(idx: number): void {
    this.partners.update((p) => p.filter((_, i) => i !== idx));
  }
  updatePartner(idx: number, field: 'name' | 'logoUrl' | 'website', value: string): void {
    this.partners.update((p) => p.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  }

  readonly learningOutcomes = signal<string[]>(['', '', '']);
  addLearningOutcome(): void {
    this.learningOutcomes.update((o) => [...o, '']);
  }
  updateLearningOutcome(idx: number, value: string): void {
    this.learningOutcomes.update((o) => o.map((v, i) => (i === idx ? value : v)));
  }

  readonly selectedExperts = signal<Set<string>>(new Set(['exp1']));
  readonly expertSearch = signal('');
  readonly filteredExperts = computed(() => {
    const q = this.expertSearch().toLowerCase();
    return q ? this.mockExperts.filter((e) => e.name.toLowerCase().includes(q)) : this.mockExperts;
  });
  toggleExpert(id: string): void {
    this.selectedExperts.update((s) => {
      const copy = new Set(s);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  }

  readonly faqLink = signal('');

  // ── Pricing ────────────────────────────────────────────────────────
  readonly isPaid = signal(false);
  readonly price = signal<number | null>(null);

  // ── Navigation ─────────────────────────────────────────────────────
  setActive(step: Step['key']): void {
    this.active.set(step);
  }

  nextStep(): void {
    const keys = STEPS.map((s) => s.key);
    const idx = keys.indexOf(this.active());
    if (idx < keys.length - 1) this.active.set(keys[idx + 1]);
  }

  readonly canPublish = computed(
    () =>
      this.title().length > 3 &&
      (this.isPaid() ? (this.price() ?? 0) > 0 : true),
  );

  readonly validCollaboratorCount = computed(
    () => this.collaborators().filter((c) => c.hubId !== null).length,
  );

  private readonly location = inject(Location);
  /** Step back through the wizard if we can; otherwise SPA history back, falling back to /programs. */
  goBack(): void {
    const keys = STEPS.map(s => s.key);
    const idx = keys.indexOf(this.active());
    if (idx > 0) { this.active.set(keys[idx - 1]); return; }
    // First step (basic) — try SPA history; fall back to /programs after a beat.
    const before = (typeof window !== 'undefined') ? window.location.pathname : '';
    this.location.back();
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.location.pathname === before) {
        window.location.assign(window.location.pathname.replace(/\/programs\/new.*$/, '/programs'));
      }
    }, 100);
  }

  // ── Save / Publish ────────────────────────────────────────────────
  save(status: 'published' | 'draft' = 'published'): void {
    if (this.isPublishing() || this.isSaving()) return;
    if (status === 'published' && !this.canPublish()) return;
    if (status === 'draft' && this.title().length < 2) return;

    if (status === 'draft') this.isSaving.set(true);
    else this.isPublishing.set(true);

    const allHubs = this.hubs();
    const collabs = this.collaborators()
      .filter((c) => c.hubId !== null)
      .map((c) => {
        const hub = allHubs.find((h) => h.hubId === c.hubId);
        return {
          hubId: c.hubId!,
          hubName: hub?.hubName ?? 'Unknown Hub',
          hubLogo: hub?.hubLogo ?? null,
          role: c.role,
        };
      });

    try {
      this.store.create({
        title: this.title(),
        tagline: this.tagline(),
        description: this.description(),
        timeline: {
          enrollStart: this.enrollStart() || undefined,
          enrollEnd: this.enrollEnd() || undefined,
          startsAt: this.startsAt() || undefined,
          endsAt: this.endsAt() || undefined,
        },
        collaborators: collabs,
        curriculum: this.curriculum(),
        pricing: this.isPaid()
          ? { kind: 'paid', price: this.price() ?? 0, currency: 'MYR' }
          : { kind: 'free' },
        visibility: 'public',
        status,
      });

      this.router.navigate(['/dashboard/programs']);
    } catch {
      this.isPublishing.set(false);
      this.isSaving.set(false);
      alert('Failed to save program. Please try again.');
    }
  }

  publish(): void {
    this.save('published');
  }
}
