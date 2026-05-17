import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { ProgramStoreService } from '../../services/program-store.service';
import type { CurriculumItem, HubRole, Program } from '../../models/program.model';

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
  { key: 'publish', label: 'Review & Save' },
];

const ROLES: { value: HubRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Admin', description: 'Full edit access; can publish and invite.' },
  { value: 'editor', label: 'Editor', description: 'Edit curriculum and posts; cannot publish.' },
  { value: 'viewer', label: 'Viewer', description: 'View program structure & track progress.' },
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
  selector: 'mereka-program-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen" *ngIf="program()">
      <div class="max-w-[1320px] mx-auto px-6 py-8 grid grid-cols-12 gap-6">
        <!-- Side stepper -->
        <aside class="col-span-12 md:col-span-3">
          <div class="sticky top-20 bg-white rounded-lg border border-neutral-200 p-5">
            <button type="button" class="text-neutral-400 mb-2" (click)="goBack()">← Back</button>
            <h2 class="text-xl font-semibold mb-1">Edit Program</h2>
            <p class="text-xs text-neutral-400 mb-5">{{ program()!.title }}</p>
            <ul class="space-y-1">
              <li *ngFor="let step of steps">
                <button
                  type="button"
                  class="w-full text-left px-4 py-2 rounded-full text-sm"
                  [class.bg-neutral-900]="active() === step.key"
                  [class.text-white]="active() === step.key"
                  [class.text-neutral-700]="active() !== step.key"
                  [class.hover:bg-neutral-100]="active() !== step.key"
                  (click)="setActive(step.key)"
                >
                  {{ step.label }}
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Main panel -->
        <main class="col-span-12 md:col-span-9">
          <div class="bg-white rounded-lg border border-neutral-200 p-8 min-h-[460px]">
            <ng-container [ngSwitch]="active()">

              <!-- BASIC INFO -->
              <section *ngSwitchCase="'basic'" class="space-y-5 max-w-2xl">
                <header>
                  <h3 class="text-xl font-semibold">Basic Info</h3>
                  <p class="text-sm text-neutral-500">Edit your program's core information.</p>
                </header>
                <label class="block">
                  <span class="text-sm font-medium">Title *</span>
                  <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200 focus:outline-none focus:border-neutral-400"
                    [ngModel]="title()" (ngModelChange)="title.set($event)" placeholder="Program title" />
                </label>
                <label class="block">
                  <span class="text-sm font-medium">Tagline *</span>
                  <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200 focus:outline-none focus:border-neutral-400"
                    [ngModel]="tagline()" (ngModelChange)="tagline.set($event)" placeholder="Short tagline" />
                </label>
                <label class="block">
                  <span class="text-sm font-medium">Description</span>
                  <textarea rows="6" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200 focus:outline-none focus:border-neutral-400"
                    [ngModel]="description()" (ngModelChange)="description.set($event)"></textarea>
                </label>
                <div>
                  <span class="text-sm font-medium block mb-2">Pricing</span>
                  <label class="inline-flex items-center gap-2 mr-4 text-sm">
                    <input type="radio" [checked]="!isPaid()" (change)="isPaid.set(false)" /> Free
                  </label>
                  <label class="inline-flex items-center gap-2 text-sm">
                    <input type="radio" [checked]="isPaid()" (change)="isPaid.set(true)" /> Paid
                  </label>
                  <div *ngIf="isPaid()" class="mt-2 max-w-xs">
                    <input type="number" min="0" class="w-full px-3 py-2 rounded border border-neutral-200"
                      placeholder="MYR" [ngModel]="price()" (ngModelChange)="price.set($event)" />
                  </div>
                </div>
              </section>

              <!-- TIMELINE -->
              <section *ngSwitchCase="'timeline'" class="space-y-5 max-w-xl">
                <header>
                  <h3 class="text-xl font-semibold">Timeline</h3>
                  <p class="text-sm text-neutral-500">When does enrolment open and the cohort run?</p>
                </header>
                <div class="grid grid-cols-2 gap-4">
                  <label class="block">
                    <span class="text-sm font-medium">Enrolment opens</span>
                    <input type="date" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200"
                      [ngModel]="enrollStart()" (ngModelChange)="enrollStart.set($event)" />
                  </label>
                  <label class="block">
                    <span class="text-sm font-medium">Enrolment closes</span>
                    <input type="date" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200"
                      [ngModel]="enrollEnd()" (ngModelChange)="enrollEnd.set($event)" />
                  </label>
                  <label class="block">
                    <span class="text-sm font-medium">Program starts</span>
                    <input type="date" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200"
                      [ngModel]="startsAt()" (ngModelChange)="startsAt.set($event)" />
                  </label>
                  <label class="block">
                    <span class="text-sm font-medium">Program ends</span>
                    <input type="date" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200"
                      [ngModel]="endsAt()" (ngModelChange)="endsAt.set($event)" />
                  </label>
                </div>
              </section>

              <!-- COLLABORATORS -->
              <section *ngSwitchCase="'collaborators'">
                <header>
                  <h3 class="text-xl font-semibold">Program Partnership</h3>
                  <p class="text-sm text-neutral-500">Invite partner hubs and define roles.</p>
                </header>
                <div class="mt-6 space-y-4">
                  <div *ngFor="let row of collaborators(); let i = index" class="grid grid-cols-12 gap-4 items-end">
                    <label class="col-span-5">
                      <span class="text-sm font-medium block mb-1">Hub</span>
                      <select class="w-full px-3 py-2 rounded border border-neutral-200"
                        [ngModel]="row.hubId" (ngModelChange)="updateCollaborator(i, { hubId: $event })">
                        <option [ngValue]="null" disabled>Select hub…</option>
                        <option *ngFor="let h of hubs()" [ngValue]="h.hubId">{{ h.hubName }}</option>
                      </select>
                    </label>
                    <label class="col-span-5">
                      <span class="text-sm font-medium block mb-1">Role</span>
                      <select class="w-full px-3 py-2 rounded border border-neutral-200"
                        [ngModel]="row.role" (ngModelChange)="updateCollaborator(i, { role: $event })">
                        <option *ngFor="let r of roles" [ngValue]="r.value">{{ r.label }} — {{ r.description }}</option>
                      </select>
                    </label>
                    <button type="button" (click)="removeCollaborator(i)" class="col-span-2 text-neutral-400 hover:text-red-500 text-sm py-2">Remove</button>
                  </div>
                  <button type="button" (click)="addCollaborator()" class="text-sm text-blue-700 font-medium">+ Add hub</button>
                </div>
              </section>

              <!-- STRUCTURE -->
              <section *ngSwitchCase="'structure'">
                <header>
                  <h3 class="text-xl font-semibold">Program Structure</h3>
                  <p class="text-sm text-neutral-500">Assemble the courses, experiences, and expertise.</p>
                </header>
                <div class="mt-6 grid grid-cols-2 gap-6">
                  <div>
                    <h4 class="font-semibold mb-3">Inventory</h4>
                    <ul class="space-y-2">
                      <li *ngFor="let item of inventory" class="flex items-center justify-between border border-neutral-200 rounded p-3">
                        <div class="flex items-center gap-3">
                          <span class="text-xl">{{ item.type === 'course' ? '📘' : item.type === 'experience' ? '🎟️' : '🧑‍🏫' }}</span>
                          <div>
                            <div class="font-medium text-sm">{{ item.title }}</div>
                            <div class="text-xs text-neutral-500">{{ item.type | titlecase }} · {{ item.ownerHub.hubName }}</div>
                          </div>
                        </div>
                        <button type="button" (click)="addToCurriculum(item)" class="text-blue-700 font-bold text-lg"
                          [disabled]="isCurriculumItem(item.id)" [class.opacity-30]="isCurriculumItem(item.id)">+</button>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-semibold mb-3">Active Curriculum ({{ curriculum().length }})</h4>
                    <div *ngIf="curriculum().length === 0" class="text-sm text-neutral-500">Nothing here yet — add items from the Inventory.</div>
                    <ul class="space-y-3">
                      <li *ngFor="let item of curriculum()" class="border border-neutral-200 rounded p-3">
                        <div class="flex items-center justify-between">
                          <div class="font-medium text-sm">{{ item.title }}</div>
                          <button type="button" (click)="removeFromCurriculum(item.id)" class="text-neutral-400 hover:text-red-500 text-xs">Remove</button>
                        </div>
                        <label class="mt-2 flex items-center gap-2 text-sm">
                          <input type="checkbox" [checked]="item.isMandatory" (change)="toggleMandatory(item.id)" />
                          Mandatory for program completion
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <!-- LANDING PAGE -->
              <section *ngSwitchCase="'landing'" class="max-w-xl text-sm text-neutral-500">
                <h3 class="text-xl font-semibold text-neutral-900 mb-2">Landing Page</h3>
                <p>The auto-generated landing page picks up your title, tagline, hub partners, and cover image. Custom landing page editing coming soon.</p>
              </section>

              <!-- REVIEW & SAVE -->
              <section *ngSwitchCase="'publish'" class="max-w-lg">
                <h3 class="text-xl font-semibold mb-4">Review & Save</h3>

                <div class="bg-neutral-50 rounded-lg p-5 mb-6 space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-neutral-500">Title:</span><span class="font-medium">{{ title() || '—' }}</span></div>
                  <div class="flex justify-between text-sm"><span class="text-neutral-500">Tagline:</span><span class="font-medium">{{ tagline() || '—' }}</span></div>
                  <div class="flex justify-between text-sm"><span class="text-neutral-500">Curriculum items:</span><span class="font-medium">{{ curriculum().length }}</span></div>
                  <div class="flex justify-between text-sm"><span class="text-neutral-500">Collaborators:</span><span class="font-medium">{{ validCollaboratorCount() }}</span></div>
                  <div class="flex justify-between text-sm"><span class="text-neutral-500">Pricing:</span><span class="font-medium">{{ isPaid() ? 'Paid (MYR ' + (price() ?? 0) + ')' : 'Free' }}</span></div>
                  <div class="flex justify-between text-sm"><span class="text-neutral-500">Status:</span>
                    <span class="font-medium" [style.color]="program()!.status === 'published' ? '#2E7D32' : '#F57F17'">{{ program()!.status | titlecase }}</span>
                  </div>
                </div>

                <div class="flex gap-3">
                  <button type="button" (click)="saveChanges('draft')" [disabled]="isSaving()"
                    class="px-5 py-2.5 rounded-full border border-neutral-300 text-neutral-700 font-medium text-sm hover:bg-neutral-50"
                    [class.opacity-40]="isSaving()">
                    Save as Draft
                  </button>
                  <button type="button" (click)="saveChanges('published')" [disabled]="!canPublish() || isSaving()"
                    class="px-5 py-2.5 rounded-full bg-neutral-900 text-white font-medium text-sm"
                    [class.opacity-40]="!canPublish() || isSaving()">
                    {{ isSaving() ? 'Saving…' : 'Save & Publish' }}
                  </button>
                </div>

                <div *ngIf="saveMessage()" class="mt-4 text-sm text-green-700 bg-green-50 rounded-lg px-4 py-2">{{ saveMessage() }}</div>
              </section>
            </ng-container>
          </div>
        </main>
      </div>
    </div>

    <!-- Not found state -->
    <div *ngIf="!program() && loaded()" class="min-h-screen flex items-center justify-center bg-neutral-50">
      <div class="text-center">
        <h2 class="text-2xl font-bold mb-2">Program Not Found</h2>
        <p class="text-neutral-500 mb-6">The program you're looking for doesn't exist or has been deleted.</p>
        <a routerLink="/dashboard/programs" class="px-5 py-2.5 rounded-full bg-neutral-900 text-white font-medium text-sm inline-block no-underline">Go to Manage Programs</a>
      </div>
    </div>
  `,
})
export class ProgramEditPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly store = inject(ProgramStoreService);

  readonly hubs = this.auth.hubs;
  readonly steps = STEPS;
  readonly roles = ROLES;
  readonly inventory = INVENTORY;

  readonly active = signal<Step['key']>('basic');
  readonly program = signal<Program | null>(null);
  readonly loaded = signal(false);
  readonly isSaving = signal(false);
  readonly saveMessage = signal('');

  // Form fields
  readonly title = signal('');
  readonly tagline = signal('');
  readonly description = signal('');
  readonly enrollStart = signal('');
  readonly enrollEnd = signal('');
  readonly startsAt = signal('');
  readonly endsAt = signal('');
  readonly collaborators = signal<Array<{ hubId: string | null; role: HubRole }>>([]);
  readonly curriculum = signal<CurriculumItem[]>([]);
  readonly isPaid = signal(false);
  readonly price = signal<number | null>(null);

  readonly canPublish = computed(() =>
    this.title().length > 3 && this.tagline().length > 3 && this.curriculum().length > 0 &&
    (this.isPaid() ? (this.price() ?? 0) > 0 : true)
  );
  readonly validCollaboratorCount = computed(() => this.collaborators().filter(c => c.hubId !== null).length);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      const p = this.store.bySlug(slug);
      if (p) {
        this.program.set(p);
        this.title.set(p.title);
        this.tagline.set(p.tagline);
        this.description.set(p.description);
        this.enrollStart.set(p.timeline.enrollStart ?? '');
        this.enrollEnd.set(p.timeline.enrollEnd ?? '');
        this.startsAt.set(p.timeline.startsAt ?? '');
        this.endsAt.set(p.timeline.endsAt ?? '');
        this.curriculum.set([...p.curriculum]);
        this.collaborators.set(
          p.collaborators.map(c => ({ hubId: c.hub.hubId, role: c.role }))
        );
        if (p.pricing.kind === 'paid') {
          this.isPaid.set(true);
          this.price.set(p.pricing.price);
        }
      }
    }
    this.loaded.set(true);
  }

  setActive(step: Step['key']): void { this.active.set(step); }
  goBack(): void { this.router.navigate(['/dashboard/programs']); }

  // Collaborators
  addCollaborator(): void { this.collaborators.update(c => [...c, { hubId: null, role: 'viewer' }]); }
  removeCollaborator(idx: number): void { this.collaborators.update(c => c.filter((_, i) => i !== idx)); }
  updateCollaborator(idx: number, patch: Partial<{ hubId: string | null; role: HubRole }>): void {
    this.collaborators.update(c => c.map((row, i) => i === idx ? { ...row, ...patch } : row));
  }

  // Curriculum
  addToCurriculum(item: CurriculumItem): void {
    this.curriculum.update(c => c.find(i => i.id === item.id) ? c : [...c, { ...item }]);
  }
  removeFromCurriculum(id: string): void { this.curriculum.update(c => c.filter(i => i.id !== id)); }
  toggleMandatory(id: string): void {
    this.curriculum.update(c => c.map(i => i.id === id ? { ...i, isMandatory: !i.isMandatory } : i));
  }
  isCurriculumItem(id: string): boolean { return this.curriculum().some(i => i.id === id); }

  saveChanges(status: 'draft' | 'published'): void {
    const p = this.program();
    if (!p || this.isSaving()) return;
    this.isSaving.set(true);

    const allHubs = this.hubs();
    const collabs = this.collaborators()
      .filter(c => c.hubId !== null)
      .map(c => {
        const hub = allHubs.find(h => h.hubId === c.hubId);
        return {
          hub: { hubId: c.hubId!, hubName: hub?.hubName ?? c.hubId!, hubLogo: hub?.hubLogo ?? null },
          role: c.role,
          invitedAt: new Date().toISOString(),
          acceptedAt: new Date().toISOString(),
        };
      });

    this.store.update(p.slug, {
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
        ? { kind: 'paid' as const, price: this.price() ?? 0, currency: 'MYR' as const }
        : { kind: 'free' as const },
      status,
    });

    this.saveMessage.set(status === 'published' ? 'Program published successfully!' : 'Saved as draft.');
    this.isSaving.set(false);

    // Update local program ref
    const updated = this.store.bySlug(p.slug);
    if (updated) this.program.set(updated);

    // Navigate after a short delay so user sees the message
    setTimeout(() => {
      this.router.navigate(['/dashboard/programs']);
    }, 1200);
  }
}
