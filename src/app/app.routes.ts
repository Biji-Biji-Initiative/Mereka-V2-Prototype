import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'programs',
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
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
