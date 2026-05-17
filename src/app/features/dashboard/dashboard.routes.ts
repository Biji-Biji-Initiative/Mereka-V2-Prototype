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
  // Main /dashboard route uses its own integrated sidebar layout.
  { path: '', pathMatch: 'full', component: DashboardOverviewPage },

  // Forms (Manage Forms) — lazy
  {
    path: 'forms',
    loadChildren: () =>
      import('./forms/forms.routes').then((m) => m.FORMS_ROUTES),
  },

  // Analytics Dashboard
  {
    path: 'analytics',
    loadChildren: () =>
      import('./analytics/analytics.routes').then((m) => m.ANALYTICS_ROUTES),
  },

  // Hub listings (Post Listing, Manage Listings, Manage Gigs, Manage Programs)
  {
    path: 'listings',
    loadChildren: () =>
      import('./listings/listings.routes').then((m) => m.LISTINGS_ROUTES),
  },
  {
    path: 'gigs',
    loadChildren: () =>
      import('./gigs/gigs.routes').then((m) => m.GIGS_ROUTES),
  },
  {
    path: 'programs',
    loadChildren: () =>
      import('./programs/programs.routes').then((m) => m.DASHBOARD_PROGRAMS_ROUTES),
  },

  // Existing user-dashboard sub-routes now render inside the new shell.
  {
    path: '',
    component: UserDashboardShellComponent,
    children: [
      { path: 'bookings',      component: DashboardBookingsPage      },
      { path: 'courses',       component: DashboardCoursesPage       },
      { path: 'favorites',     component: DashboardFavoritesPage     },
      { path: 'notifications', component: DashboardNotificationsPage },
      { path: 'reviews',       component: DashboardReviewsPage       },
      { path: 'billing',       component: DashboardBillingPage       },
      { path: 'transactions',  component: DashboardTransactionsPage  },
      { path: 'settings',      component: DashboardSettingsPage      },
    ],
  },

  // Broadcasts (Manage Communications)
  {
    path: 'broadcasts',
    loadChildren: () =>
      import('./broadcasts/broadcasts.routes').then((m) => m.BROADCASTS_ROUTES),
  },
];
