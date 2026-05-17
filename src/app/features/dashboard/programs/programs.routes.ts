import { Routes } from '@angular/router';
import { UserDashboardShellComponent } from '../../user-dashboard/components/user-dashboard-shell.component';
import { ManageProgramsPage } from './pages/manage-programs.page';
import { ProgramDetailManagePage } from './pages/program-detail-manage.page';

export const DASHBOARD_PROGRAMS_ROUTES: Routes = [
  {
    path: '',
    component: UserDashboardShellComponent,
    children: [
      { path: '', pathMatch: 'full', component: ManageProgramsPage },
      { path: ':slug', component: ProgramDetailManagePage },
    ],
  },
];
