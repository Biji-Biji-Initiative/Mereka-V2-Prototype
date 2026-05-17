import { Routes } from '@angular/router';
import { UserDashboardShellComponent } from '../../user-dashboard/components/user-dashboard-shell.component';
import { GigsApplicationsPage } from './pages/gigs-applications.page';

export const GIGS_ROUTES: Routes = [
  {
    path: '',
    component: UserDashboardShellComponent,
    children: [
      { path: '', pathMatch: 'full', component: GigsApplicationsPage },
    ],
  },
];
