import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  {
    path: 'programs',
    loadChildren: () =>
      import('./features/programs/programs.routes').then((m) => m.PROGRAMS_ROUTES),
  },
  {
    path: 'programmes', // alias — the brief and ClickUp screens use both spellings
    loadChildren: () =>
      import('./features/programs/programs.routes').then((m) => m.PROGRAMS_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/flows/flows.routes').then((m) => m.FLOWS_ROUTES),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
