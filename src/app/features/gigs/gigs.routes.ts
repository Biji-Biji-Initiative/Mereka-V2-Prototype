import { Routes } from '@angular/router';
import { GigListPage } from './pages/gig-list.page';
import { GigDetailPage } from './pages/gig-detail.page';
import { GigCreatePage } from './pages/gig-create.page';
import { GigAdminListPage } from './pages/gig-admin-list.page';
import { GigEditPage } from './pages/gig-edit.page';
import { GigApplicantsPage } from './pages/gig-applicants.page';

export const GIGS_ROUTES: Routes = [
  { path: '', component: GigListPage, pathMatch: 'full' },
  { path: 'new', component: GigCreatePage },
  { path: 'admin', component: GigAdminListPage },
  { path: 'admin/:slug/edit', component: GigEditPage },
  { path: 'admin/:slug/applicants', component: GigApplicantsPage },
  { path: ':slug', component: GigDetailPage },
];
