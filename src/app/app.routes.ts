import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES) },
  { path: 'programs', loadChildren: () => import('./features/programs/programs.routes').then((m) => m.PROGRAMS_ROUTES) },
  { path: 'programmes', loadChildren: () => import('./features/programs/programs.routes').then((m) => m.PROGRAMS_ROUTES) },
  { path: 'experiences', loadChildren: () => import('./features/experiences/experiences.routes').then((m) => m.EXPERIENCES_ROUTES) },
  { path: 'experience', loadChildren: () => import('./features/experiences/experiences.routes').then((m) => m.EXPERIENCES_ROUTES) },
  { path: 'expertise', loadChildren: () => import('./features/expertise/expertise.routes').then((m) => m.EXPERTISE_ROUTES) },
  { path: 'gigs', loadChildren: () => import('./features/gigs/gigs.routes').then((m) => m.GIGS_ROUTES) },
  { path: 'jobs', loadChildren: () => import('./features/gigs/gigs.routes').then((m) => m.GIGS_ROUTES) },
  { path: 'hubs', loadChildren: () => import('./features/hubs/hubs.routes').then((m) => m.HUBS_ROUTES) },
  { path: 'checkout', loadChildren: () => import('./features/checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES) },
  { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES) },
  { path: 'inbox', loadChildren: () => import('./features/inbox/inbox.routes').then((m) => m.INBOX_ROUTES) },
  { path: '**', loadComponent: () => import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent) },
];
