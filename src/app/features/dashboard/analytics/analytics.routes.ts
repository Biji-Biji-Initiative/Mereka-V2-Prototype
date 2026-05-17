import { Routes } from '@angular/router';
import { UserDashboardShellComponent } from '../../user-dashboard/components/user-dashboard-shell.component';
import { AnalyticsOverviewPage } from './pages/analytics-overview.page';

export const ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    component: UserDashboardShellComponent,
    children: [
      { path: '', component: AnalyticsOverviewPage },
    ],
  },
];
