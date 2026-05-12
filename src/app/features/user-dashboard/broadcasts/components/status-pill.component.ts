import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BroadcastStatus } from '../services/broadcasts.types';

@Component({
  selector: 'mereka-status-pill',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="inline-flex items-center gap-1.5 h-6 px-2 rounded-full text-[11px] font-medium" [ngClass]="bg">
      <span class="w-1.5 h-1.5 rounded-full" [ngClass]="dot"></span>
      {{ label }}
    </span>
  `,
})
export class StatusPillComponent {
  @Input({ required: true }) status!: BroadcastStatus;

  get bg(): string {
    return {
      draft:     'bg-neutral-100 text-neutral-700',
      scheduled: 'bg-blue-50 text-blue-700',
      sending:   'bg-yellow-50 text-yellow-700',
      sent:      'bg-green-50 text-green-700',
      failed:    'bg-red-50 text-red-700',
    }[this.status];
  }
  get dot(): string {
    return {
      draft:     'bg-neutral-400',
      scheduled: 'bg-blue-500',
      sending:   'bg-yellow-500 animate-pulse',
      sent:      'bg-green-500',
      failed:    'bg-red-500',
    }[this.status];
  }
  get label(): string {
    return { draft: 'Draft', scheduled: 'Scheduled', sending: 'Sending', sent: 'Sent', failed: 'Failed' }[this.status];
  }
}
