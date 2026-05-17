import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { ProgramsService } from '../../../services/programs.service';

@Component({
  selector: 'mereka-program-feed-tab',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5">
      <ng-container *ngIf="program() as p">

        <!-- Multi-hub banner (only shows when there are collaborators) -->
        <div *ngIf="p.collaborators.length > 0"
          class="rounded-xl overflow-hidden"
          style="background:linear-gradient(135deg, #1A1623 0%, #303345 50%, #1A1623 100%)">
          <div class="px-5 py-4 flex flex-col gap-3">
            <!-- Lead hub badge -->
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style="background:rgba(255,255,255,0.15);color:rgba(255,255,255,0.7)">Lead Hub</span>
              <img *ngIf="p.ownerHub.hubLogo" [src]="p.ownerHub.hubLogo" [alt]="p.ownerHub.hubName"
                class="w-5 h-5 rounded-full" style="border:1px solid rgba(255,255,255,0.3)" />
              <span class="text-sm font-bold text-white">{{ p.ownerHub.hubName }}</span>
            </div>

            <!-- Contributing hubs row -->
            <div class="flex items-center gap-3 flex-wrap">
              <span class="text-[10px] font-bold uppercase tracking-widest"
                style="color:rgba(255,255,255,0.5)">Contributing</span>
              <div *ngFor="let c of p.collaborators" class="flex items-center gap-1.5">
                <img *ngIf="c.hub.hubLogo" [src]="c.hub.hubLogo" [alt]="c.hub.hubName"
                  class="w-5 h-5 rounded-full" style="border:1px solid rgba(255,255,255,0.3)" />
                <span class="text-xs text-white/80">{{ c.hub.hubName }}</span>
                <span class="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-bold"
                  [style.background]="c.role === 'editor' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)'"
                  [style.color]="c.role === 'editor' ? '#6EE7B7' : 'rgba(255,255,255,0.5)'">
                  {{ c.role }}
                </span>
              </div>
            </div>

            <!-- Hub contribution stats -->
            <div class="flex gap-4 mt-1">
              <div class="flex flex-col">
                <span class="text-lg font-black text-white">{{ hubCount() }}</span>
                <span class="text-[10px] text-white/50 uppercase tracking-wider">Hubs</span>
              </div>
              <div class="flex flex-col">
                <span class="text-lg font-black text-white">{{ p.curriculum.length }}</span>
                <span class="text-[10px] text-white/50 uppercase tracking-wider">Modules</span>
              </div>
              <div class="flex flex-col">
                <span class="text-lg font-black text-white">{{ p.stats.mentorCount }}</span>
                <span class="text-[10px] text-white/50 uppercase tracking-wider">Mentors</span>
              </div>
              <div class="flex flex-col">
                <span class="text-lg font-black text-white">{{ p.stats.memberCount | number }}</span>
                <span class="text-[10px] text-white/50 uppercase tracking-wider">Members</span>
              </div>
            </div>
          </div>

          <!-- Hub module breakdown -->
          <div class="px-5 py-3 flex gap-2 flex-wrap" style="background:rgba(255,255,255,0.05);border-top:1px solid rgba(255,255,255,0.1)">
            <div *ngFor="let hm of hubModules()"
              class="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style="background:rgba(255,255,255,0.08)">
              <img [src]="hm.logo" [alt]="hm.name" class="w-4 h-4 rounded-full" style="border:1px solid rgba(255,255,255,0.2)" />
              <span class="text-[11px] text-white/80">{{ hm.name }}</span>
              <span class="text-[11px] font-bold text-white">{{ hm.count }}</span>
              <span class="text-[10px] text-white/40">modules</span>
            </div>
          </div>
        </div>

        <!-- Partner logos (single-hub programs with landing partners) -->
        <div *ngIf="p.collaborators.length === 0 && p.landing?.partners?.length"
          class="rounded-xl bg-white p-4 flex items-center gap-4 flex-wrap" style="outline:1px solid #DDDDDE">
          <span class="text-[10px] font-bold uppercase tracking-widest" style="color:#7B7B7B">Partners</span>
          <img *ngFor="let partner of p.landing!.partners" [src]="partner.logoUrl" [alt]="partner.name"
            class="h-7 w-7 rounded-full object-contain" style="border:1px solid #EDEDED" [title]="partner.name" />
        </div>

        <!-- Post Composer -->
        <div class="rounded-xl bg-white p-4" style="outline:1px solid #DDDDDE;outline-offset:-1px">
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style="background:linear-gradient(135deg, #303345, #1A1623)">F</div>
            <div class="flex-1">
              <textarea
                class="w-full resize-none text-sm rounded-lg p-2.5"
                style="background:#F9FAFB;outline:1px solid #EDEDED;color:#1A1623"
                rows="2"
                placeholder="Share something with the community..."
                [(ngModel)]="composerText"
              ></textarea>
              <div class="flex items-center justify-between mt-2">
                <div class="flex gap-2">
                  <button class="text-xs px-3 py-1.5 rounded-full flex items-center gap-1"
                    style="background:#F3F4F6;color:#6B7280">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    Photo
                  </button>
                  <button class="text-xs px-3 py-1.5 rounded-full flex items-center gap-1"
                    style="background:#F3F4F6;color:#6B7280">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 20V10M6 20V4m12 16v-4" stroke-linecap="round" />
                    </svg>
                    Poll
                  </button>
                  <button class="text-xs px-3 py-1.5 rounded-full flex items-center gap-1"
                    style="background:#F3F4F6;color:#6B7280">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    File
                  </button>
                </div>
                <button class="text-xs font-bold px-4 py-1.5 rounded-full text-white"
                  style="background:#1A1623"
                  [style.opacity]="composerText() ? '1' : '0.4'">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Feed Posts -->
        <article *ngFor="let post of p.recentPosts"
          class="rounded-xl bg-white p-5" style="outline:1px solid #DDDDDE;outline-offset:-1px">
          <header class="flex items-center gap-3">
            <img *ngIf="post.authorAvatar as a" [src]="a" [alt]="post.authorName"
              class="w-10 h-10 rounded-full object-cover" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm font-bold" style="color:#1A1623">{{ post.authorName }}</span>
                <!-- Role badge -->
                <span *ngIf="post.authorRole === 'admin'"
                  class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                  style="background:#EF4444">Admin</span>
                <span *ngIf="post.authorRole === 'mentor'"
                  class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                  style="background:#F59E0B">Mentor</span>
                <!-- Hub badge (for multi-hub programs) -->
                <ng-container *ngIf="p.collaborators.length > 0">
                  <span *ngIf="getPostHub(post, p) as hub"
                    class="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
                    style="background:#F0F0FF;color:#6366F1">
                    <img [src]="hub.logo" class="w-3 h-3 rounded-full" />
                    {{ hub.name }}
                  </span>
                </ng-container>
              </div>
              <div class="text-xs mt-0.5" style="color:#7B7B7B">
                {{ post.postedAt | date: 'MMM d, y · h:mm a' }}
                <span *ngIf="post.channel !== 'feed'" class="ml-1">· in {{ post.channel }}</span>
              </div>
            </div>
            <!-- Dropdown -->
            <button class="p-1 rounded-lg" style="color:#9CA3AF">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
              </svg>
            </button>
          </header>

          <h3 *ngIf="post.title" class="font-bold mt-3" style="color:#1A1623;font-size:15px">{{ post.title }}</h3>
          <p class="text-sm mt-2 leading-relaxed" style="color:#4B5563">{{ post.body }}</p>

          <footer class="flex items-center gap-3 mt-4 pt-3" style="border-top:1px solid #F3F4F6">
            <button *ngFor="let r of post.reactions"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
              style="background:#F9FAFB;color:#4B5563">
              <span>{{ r.emoji }}</span>
              <span class="font-bold">{{ r.count }}</span>
            </button>
            <span class="ml-auto text-xs flex items-center gap-1" style="color:#9CA3AF">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {{ post.commentCount }}
            </span>
          </footer>
        </article>

        <div *ngIf="p.recentPosts.length === 0"
          class="rounded-xl bg-white p-12 text-center" style="outline:1px solid #DDDDDE;outline-offset:-1px">
          <div class="text-4xl mb-3">💬</div>
          <h3 class="text-base font-bold" style="color:#1A1623">No posts yet</h3>
          <p class="text-sm mt-1" style="color:#7B7B7B">Be the first to say hi and start the conversation.</p>
        </div>
      </ng-container>
    </div>
  `,
})
export class ProgramFeedTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);

  readonly composerText = signal('');

  /** ParamMap is on the *parent* route — bubble up. */
  readonly program = toSignal(
    this.route.parent!.paramMap.pipe(
      switchMap((params) => this.programs.bySlug(params.get('slug') ?? '')),
    ),
    { initialValue: null },
  );

  /** Count of all hubs (owner + collaborators). */
  readonly hubCount = computed(() => {
    const p = this.program();
    return p ? 1 + p.collaborators.length : 0;
  });

  /** Module counts per hub for the breakdown bar. */
  readonly hubModules = computed(() => {
    const p = this.program();
    if (!p) return [];
    const map = new Map<string, { name: string; logo: string; count: number }>();
    for (const item of p.curriculum) {
      const key = item.ownerHub.hubId;
      const existing = map.get(key);
      if (existing) {
        existing.count++;
      } else {
        map.set(key, {
          name: item.ownerHub.hubName,
          logo: item.ownerHub.hubLogo || '',
          count: 1,
        });
      }
    }
    return Array.from(map.values());
  });

  /** Match a post author to a hub (heuristic by name match to experts). */
  getPostHub(post: any, program: any): { name: string; logo: string } | null {
    if (!program.landing?.experts) return null;
    const expert = program.landing.experts.find(
      (e: any) => post.authorName.includes(e.name.split(' ')[0]) && e.title,
    );
    if (!expert) return null;
    // Try matching to a collaborator hub name
    const allHubs = [
      { name: program.ownerHub.hubName, logo: program.ownerHub.hubLogo || '' },
      ...program.collaborators.map((c: any) => ({ name: c.hub.hubName, logo: c.hub.hubLogo || '' })),
    ];
    for (const hub of allHubs) {
      if (expert.title.toLowerCase().includes(hub.name.split(' ')[0].toLowerCase())) {
        return hub;
      }
    }
    return null;
  }
}
