import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, AuthUser } from '../../core/services/auth.service';

/** Hardcoded demo accounts for the prototype. */
const DEMO_ACCOUNTS: Record<string, { password: string; user: AuthUser }> = {
  'candidate@mereka.io': {
    password: 'candidate123',
    user: {
      id: 'demo-candidate-001',
      email: 'candidate@mereka.io',
      name: 'Sarah Ahmad',
      emailVerified: true,
      authProviders: ['email'],
      profilePhoto: undefined,
      hubs: [],
    },
  },
  'soar@mereka.io': {
    password: 'soar123',
    user: {
      id: 'demo-soar-001',
      email: 'soar@mereka.io',
      name: 'Amir Razak',
      emailVerified: true,
      authProviders: ['email'],
      profilePhoto: undefined,
      hubs: [
        {
          hubId: 'hub-soar-001',
          hubName: 'Creative Studio KL',
          hubLogo: null,
          hubRole: 'admin',
        },
      ],
    },
  },
  'scale@mereka.io': {
    password: 'scale123',
    user: {
      id: 'demo-scale-001',
      email: 'scale@mereka.io',
      name: 'Priya Nair',
      emailVerified: true,
      authProviders: ['email'],
      profilePhoto: undefined,
      hubs: [
        {
          hubId: 'hub-scale-001',
          hubName: 'Digital Academy MY',
          hubLogo: null,
          hubRole: 'admin',
        },
        {
          hubId: 'hub-scale-002',
          hubName: 'Tech Skills Hub',
          hubLogo: null,
          hubRole: 'editor',
        },
      ],
    },
  },
};

type Step = 'email' | 'method' | 'password';

@Component({
  selector: 'mereka-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly step = signal<Step>('email');
  readonly email = signal('');
  readonly password = signal('');
  readonly error = signal('');
  readonly showPassword = signal(false);

  /** Quick-login buttons displayed on the email step. */
  readonly quickAccounts = [
    { email: 'candidate@mereka.io', name: 'Sarah Ahmad', initial: 'S', color: '#a78bfa', badge: 'Candidate' },
    { email: 'soar@mereka.io', name: 'Amir Razak', initial: 'A', color: '#60a5fa', badge: 'Soar (Hub Admin)' },
    { email: 'scale@mereka.io', name: 'Priya Nair', initial: 'P', color: '#f472b6', badge: 'Scale (2 Hubs)' },
  ];

  /** Instant sign-in for demo accounts — no password needed. */
  quickLogin(email: string): void {
    const account = DEMO_ACCOUNTS[email];
    if (!account) return;
    this.auth.setPrototypeUser(account.user);
    this.router.navigate(['/programs']);
  }

  goToMethodSelect(): void {
    const e = this.email().trim().toLowerCase();
    if (!e || !e.includes('@')) {
      this.error.set('Please enter a valid email address.');
      return;
    }
    this.error.set('');
    this.step.set('method');
  }

  choosePassword(): void {
    this.error.set('');
    this.step.set('password');
  }

  chooseOtp(): void {
    this.error.set('We sent a one-time code to your email. (Demo: use "Use password" instead)');
  }

  goBack(): void {
    const s = this.step();
    if (s === 'password') this.step.set('method');
    else if (s === 'method') this.step.set('email');
    this.error.set('');
  }

  signIn(): void {
    const e = this.email().trim().toLowerCase();
    const p = this.password();
    const account = DEMO_ACCOUNTS[e];
    if (!account) {
      this.error.set('Account not found. Try candidate@mereka.io, soar@mereka.io, or scale@mereka.io');
      return;
    }
    if (account.password !== p) {
      this.error.set('Invalid password. Hint: candidate123, soar123, or scale123');
      return;
    }
    this.error.set('');
    // Set user in auth service via prototype method
    this.auth.setPrototypeUser(account.user);
    this.router.navigate(['/programs']);
  }

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }
}
