import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, switchMap, of } from 'rxjs';
import { ProgramsService } from '../../../services/programs.service';
import type { InboxChannel } from '../../../models/program.model';

type Folder = 'broadcast' | 'inbox' | 'drafts' | 'sent';

@Component({
  selector: 'mereka-admin-inbox-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col h-[calc(100vh-12rem)]">
      <header class="flex items-center justify-center gap-2 mb-4">
        <button *ngFor="let f of folders" type="button" class="px-4 py-1.5 rounded-full text-sm"
          [class.bg-neutral-900]="folder() === f" [class.text-white]="folder() === f"
          [class.bg-white]="folder() !== f" [class.border]="folder() !== f"
          [class.border-neutral-200]="folder() !== f" [class.text-neutral-700]="folder() !== f"
          (click)="folder.set(f)">
          {{ titleCase(f) }}
        </button>
      </header>
      <div class="flex-1 grid grid-cols-12 gap-0 border border-neutral-200 rounded-lg overflow-hidden bg-white min-h-[480px]">
        <nav class="col-span-12 md:col-span-3 border-r border-neutral-200 bg-neutral-50 p-3 overflow-y-auto">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold">Inbox</h3>
            <button class="text-neutral-400 hover:text-neutral-700" aria-label="New message">＋</button>
          </div>
          <ng-container *ngFor="let group of grouped()">
            <div class="text-[11px] uppercase tracking-widest text-neutral-400 mt-3 mb-1">{{ group.label }}</div>
            <ul class="space-y-0.5">
              <li *ngFor="let ch of group.items">
                <button type="button" class="w-full text-left flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm"
                  [class.bg-neutral-900]="selectedId() === ch.id" [class.text-white]="selectedId() === ch.id"
                  [class.text-neutral-700]="selectedId() !== ch.id" [class.hover:bg-neutral-100]="selectedId() !== ch.id"
                  (click)="selectedId.set(ch.id)">
                  <span class="truncate flex items-center gap-2">
                    <span aria-hidden="true">{{ ch.kind === 'direct' ? '●' : '#' }}</span>
                    <span class="truncate">{{ ch.name }}</span>
                  </span>
                  <span *ngIf="ch.unread > 0" class="text-[10px] bg-info text-white rounded-full px-1.5 py-0.5">{{ ch.unread }}</span>
                </button>
              </li>
            </ul>
          </ng-container>
        </nav>
        <section class="col-span-12 md:col-span-9 flex flex-col">
          <header class="px-5 py-3 border-b border-neutral-200 flex items-center gap-2">
            <span aria-hidden="true">●</span>
            <h3 class="font-medium">{{ thread()?.channelName || 'Select a conversation' }}</h3>
          </header>
          <div *ngIf="thread() as t" class="flex-1 px-5 py-4 overflow-y-auto space-y-4">
            <div class="text-center text-xs text-neutral-400">{{ t.messages[0]?.postedAt | date: 'EEEE, MMMM d' }}</div>
            <article *ngFor="let msg of t.messages" class="flex gap-3" [class.justify-end]="msg.isMine">
              <img *ngIf="!msg.isMine && msg.authorAvatar as a" [src]="a" [alt]="msg.authorName" class="w-8 h-8 rounded-full" />
              <div [class.text-right]="msg.isMine" class="max-w-md">
                <div class="rounded-2xl px-4 py-2 text-sm"
                  [class.bg-neutral-100]="!msg.isMine" [class.bg-primary-100]="msg.isMine">
                  {{ msg.body }}
                </div>
                <div *ngIf="msg.meta" class="text-[10px] text-neutral-400 mt-1">{{ msg.meta }}</div>
              </div>
            </article>
          </div>
          <div *ngIf="!thread()" class="flex-1 flex items-center justify-center text-neutral-400 text-sm">
            Select a conversation to view messages
          </div>
          <form *ngIf="thread()" class="border-t border-neutral-200 px-5 py-3 flex items-center gap-3"
            (submit)="$event.preventDefault(); send()">
            <input type="text" class="flex-1 px-3 py-2 rounded-md border border-neutral-200 focus:outline-none focus:border-neutral-400 text-sm"
                   placeholder="Write a message" [ngModel]="draft()" (ngModelChange)="draft.set($event)" name="draft" />
            <button type="submit" class="text-neutral-400 hover:text-neutral-900" aria-label="Send">➤</button>
          </form>
        </section>
      </div>
    </div>
  `,
})
export class ProgramAdminInboxTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);
  readonly folders: Folder[] = ['broadcast', 'inbox', 'drafts', 'sent'];
  readonly folder = signal<Folder>('inbox');
  readonly selectedId = signal<string>('dm_florence');
  readonly draft = signal('');
  private readonly slugPm = this.route.parent!.paramMap;
  readonly channels = toSignal(this.slugPm.pipe(switchMap((p) => this.programs.inboxChannels(p.get('slug') ?? ''))), { initialValue: [] as InboxChannel[] });
  readonly grouped = computed(() => {
    const groups: { label: string; items: InboxChannel[] }[] = [
      { label: 'Channels', items: (this.channels() ?? []).filter((c) => c.kind === 'channel') },
      { label: 'Managing services', items: (this.channels() ?? []).filter((c) => c.kind === 'managing') },
      { label: 'Direct messages', items: (this.channels() ?? []).filter((c) => c.kind === 'direct') },
    ];
    return groups.filter((g) => g.items.length > 0);
  });
  readonly thread = toSignal(
    combineLatest([this.slugPm, toObservable(this.selectedId)]).pipe(
      switchMap(([p, ch]) => ch ? this.programs.inboxThread(p.get('slug') ?? '', ch) : of(null))
    ), { initialValue: null }
  );
  titleCase(f: Folder): string { return f[0].toUpperCase() + f.slice(1); }
  send(): void { if (this.draft().trim()) this.draft.set(''); }
}
