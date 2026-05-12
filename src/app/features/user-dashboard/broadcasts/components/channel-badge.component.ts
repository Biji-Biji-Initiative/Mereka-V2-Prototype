import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BroadcastChannel } from '../services/broadcasts.types';

@Component({
  selector: 'mereka-channel-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="inline-flex items-center gap-1.5 h-6 px-2 rounded-full text-[11px] font-medium"
          [ngClass]="bg">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path [attr.d]="iconPath" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      {{ label }}
    </span>
  `,
})
export class ChannelBadgeComponent {
  @Input({ required: true }) channel!: BroadcastChannel;

  get bg(): string {
    return {
      email:    'bg-blue-50 text-blue-700',
      whatsapp: 'bg-green-50 text-green-700',
      in_app:   'bg-purple-50 text-purple-700',
    }[this.channel];
  }
  get label(): string {
    return { email: 'Email', whatsapp: 'WhatsApp', in_app: 'In-app' }[this.channel];
  }
  get iconPath(): string {
    return {
      email:    'M3 6l9 7 9-7M3 6v12h18V6',
      whatsapp: 'M3 21l1.5-5A8 8 0 1112 21H3z',
      in_app:   'M21 11a8 8 0 11-16 0 8 8 0 0116 0zM12 7v5l3 2',
    }[this.channel];
  }
}
