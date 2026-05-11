import { Routes } from '@angular/router';
import { AuthShellPage } from './pages/auth-shell.page';
import { LoginPage } from './pages/login.page';
import { SignupPage } from './pages/signup.page';
import { ForgotPasswordPage } from './pages/forgot-password.page';
import { ResetPasswordPage } from './pages/reset-password.page';
import { VerifyEmailPage } from './pages/verify-email.page';
import { OtpPage } from './pages/otp.page';
import { AcceptInvitePage } from './pages/accept-invite.page';
import { JoinLinkPage } from './pages/join-link.page';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthShellPage,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', component: LoginPage },
      { path: 'signup', component: SignupPage },
      { path: 'forgot-password', component: ForgotPasswordPage },
      { path: 'reset-password', component: ResetPasswordPage },
      { path: 'verify-email', component: VerifyEmailPage },
      { path: 'otp', component: OtpPage },
      { path: 'join/invite/:token', component: AcceptInvitePage },
      { path: 'join/link/:token', component: JoinLinkPage },
    ],
  },
];
