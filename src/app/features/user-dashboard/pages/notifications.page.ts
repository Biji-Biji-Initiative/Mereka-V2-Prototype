import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'mereka-dashboard-notifications',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">Notifications</h1>
    <ul class="space-y-2">
      <li *ngFor="let n of items" class="bg-white border border-neutral-200 rounded-lg p-4 flex gap-3">
        <span class="text-xl shrink-0">{{ n.icon }}</span>
        <div class="flex-1 min-w-0">
          <div class="text-sm">{{ n.body }}</div>
          <div class="text-xs text-neutral-500 mt-1">{{ n.at | date: 'MMM d · h:mm a' }}</div>
        </div>
        <span *ngIf="n.unread" class="w-2 h-2 rounded-full bg-info self-center"></span>
      </li>
    </ul>
  `,
})
export class DashboardNotificationsPage {
  readonly items = [
    { icon: '✅', body: 'Your booking for "Image Gen Crash Course" is confirmed.', at: '2026-05-09T07:00:00', unread: true },
    { icon: '💬', body: 'Aisha Rahman sent you a message.', at: '2026-05-08T09:00:00', unread: true },
    { icon: '🎉', body: "You've completed Generative AI Fundamentals. Certificate is ready.", at: '2026-05-07T14:00:00', unread: false },
    { icon: '🔔', body: "Reminder: 'Climate Walk: KL Heritage Edition' starts tomorrow at 9am.", at: '2026-05-06T18:00:00', unread: false },
  ];
}
