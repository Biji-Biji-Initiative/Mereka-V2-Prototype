import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Tab = 'account' | 'security' | 'notifications';

@Component({
  selector: 'mereka-dashboard-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">Settings</h1>
    <nav class="flex gap-2 mb-6 text-sm">
      <button class="px-4 py-1.5 rounded-full" [class.bg-neutral-900]="tab() === 'account'" [class.text-white]="tab() === 'account'" [class.bg-neutral-100]="tab() !== 'account'" (click)="tab.set('account')">Account</button>
      <button class="px-4 py-1.5 rounded-full" [class.bg-neutral-900]="tab() === 'security'" [class.text-white]="tab() === 'security'" [class.bg-neutral-100]="tab() !== 'security'" (click)="tab.set('security')">Security</button>
      <button class="px-4 py-1.5 rounded-full" [class.bg-neutral-900]="tab() === 'notifications'" [class.text-white]="tab() === 'notifications'" [class.bg-neutral-100]="tab() !== 'notifications'" (click)="tab.set('notifications')">Notification preferences</button>
    </nav>
    <section *ngIf="tab() === 'account'" class="bg-white border border-neutral-200 rounded-lg p-6 max-w-xl space-y-4">
      <label class="block"><span class="text-sm font-medium">Display name</span>
        <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="name()" (ngModelChange)="name.set($event)" name="name" /></label>
      <label class="block"><span class="text-sm font-medium">Email</span>
        <input type="email" class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="email()" (ngModelChange)="email.set($event)" name="email" /></label>
      <label class="block"><span class="text-sm font-medium">Timezone</span>
        <select class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="tz()" (ngModelChange)="tz.set($event)" name="tz">
          <option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur</option>
          <option value="Asia/Singapore">Asia/Singapore</option>
          <option value="UTC">UTC</option>
        </select></label>
      <button class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm">Save</button>
    </section>
    <section *ngIf="tab() === 'security'" class="bg-white border border-neutral-200 rounded-lg p-6 max-w-xl space-y-4">
      <h3 class="font-semibold">Password</h3>
      <button class="px-4 py-2 rounded-full border border-neutral-200 text-sm">Change password</button>
      <h3 class="font-semibold mt-6">Two-factor authentication</h3>
      <p class="text-sm text-neutral-700">Add an extra layer to your sign-ins.</p>
      <button class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm">Enable 2FA</button>
    </section>
    <section *ngIf="tab() === 'notifications'" class="bg-white border border-neutral-200 rounded-lg p-6 max-w-xl space-y-3">
      <label *ngFor="let p of prefs" class="flex items-center justify-between py-2">
        <div>
          <div class="text-sm font-medium">{{ p.label }}</div>
          <div class="text-xs text-neutral-500">{{ p.desc }}</div>
        </div>
        <input type="checkbox" [checked]="p.enabled" (change)="p.enabled = !p.enabled" />
      </label>
    </section>
  `,
})
export class DashboardSettingsPage {
  readonly tab = signal<Tab>('account');
  readonly name = signal('Nicholas Hon'); readonly email = signal('nicholas@example.com'); readonly tz = signal('Asia/Kuala_Lumpur');
  readonly prefs = [
    { label: 'Booking reminders', desc: '24h reminder before a session.', enabled: true },
    { label: 'New messages', desc: "When someone DMs you.", enabled: true },
    { label: 'Hub announcements', desc: 'From hubs you follow.', enabled: false },
    { label: 'Weekly digest', desc: 'A summary of what happened in your communities.', enabled: true },
  ];
}
