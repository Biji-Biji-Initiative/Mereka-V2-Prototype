import { Routes } from '@angular/router';
import { UserDashboardShellComponent } from '../user-dashboard/components/user-dashboard-shell.component';
import { DashboardOverviewPage } from './pages/dashboard-overview.page';
import { DashboardBookingsPage } from '../user-dashboard/pages/bookings.page';
import { DashboardCoursesPage } from '../user-dashboard/pages/courses.page';
import { DashboardFavoritesPage } from '../user-dashboard/pages/favorites.page';
import { DashboardNotificationsPage } from '../user-dashboard/pages/notifications.page';
import { DashboardReviewsPage } from '../user-dashboard/pages/reviews.page';
import { DashboardBillingPage } from '../user-dashboard/pages/billing.page';
import { DashboardTransactionsPage } from '../user-dashboard/pages/transactions.page';
import { DashboardSettingsPage } from '../user-dashboard/pages/settings.page';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: UserDashboardShellComponent,
    children: [
      { path: '', pathMatch: 'full', component: DashboardOverviewPage },
      { path: 'bookings', component: DashboardBookingsPage },
      { path: 'courses', component: DashboardCoursesPage },
      { path: 'favorites', component: DashboardFavoritesPage },
      { path: 'notifications', component: DashboardNotificationsPage },
      { path: 'reviews', component: DashboardReviewsPage },
      { path: 'billing', component: DashboardBillingPage },
      { path: 'transactions', component: DashboardTransactionsPage },
      { path: 'settings', component: DashboardSettingsPage },
    ],
  },
  {
    path: 'analytics',
    loadChildren: () =>
      import('../user-dashboard/analytics/analytics.routes').then((m) => m.ANALYTICS_ROUTES),
  },
];
