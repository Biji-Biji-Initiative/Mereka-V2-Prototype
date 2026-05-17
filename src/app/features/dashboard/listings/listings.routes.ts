import { Routes } from '@angular/router';
import { UserDashboardShellComponent } from '../../user-dashboard/components/user-dashboard-shell.component';
import { ListingsListPage } from './pages/listings-list.page';
import { ListingNewPage } from './pages/listing-new.page';

export const LISTINGS_ROUTES: Routes = [
  {
    path: '',
    component: UserDashboardShellComponent,
    children: [
      { path: '',    pathMatch: 'full', component: ListingsListPage },
      { path: 'new',                    component: ListingNewPage   },
    ],
  },
];
