import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { ProgramsService } from '../../programs/services/programs.service';
import type { InboxChannel } from '../../programs/models/program.model';

@Component({
  selector: 'mereka-inbox-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="max-w-[1320px] mx-auto px-6 py-8">
      <h1 class="text-2xl font-semibold mb-6">Inbox</h1>
      <div class="grid grid-cols-12 gap-0 border border-neutral-200 rounded-lg overflow-hidden bg-white min-h-[600px]">
        <nav class="col-span-12 md:col-span-3 border-r border-neutral-200 bg-neutral-50 p-3 overflow-y-auto">
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
          <header class="px-5 py-3 border-b border-neutral-200 font-medium">{{ thread()?.channelName || 'Select a conversation' }}</header>
          <div *ngIf="thread() as t" class="flex-1 p-5 overflow-y-auto space-y-4">
            <article *ngFor="let m of t.messages" class="flex gap-3" [class.justify-end]="m.isMine">
              <img *ngIf="!m.isMine && m.authorAvatar as a" [src]="a" [alt]="m.authorName" class="w-8 h-8 rounded-full" />
              <div [class.text-right]="m.isMine" class="max-w-md">
                <div class="rounded-2xl px-4 py-2 text-sm" [class.bg-neutral-100]="!m.isMine" [class.bg-primary-100]="m.isMine">{{ m.body }}</div>
                <div class="text-[10px] text-neutral-400 mt-1">{{ m.postedAt | date: 'h:mm a' }}</div>
              </div>
            </article>
          </div>
          <div *ngIf="!thread()" class="flex-1 flex items-center justify-center text-sm text-neutral-400">Select a conversation</div>
          <form *ngIf="thread()" class="border-t border-neutral-200 px-5 py-3 flex items-center gap-3" (submit)="$event.preventDefault(); send()">
            <input type="text" class="flex-1 px-3 py-2 rounded-md border border-neutral-200 focus:outline-none focus:border-neutral-400 text-sm"
                   placeholder="Write a message" [ngModel]="draft()" (ngModelChange)="draft.set($event)" name="draft" />
            <button type="submit" class="text-neutral-400 hover:text-neutral-900" aria-label="Send">➤</button>
          </form>
        </section>
      </div>
    </div>
  `,
})
export class InboxPage {
  private readonly programs = inject(ProgramsService);
  readonly selectedId = signal<string>('dm_florence');
  readonly draft = signal('');
  readonly channels = toSignal(this.programs.inboxChannels('ai4u'), { initialValue: [] as InboxChannel[] });
  readonly grouped = computed(() => {
    const groups: { label: string; items: InboxChannel[] }[] = [
      { label: 'Channels', items: (this.channels() ?? []).filter((c) => c.kind === 'channel') },
      { label: 'Managing services', items: (this.channels() ?? []).filter((c) => c.kind === 'managing') },
      { label: 'Direct messages', items: (this.channels() ?? []).filter((c) => c.kind === 'direct') },
    ];
    return groups.filter((g) => g.items.length > 0);
  });
  readonly thread = toSignal(
    toObservable(this.selectedId).pipe(switchMap((id) => id ? this.programs.inboxThread('ai4u', id) : of(null))),
    { initialValue: null }
  );
  send(): void { if (this.draft().trim()) this.draft.set(''); }
}
