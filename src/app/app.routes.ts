import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'programs' },
  { path: 'programs', loadChildren: () => import('./features/programs/programs.routes').then((m) => m.PROGRAMS_ROUTES) },
  { path: 'programmes', loadChildren: () => import('./features/programs/programs.routes').then((m) => m.PROGRAMS_ROUTES) },
  { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES) },
  { path: 'inbox', loadChildren: () => import('./features/inbox/inbox.routes').then((m) => m.INBOX_ROUTES) },
  { path: '**', loadComponent: () => import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent) },
];
