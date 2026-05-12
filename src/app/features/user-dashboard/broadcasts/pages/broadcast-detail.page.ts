import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { BroadcastsMockService } from '../services/broadcasts-mock.service';
import { ChannelBadgeComponent } from '../components/channel-badge.component';
import { StatusPillComponent } from '../components/status-pill.component';

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, ChannelBadgeComponent, StatusPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="broadcast() as b; else missing">
      <div class="mb-6">
        <a routerLink=".." class="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          Back to broadcasts
        </a>
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="text-2xl font-semibold">{{ b.name }}</h1>
          <mereka-channel-badge [channel]="b.channel" />
          <mereka-status-pill [status]="b.status" />
        </div>
        <p class="text-sm text-neutral-500 mt-1 capitalize">{{ b.category }}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">Recipients</div>
          <div class="text-2xl font-semibold mt-1 tabular-nums">{{ b.recipientCount }}</div>
        </div>
        <div class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">Open rate</div>
          <div class="text-2xl font-semibold mt-1 tabular-nums">{{ b.openRate !== undefined ? b.openRate + '%' : '—' }}</div>
        </div>
        <div class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">Click rate</div>
          <div class="text-2xl font-semibold mt-1 tabular-nums">{{ b.clickRate !== undefined ? b.clickRate + '%' : '—' }}</div>
        </div>
        <div class="bg-white border border-neutral-200 rounded-lg p-5">
          <div class="text-xs text-neutral-500">{{ b.sentAt ? 'Sent at' : 'Scheduled for' }}</div>
          <div class="text-sm font-medium mt-1">
            {{ (b.sentAt || b.scheduledFor) ? ((b.sentAt || b.scheduledFor) | date: 'medium') : '—' }}
          </div>
        </div>
      </div>

      <div class="bg-white border border-neutral-200 rounded-lg p-6">
        <h2 class="font-semibold mb-3">Activity timeline</h2>
        <ol class="space-y-3 text-sm">
          <li class="flex items-start gap-3">
            <span class="w-2 h-2 rounded-full bg-green-500 mt-2"></span>
            <div>
              <div class="font-medium">Sent to {{ b.recipientCount }} recipients</div>
              <div class="text-xs text-neutral-500">{{ (b.sentAt || b.scheduledFor) | date: 'medium' }}</div>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="w-2 h-2 rounded-full bg-blue-500 mt-2"></span>
            <div>
              <div class="font-medium">First open</div>
              <div class="text-xs text-neutral-500">~ 3 min after send</div>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <span class="w-2 h-2 rounded-full bg-purple-500 mt-2"></span>
            <div>
              <div class="font-medium">First click</div>
              <div class="text-xs text-neutral-500">~ 6 min after send</div>
            </div>
          </li>
        </ol>
      </div>
    </ng-container>
    <ng-template #missing>
      <div class="bg-white border border-neutral-200 rounded-lg p-10 text-center">
        <p class="text-neutral-500">Broadcast not found.</p>
        <a routerLink=".." class="inline-block mt-3 text-sm text-neutral-900 underline">Back to broadcasts</a>
      </div>
    </ng-template>
  `,
})
export class BroadcastDetailPage {
  private readonly mock = inject(BroadcastsMockService);
  private readonly route = inject(ActivatedRoute);

  protected readonly id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') || '')), { initialValue: '' });
  protected readonly broadcast = computed(() => this.mock.broadcast(this.id()));
}
