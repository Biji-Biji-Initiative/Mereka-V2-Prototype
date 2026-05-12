import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ProgramsService } from '../../../services/programs.service';

type Tab = 'all' | 'pending' | 'forms';

interface PendingApplicant {
  id: string;
  email: string;
  stage: 'New' | 'Reviewed' | 'Shortlisted';
  submittedAt: string;
  selected: boolean;
}

/**
 * Admin → Manage Members.
 * Tabs: All members | Pending approval | Application forms.
 * Figma references:
 *   - 5208:80547  Pending approval table
 *   - 5208:101482 Application forms section (Create Interest / Create Application)
 *   - 5208:71351  Members modal (with pending count badge)
 */
@Component({
  selector: 'mereka-admin-members-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2 class="text-2xl font-bold text-neutral-900">Manage Members</h2>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 bg-white text-sm hover:bg-neutral-50"
          (click)="copyInvite()"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          {{ copied() ? 'Link copied!' : 'Copy invite link' }}
        </button>
        <div class="flex items-center bg-white border border-neutral-200 rounded-full overflow-hidden">
          <input
            type="email"
            class="px-3 py-2 text-sm focus:outline-none w-56"
            placeholder="Invite member by email"
            [ngModel]="inviteEmail()"
            (ngModelChange)="inviteEmail.set($event)"
            (keydown.enter)="sendInvite()"
          />
          <button type="button" class="px-3 py-2 text-neutral-500 hover:text-neutral-900" (click)="sendInvite()" aria-label="Send invite">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </header>

    <nav class="flex gap-2 mb-6 text-sm">
      <button
        type="button"
        class="px-4 py-1.5 rounded-full transition"
        [class.bg-neutral-900]="active() === 'all'"
        [class.text-white]="active() === 'all'"
        [class.bg-neutral-100]="active() !== 'all'"
        [class.text-neutral-700]="active() !== 'all'"
        (click)="active.set('all')"
      >
        All members
      </button>
      <button
        type="button"
        class="px-4 py-1.5 rounded-full transition"
        [class.bg-neutral-900]="active() === 'pending'"
        [class.text-white]="active() === 'pending'"
        [class.bg-neutral-100]="active() !== 'pending'"
        [class.text-neutral-700]="active() !== 'pending'"
        (click)="active.set('pending')"
      >
        Pending approval
      </button>
      <button
        type="button"
        class="px-4 py-1.5 rounded-full transition"
        [class.bg-neutral-900]="active() === 'forms'"
        [class.text-white]="active() === 'forms'"
        [class.bg-neutral-100]="active() !== 'forms'"
        [class.text-neutral-700]="active() !== 'forms'"
        (click)="active.set('forms')"
      >
        Application forms
      </button>
    </nav>

    <!-- ALL MEMBERS ----------------------------------------------------- -->
    <section *ngIf="active() === 'all'" class="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead class="text-xs text-neutral-500 bg-neutral-50">
          <tr>
            <th class="text-left font-normal px-4 py-3">Name</th>
            <th class="text-left font-normal px-4 py-3">Role</th>
            <th class="text-left font-normal px-4 py-3">Joined</th>
            <th class="text-right font-normal px-4 py-3">Completion</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr *ngFor="let m of members()">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img *ngIf="m.avatar as a" [src]="a" [alt]="m.name" class="w-7 h-7 rounded-full" />
                <div>
                  <div class="font-medium">{{ m.name }}</div>
                  <div class="text-xs text-neutral-500">{{ m.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 capitalize">{{ m.role || 'member' }}</td>
            <td class="px-4 py-3 text-neutral-500">{{ m.joinedAt | date: 'MMM d, y' }}</td>
            <td class="px-4 py-3 text-right">
              <div class="inline-flex items-center gap-2">
                <div class="w-24 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div class="h-full bg-success" [style.width.%]="m.completionPercent || 0"></div>
                </div>
                <span class="tabular-nums text-xs text-neutral-500 w-8">{{ m.completionPercent || 0 }}%</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- PENDING APPROVAL  (Figma 5208:80547) ---------------------------- -->
    <section *ngIf="active() === 'pending'" class="bg-white border border-neutral-200 rounded-2xl">
      <header class="flex items-center justify-between gap-3 px-5 py-4 border-b border-neutral-100">
        <h3 class="font-bold text-neutral-900">Pending Approval</h3>
        <div class="flex items-center gap-2 text-xs">
          <button type="button" class="inline-flex items-center gap-1 text-success font-semibold hover:underline" (click)="approveSelected()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Approve selection
          </button>
          <button type="button" class="inline-flex items-center gap-1 text-error font-semibold hover:underline" (click)="rejectSelected()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Reject selection
          </button>
          <button type="button" class="text-neutral-500 hover:text-neutral-900" (click)="clearSelection()">Clear selection</button>
          <button type="button" class="text-neutral-500 hover:text-neutral-900">Done</button>
          <span class="ml-3 inline-flex items-center bg-neutral-50 border border-neutral-200 rounded-full pl-3 pr-2 text-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-1.5 text-neutral-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="search" placeholder="Search candidates" class="bg-transparent w-32 py-1.5 focus:outline-none" />
          </span>
        </div>
      </header>
      <table class="w-full text-sm">
        <thead class="text-xs text-neutral-500 bg-neutral-50">
          <tr>
            <th class="text-left font-normal px-4 py-3 w-10">
              <input type="checkbox" [checked]="allSelected()" (change)="toggleAll()" />
            </th>
            <th class="text-left font-normal px-4 py-3">Email</th>
            <th class="text-left font-normal px-4 py-3">Stage</th>
            <th class="text-left font-normal px-4 py-3">Date Submitted</th>
            <th class="text-right font-normal px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr *ngFor="let p of pending()" [class.bg-neutral-50]="p.selected">
            <td class="px-4 py-3">
              <input type="checkbox" [checked]="p.selected" (change)="toggleOne(p.id)" />
            </td>
            <td class="px-4 py-3 text-neutral-700">{{ p.email }}</td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                    [class.bg-info]="p.stage === 'New'"
                    [class.bg-opacity-10]="p.stage === 'New'"
                    [class.text-info]="p.stage === 'New'"
                    [class.bg-warning]="p.stage === 'Reviewed'"
                    [class.text-warning]="p.stage === 'Reviewed'"
                    [class.bg-success]="p.stage === 'Shortlisted'"
                    [class.text-success]="p.stage === 'Shortlisted'">
                {{ p.stage }}
              </span>
            </td>
            <td class="px-4 py-3 text-neutral-500">{{ p.submittedAt | date: 'd/M/yyyy, HH:mm' }}</td>
            <td class="px-4 py-3 text-right">
              <div class="inline-flex items-center gap-2 text-neutral-400">
                <button type="button" class="hover:text-success" aria-label="Approve" (click)="approveOne(p.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
                <button type="button" class="hover:text-error" aria-label="Reject" (click)="rejectOne(p.id)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <a href="#" class="text-neutral-700 hover:text-neutral-900 text-xs font-semibold ml-2">View Response</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <footer class="flex items-center justify-between px-5 py-3 text-xs text-neutral-500 border-t border-neutral-100">
        <span>Showing 1–{{ pending().length }} of {{ pending().length }}</span>
        <div class="flex items-center gap-1">
          <button class="w-7 h-7 rounded hover:bg-neutral-100">‹</button>
          <span class="px-2">1 / 1</span>
          <button class="w-7 h-7 rounded hover:bg-neutral-100">›</button>
        </div>
      </footer>
    </section>

    <!-- APPLICATION FORMS  (Figma 5208:101482) -------------------------- -->
    <section *ngIf="active() === 'forms'">
      <h3 class="font-bold text-lg mb-3 text-neutral-900">Application forms</h3>
      <div class="space-y-3 mb-6">
        <a routerLink="../forms" fragment="interest"
          class="block bg-white border border-neutral-200 rounded-2xl p-5 hover:border-neutral-300 transition">
          <div class="flex items-baseline gap-3">
            <span class="text-neutral-400 text-xl leading-none">+</span>
            <div>
              <div class="font-semibold text-neutral-900">Create Interest Form</div>
              <p class="text-sm text-neutral-500 mt-1">
                Collect and screen initial expressions of interest. Capture basic details and motivations to help identify and shortlist suitable participants.
              </p>
            </div>
          </div>
        </a>
        <a routerLink="../forms" fragment="application"
          class="block bg-white border border-neutral-200 rounded-2xl p-5 hover:border-neutral-300 transition">
          <div class="flex items-baseline gap-3">
            <span class="text-neutral-400 text-xl leading-none">+</span>
            <div>
              <div class="font-semibold text-neutral-900">Create Application Form</div>
              <p class="text-sm text-neutral-500 mt-1">Gather comprehensive information from shortlisted candidates.</p>
            </div>
          </div>
        </a>
      </div>
      <ul class="space-y-3" *ngIf="forms().length">
        <li *ngFor="let f of forms()" class="flex items-center justify-between bg-white border border-neutral-200 rounded-2xl p-4">
          <div>
            <div class="text-xs text-neutral-500 uppercase tracking-wider">{{ f.kind }} · {{ f.status }}</div>
            <div class="font-medium">{{ f.title }}</div>
            <div class="text-xs text-neutral-500">{{ f.responseCount }} responses · updated {{ f.updatedAt | date: 'MMM d' }}</div>
          </div>
          <button class="text-sm text-primary-700 font-medium">Open →</button>
        </li>
      </ul>
    </section>
  `,
})
export class ProgramAdminMembersTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);

  readonly active = signal<Tab>('all');
  readonly inviteEmail = signal('');
  readonly copied = signal(false);

  readonly members = toSignal(
    this.route.parent!.paramMap.pipe(switchMap((p) => this.programs.members(p.get('slug') ?? ''))),
    { initialValue: [] },
  );
  readonly forms = toSignal(
    this.route.parent!.paramMap.pipe(switchMap((p) => this.programs.forms(p.get('slug') ?? ''))),
    { initialValue: [] },
  );

  /** Local mock pending list — wires to a /pending endpoint when backend ships. */
  readonly pending = signal<PendingApplicant[]>([
    { id: 'p1', email: 'florencejones@gmail.com', stage: 'New', submittedAt: '2026-01-03T10:00', selected: false },
    { id: 'p2', email: 'natalie123a@gmail.com', stage: 'New', submittedAt: '2026-01-03T11:30', selected: false },
    { id: 'p3', email: 'jamey_james@gmail.com', stage: 'Reviewed', submittedAt: '2026-01-03T14:45', selected: false },
    { id: 'p4', email: 'carlamendoza95@gmail.com', stage: 'New', submittedAt: '2026-01-03T15:10', selected: false },
    { id: 'p5', email: 'oliver.hayes@gmail.com', stage: 'Shortlisted', submittedAt: '2026-01-03T16:00', selected: false },
    { id: 'p6', email: 'sophia.carter@email.com', stage: 'New', submittedAt: '2026-01-03T16:25', selected: false },
    { id: 'p7', email: 'ethanwright@mail.com', stage: 'New', submittedAt: '2026-01-03T17:01', selected: false },
    { id: 'p8', email: 'mia.roberts@hotmail.com', stage: 'Reviewed', submittedAt: '2026-01-04T09:14', selected: false },
    { id: 'p9', email: 'liam.j@example.com', stage: 'New', submittedAt: '2026-01-04T10:02', selected: false },
    { id: 'p10', email: 'emma.lee@domain.com', stage: 'New', submittedAt: '2026-01-04T10:45', selected: false },
  ]);

  readonly allSelected = computed(() => this.pending().length > 0 && this.pending().every((p) => p.selected));

  toggleAll(): void {
    const target = !this.allSelected();
    this.pending.update((list) => list.map((p) => ({ ...p, selected: target })));
  }
  toggleOne(id: string): void {
    this.pending.update((list) => list.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)));
  }
  clearSelection(): void {
    this.pending.update((list) => list.map((p) => ({ ...p, selected: false })));
  }
  approveSelected(): void {
    this.pending.update((list) => list.filter((p) => !p.selected));
  }
  rejectSelected(): void {
    this.pending.update((list) => list.filter((p) => !p.selected));
  }
  approveOne(id: string): void {
    this.pending.update((list) => list.filter((p) => p.id !== id));
  }
  rejectOne(id: string): void {
    this.pending.update((list) => list.filter((p) => p.id !== id));
  }

  copyInvite(): void {
    const url = window.location.origin + window.location.pathname.replace(/\/admin.*$/, '/feed');
    if (navigator.clipboard?.writeText) void navigator.clipboard.writeText(url);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1800);
  }
  sendInvite(): void {
    const email = this.inviteEmail().trim();
    if (!email) return;
    this.inviteEmail.set('');
    // eslint-disable-next-line no-alert
    alert('Invitation sent to ' + email);
  }
}
