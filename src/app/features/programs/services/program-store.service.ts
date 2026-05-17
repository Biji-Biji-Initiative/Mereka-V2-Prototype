import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import type {
  CurriculumItem,
  HubRef,
  HubRole,
  Program,
  ProgramCollaborator,
  ProgramPricing,
  ProgramStatus,
  ProgramTimeline,
} from '../models/program.model';

export interface CreateProgramPayload {
  title: string;
  tagline: string;
  description: string;
  timeline: ProgramTimeline;
  collaborators: Array<{ hubId: string; hubName: string; hubLogo: string | null; role: HubRole }>;
  curriculum: CurriculumItem[];
  pricing: ProgramPricing;
  visibility: 'public' | 'private';
  status?: ProgramStatus;
}

const STORAGE_KEY = 'mereka_programs';

/**
 * Prototype-only: persists user-created programs in localStorage.
 * When a real backend ships, this can be replaced by ProgramsService HTTP calls.
 */
@Injectable({ providedIn: 'root' })
export class ProgramStoreService {
  private readonly auth = inject(AuthService);

  /** Reactive signal of all user-created programs. */
  private readonly _programs = signal<Program[]>(this.loadFromStorage());
  readonly programs = this._programs.asReadonly();

  /** Programs owned by the current user (or all programs if no user logged in — prototype). */
  readonly myPrograms = computed(() => {
    const user = this.auth.user();
    // In prototype mode, show all stored programs regardless of user
    if (!user) return this._programs();
    const filtered = this._programs().filter((p) => p.id.includes(user.id));
    // If no programs match the user but programs exist, show all (prototype fallback)
    return filtered.length > 0 ? filtered : this._programs();
  });

  /** Create a new program and persist it. Returns the created program. */
  create(payload: CreateProgramPayload): Program {
    const user = this.auth.user() ?? { id: 'proto-user', name: 'Prototype User' } as any;

    const slug = this.generateSlug(payload.title);
    const now = new Date().toISOString();

    // Owner hub: use first collaborator hub if available, otherwise create a user-hub
    const userHubs = this.auth.hubs();
    const ownerHub: HubRef = userHubs.length > 0
      ? { hubId: userHubs[0].hubId, hubName: userHubs[0].hubName, hubLogo: userHubs[0].hubLogo, slug: this.generateSlug(userHubs[0].hubName) }
      : { hubId: `user-${user.id}`, hubName: user.name, hubLogo: null, slug: this.generateSlug(user.name) };

    const collaborators: ProgramCollaborator[] = payload.collaborators
      .filter((c) => c.hubId)
      .map((c) => ({
        hub: { hubId: c.hubId, hubName: c.hubName, hubLogo: c.hubLogo },
        role: c.role,
        invitedAt: now,
        acceptedAt: now,
      }));

    const program: Program = {
      id: `prog-${user.id}-${Date.now()}`,
      slug,
      title: payload.title,
      tagline: payload.tagline,
      description: payload.description,
      coverImageUrl: `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(slug)}`,
      ownerHub,
      collaborators,
      pricing: payload.pricing,
      status: payload.status ?? 'published',
      visibility: payload.visibility,
      timeline: payload.timeline,
      curriculum: payload.curriculum,
      stats: { memberCount: 1, expertCount: 0, mentorCount: 0 },
      recentPosts: [],
    };

    this._programs.update((list) => [...list, program]);
    this.saveToStorage();
    return program;
  }

  /** Get a program by slug (user-created only). */
  bySlug(slug: string): Program | undefined {
    return this._programs().find((p) => p.slug === slug);
  }

  /** Update a program's status. */
  updateStatus(slug: string, status: ProgramStatus): void {
    this._programs.update((list) =>
      list.map((p) => (p.slug === slug ? { ...p, status } : p)),
    );
    this.saveToStorage();
  }

  /** Update program fields. */
  update(slug: string, patch: Partial<Program>): void {
    this._programs.update((list) =>
      list.map((p) => (p.slug === slug ? { ...p, ...patch } : p)),
    );
    this.saveToStorage();
  }

  /** Delete a program. */
  delete(slug: string): void {
    this._programs.update((list) => list.filter((p) => p.slug !== slug));
    this.saveToStorage();
  }

  /** Get all user-created programs (for merging with fixtures). */
  getAll(): Program[] {
    return this._programs();
  }

  // ---------------------------------------------------------------------------
  private generateSlug(title: string): string {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);
    // Ensure uniqueness
    const existing = this._programs().find((p) => p.slug === base);
    return existing ? `${base}-${Date.now().toString(36)}` : base;
  }

  private loadFromStorage(): Program[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._programs()));
    } catch {
      // Storage full or unavailable — prototype gracefully ignores
    }
  }
}
