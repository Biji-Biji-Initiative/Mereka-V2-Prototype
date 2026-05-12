import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChannelBadgeComponent } from '../components/channel-badge.component';
import { StatusPillComponent } from '../components/status-pill.component';
import { CheckboxFilterComponent, CheckboxOption } from '../components/checkbox-filter.component';
import { BroadcastsMockService } from '../services/broadcasts-mock.service';
import { BroadcastSummary } from '../services/broadcasts.types';

type StatusTab = 'all' | 'sent' | 'scheduled' | 'draft';

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, ChannelBadgeComponent, StatusPillComponent, CheckboxFilterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-neutral-900">Broadcasts</h1>
        <p class="text-sm text-neutral-500 mt-1">Send announcements, reminders, and promos by email, WhatsApp, and in-app.</p>
      </div>
      <div class="flex items-center gap-2">
        <a routerLink="templates/email"
           class="h-10 px-4 inline-flex items-center gap-2 text-sm text-neutral-700 border border-neutral-200 rounded-full hover:bg-neutral-50">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6l9 7 9-7M3 6v12h18V6" stroke-linejoin="round" /></svg>
          Email templates
        </a>
        <a routerLink="templates/whatsapp"
           class="h-10 px-4 inline-flex items-center gap-2 text-sm text-neutral-700 border border-neutral-200 rounded-full hover:bg-neutral-50">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21l1.5-5A8 8 0 1112 21H3z" stroke-linejoin="round" /></svg>
          WhatsApp templates
        </a>
        <a routerLink="new"
           class="h-10 px-4 inline-flex items-center gap-2 text-sm bg-neutral-900 text-white rounded-full hover:bg-neutral-800">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round" /></svg>
          New broadcast
        </a>
      </div>
    </div>

    <section class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div *ngFor="let s of summary()" class="bg-white border border-neutral-200 rounded-lg p-4">
        <div class="text-xs text-neutral-500">{{ s.label }}</div>
        <div class="mt-1 text-xl font-semibold tabular-nums">{{ s.value }}</div>
      </div>
    </section>

    <div class="flex items-center justify-between gap-3 mb-4 flex-wrap">
      <div class="inline-flex items-center gap-1 bg-white border border-neutral-200 rounded-full p-1">
        <button *ngFor="let t of statusTabs"
                type="button"
                (click)="statusTab.set(t.id)"
                class="h-8 px-4 rounded-full text-sm transition"
                [ngClass]="statusTab() === t.id
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-50'">
          {{ t.label }}
        </button>
      </div>

      <div class="relative">
        <button type="button" (click)="filterOpen.update(v => !v)"
                class="h-9 px-3 inline-flex items-center gap-2 text-sm border border-neutral-200 rounded-full bg-white hover:bg-neutral-50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke-linejoin="round" /></svg>
          Filter
          <span *ngIf="activeFilterCount() > 0"
                class="ml-1 text-[10px] px-1.5 rounded-full bg-neutral-900 text-white">
            {{ activeFilterCount() }}
          </span>
        </button>
        <div *ngIf="filterOpen()" class="absolute right-0 top-12 z-20">
          <mereka-checkbox-filter
            title="Filter by channel & category"
            [options]="filterOptions()"
            (toggle)="toggleFilter($event)"
            (clear)="clearFilters()"
            (apply)="filterOpen.set(false)" />
        </div>
      </div>
    </div>

    <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-500">
          <tr>
            <th class="text-left px-5 py-3 font-medium">Broadcast</th>
            <th class="text-left px-3 py-3 font-medium">Channel</th>
            <th class="text-left px-3 py-3 font-medium">Status</th>
            <th class="text-right px-3 py-3 font-medium">Recipients</th>
            <th class="text-right px-3 py-3 font-medium">Open</th>
            <th class="text-right px-3 py-3 font-medium">Click</th>
            <th class="text-left px-5 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr *ngFor="let b of filtered(); trackBy: trackId"
              [routerLink]="['/dashboard/broadcasts', b.id]"
              class="hover:bg-neutral-50 cursor-pointer">
            <td class="px-5 py-4">
              <div class="font-medium text-neutral-900">{{ b.name }}</div>
              <div class="text-xs text-neutral-500 capitalize">{{ b.category }}</div>
            </td>
            <td class="px-3 py-4"><mereka-channel-badge [channel]="b.channel" /></td>
            <td class="px-3 py-4"><mereka-status-pill [status]="b.status" /></td>
            <td class="px-3 py-4 text-right tabular-nums">{{ b.recipientCount }}</td>
            <td class="px-3 py-4 text-right tabular-nums text-neutral-500">{{ b.openRate !== undefined ? b.openRate + '%' : '—' }}</td>
            <td class="px-3 py-4 text-right tabular-nums text-neutral-500">{{ b.clickRate !== undefined ? b.clickRate + '%' : '—' }}</td>
            <td class="px-5 py-4 text-neutral-500">
              <span *ngIf="b.sentAt">Sent {{ b.sentAt | date: 'mediumDate' }}</span>
              <span *ngIf="b.scheduledFor">Scheduled {{ b.scheduledFor | date: 'mediumDate' }}</span>
              <span *ngIf="!b.sentAt && !b.scheduledFor">—</span>
            </td>
          </tr>
          <tr *ngIf="!filtered().length">
            <td colspan="7" class="px-5 py-12 text-center text-neutral-500">No broadcasts match your filters.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class BroadcastsListPage {
  private readonly mock = inject(BroadcastsMockService);

  protected readonly statusTab = signal<StatusTab>('all');
  protected readonly statusTabs: { id: StatusTab; label: string }[] = [
    { id: 'all',       label: 'All' },
    { id: 'sent',      label: 'Sent' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'draft',     label: 'Drafts' },
  ];

  protected readonly filterOpen = signal(false);
  protected readonly filters = signal<CheckboxOption[]>([
    { id: 'all',         label: 'All' },
    { id: 'whatsapp',    label: 'WhatsApp' },
    { id: 'email',       label: 'Email' },
    { id: 'onboarding',  label: 'Onboarding', selected: true },
    { id: 'promotion',   label: 'Promotion' },
    { id: 'reminder',    label: 'Reminder', selected: true },
  ]);

  protected readonly filterOptions = computed(() => this.filters());
  protected readonly activeFilterCount = computed(() =>
    this.filters().filter((f) => f.selected && f.id !== 'all').length,
  );

  protected readonly summary = computed(() => {
    const all = this.mock.broadcasts();
    return [
      { label: 'Total broadcasts', value: all.length },
      { label: 'Sent (30d)', value: all.filter((b) => b.status === 'sent').length },
      { label: 'Scheduled', value: all.filter((b) => b.status === 'scheduled').length },
      { label: 'Drafts', value: all.filter((b) => b.status === 'draft').length },
    ];
  });

  protected readonly filtered = computed<BroadcastSummary[]>(() => {
    const tab = this.statusTab();
    const channelFilters = this.filters().filter((f) => f.selected && (f.id === 'whatsapp' || f.id === 'email')).map((f) => f.id);
    const catFilters = this.filters().filter((f) => f.selected && ['onboarding', 'promotion', 'reminder'].includes(f.id)).map((f) => f.id);

    return this.mock.broadcasts().filter((b) => {
      if (tab !== 'all') {
        if (tab === 'draft' && b.status !== 'draft') return false;
        if (tab === 'sent' && b.status !== 'sent') return false;
        if (tab === 'scheduled' && b.status !== 'scheduled') return false;
      }
      if (channelFilters.length && !channelFilters.includes(b.channel)) return false;
      if (catFilters.length && !catFilters.includes(b.category)) return false;
      return true;
    });
  });

  trackId(_: number, b: BroadcastSummary) { return b.id; }

  toggleFilter(id: string) {
    this.filters.update((arr) => {
      if (id === 'all') {
        const wasOn = arr.find((o) => o.id === 'all')?.selected;
        return arr.map((o) => ({ ...o, selected: !wasOn && o.id === 'all' }));
      }
      return arr.map((o) => o.id === 'all' ? { ...o, selected: false } : o.id === id ? { ...o, selected: !o.selected } : o);
    });
  }
  clearFilters() {
    this.filters.update((arr) => arr.map((o) => ({ ...o, selected: false })));
  }
}
