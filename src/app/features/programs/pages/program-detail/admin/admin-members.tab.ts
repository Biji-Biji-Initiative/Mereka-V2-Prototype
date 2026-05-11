import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ProgramsService } from '../../../services/programs.service';

type Tab = 'all' | 'pending' | 'forms';

@Component({
  selector: 'mereka-admin-members-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2 class="text-2xl font-semibold">Manage Members</h2>
      <div class="flex items-center gap-3">
        <button type="button" class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 bg-white text-sm" (click)="copyInvite()">
          🔗 {{ copied() ? 'Link copied!' : 'Copy invite link' }}
        </button>
        <div class="flex items-center bg-white border border-neutral-200 rounded-full overflow-hidden">
          <input type="email" class="px-3 py-2 text-sm focus:outline-none w-56" placeholder="Invite member by email"
                 [ngModel]="inviteEmail()" (ngModelChange)="inviteEmail.set($event)" />
          <button type="button" class="px-3 py-2 text-neutral-500 hover:text-neutral-900" (click)="sendInvite()">➤</button>
        </div>
      </div>
    </header>
    <nav class="flex gap-2 mb-6 text-sm">
      <button type="button" class="px-4 py-1.5 rounded-full"
        [class.bg-neutral-100]="active() !== 'all'" [class.text-neutral-700]="active() !== 'all'"
        [class.bg-neutral-900]="active() === 'all'" [class.text-white]="active() === 'all'"
        (click)="active.set('all')">All members</button>
      <button type="button" class="px-4 py-1.5 rounded-full"
        [class.bg-neutral-100]="active() !== 'pending'" [class.text-neutral-700]="active() !== 'pending'"
        [class.bg-neutral-900]="active() === 'pending'" [class.text-white]="active() === 'pending'"
        (click)="active.set('pending')">Pending approval</button>
      <button type="button" class="px-4 py-1.5 rounded-full"
        [class.bg-neutral-100]="active() !== 'forms'" [class.text-neutral-700]="active() !== 'forms'"
        [class.bg-neutral-900]="active() === 'forms'" [class.text-white]="active() === 'forms'"
        (click)="active.set('forms')">Application forms</button>
    </nav>
    <section *ngIf="active() === 'all'" class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
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
            <td class="px-4 py-3 flex items-center gap-3">
              <img *ngIf="m.avatar as a" [src]="a" [alt]="m.name" class="w-7 h-7 rounded-full" />
              <div>
                <div class="font-medium">{{ m.name }}</div>
                <div class="text-xs text-neutral-500">{{ m.email }}</div>
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
    <section *ngIf="active() === 'pending'" class="bg-white border border-neutral-200 rounded-lg p-12 text-center text-neutral-500">
      No pending approvals right now.
    </section>
    <section *ngIf="active() === 'forms'">
      <h3 class="font-semibold text-lg mb-3">Application forms</h3>
      <div class="space-y-3 mb-6">
        <button type="button" class="block w-full text-left bg-white border border-neutral-200 rounded-lg p-5 hover:shadow-sm transition">
          <div class="font-medium">+ Create Interest Form</div>
          <p class="text-sm text-neutral-500 mt-1">Collect initial expressions of interest.</p>
        </button>
        <button type="button" class="block w-full text-left bg-white border border-neutral-200 rounded-lg p-5 hover:shadow-sm transition">
          <div class="font-medium">+ Create Application Form</div>
          <p class="text-sm text-neutral-500 mt-1">Gather comprehensive information from shortlisted candidates.</p>
        </button>
      </div>
      <ul class="space-y-3">
        <li *ngFor="let f of forms()" class="flex items-center justify-between bg-white border border-neutral-200 rounded-lg p-4">
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
  readonly members = toSignal(this.route.parent!.paramMap.pipe(switchMap((p) => this.programs.members(p.get('slug') ?? ''))), { initialValue: [] });
  readonly forms = toSignal(this.route.parent!.paramMap.pipe(switchMap((p) => this.programs.forms(p.get('slug') ?? ''))), { initialValue: [] });

  copyInvite(): void {
    const url = window.location.origin + window.location.pathname.replace(/\/admin.*$/, '/feed');
    if (navigator.clipboard?.writeText) void navigator.clipboard.writeText(url);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1800);
  }
  sendInvite(): void {
    const email = this.inviteEmail().trim(); if (!email) return;
    this.inviteEmail.set('');
    alert('Invitation sent to ' + email);
  }
}
