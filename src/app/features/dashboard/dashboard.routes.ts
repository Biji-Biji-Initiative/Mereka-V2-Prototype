import { Routes } from '@angular/router';
import { DashboardOverviewPage } from './pages/dashboard-overview.page';
export const DASHBOARD_ROUTES: Routes = [
  { path: '', component: DashboardOverviewPage, pathMatch: 'full' },
];
