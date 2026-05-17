import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

interface ConnectedAccount {
  provider: string;
  icon: string;
  connected: boolean;
  email?: string;
}

@Component({
  selector: 'mereka-dashboard-settings',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.page.html',
})
export class DashboardSettingsPage {
  private readonly auth = inject(AuthService);

  readonly tabs = ['Profile', 'Security', 'Notifications', 'Connected Accounts'] as const;
  readonly activeTab = signal<string>('Profile');

  setTab(tab: string): void { this.activeTab.set(tab); }

  // Profile fields from auth
  readonly user = this.auth.user;
  readonly displayName = computed(() => this.user()?.name ?? '');
  readonly email = computed(() => this.user()?.email ?? '');

  // Editable profile form state
  readonly profileForm = signal({
    name: '',
    email: '',
    phone: '+60 12-345 6789',
    bio: 'Passionate about technology and sustainable development. Currently exploring AI applications in education and workforce development across Southeast Asia.',
    location: 'Kuala Lumpur, Malaysia',
    website: 'https://mereka.io',
    language: 'English',
    timezone: 'Asia/Kuala_Lumpur (GMT+8)',
  });

  // Security
  readonly twoFactorEnabled = signal(false);
  readonly sessionCount = signal(3);

  toggleTwoFactor(): void {
    this.twoFactorEnabled.update(v => !v);
  }

  // Notification preferences
  readonly notifPrefs = signal({
    emailDigest: true,
    courseUpdates: true,
    hubAnnouncements: true,
    bookingReminders: true,
    marketingEmails: false,
    pushNotifications: true,
    smsAlerts: false,
  });

  toggleNotifPref(key: string): void {
    this.notifPrefs.update(prefs => ({ ...prefs, [key]: !(prefs as any)[key] }));
  }

  // Connected accounts
  readonly connectedAccounts = signal<ConnectedAccount[]>([
    { provider: 'Google', icon: 'G', connected: true, email: 'faiz@gmail.com' },
    { provider: 'LinkedIn', icon: 'in', connected: false },
    { provider: 'GitHub', icon: 'GH', connected: false },
    { provider: 'Microsoft', icon: 'MS', connected: true, email: 'faiz@outlook.com' },
  ]);

  toggleAccount(provider: string): void {
    this.connectedAccounts.update(accounts =>
      accounts.map(a => a.provider === provider ? { ...a, connected: !a.connected } : a)
    );
  }

  // Save feedback
  readonly saveMessage = signal('');
  save(): void {
    this.saveMessage.set('Settings saved successfully');
    setTimeout(() => this.saveMessage.set(''), 3000);
  }
}
