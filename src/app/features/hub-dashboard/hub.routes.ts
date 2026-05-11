import { Routes } from '@angular/router';
import { HubDashboardShellComponent } from './components/hub-dashboard-shell.component';
import { HubOverviewPage } from './pages/hub-overview.page';
import { HubAnalyticsPage } from './pages/hub-analytics.page';
import { HubBookingsPage } from './pages/hub-bookings.page';
import { HubCalendarPage } from './pages/hub-calendar.page';
import { HubServicesPage } from './pages/hub-services.page';
import { HubJobsPage } from './pages/hub-jobs.page';
import { HubReviewsPage } from './pages/hub-reviews.page';
import { HubEngagementPage } from './pages/hub-engagement.page';
import { HubSettingsPage } from './pages/hub-settings.page';

export const HUB_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: HubDashboardShellComponent,
    children: [
      { path: '', pathMatch: 'full', component: HubOverviewPage },
      { path: 'analytics', component: HubAnalyticsPage },
      { path: 'bookings', component: HubBookingsPage },
      { path: 'calendar', component: HubCalendarPage },
      { path: 'services', component: HubServicesPage },
      { path: 'jobs', component: HubJobsPage },
      { path: 'reviews', component: HubReviewsPage },
      { path: 'engagement', component: HubEngagementPage },
      { path: 'settings', component: HubSettingsPage },
    ],
  },
];
