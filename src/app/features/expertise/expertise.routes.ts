import { Routes } from '@angular/router';
import { ExpertiseListPage } from './pages/expertise-list.page';
import { ExpertiseDetailPage } from './pages/expertise-detail.page';
import { ExpertiseCreatePage } from './pages/expertise-create.page';
import { ExpertiseAdminListPage } from './pages/expertise-admin-list.page';
import { ExpertiseEditPage } from './pages/expertise-edit.page';

export const EXPERTISE_ROUTES: Routes = [
  { path: '', component: ExpertiseListPage, pathMatch: 'full' },
  { path: 'new', component: ExpertiseCreatePage },
  { path: 'admin', component: ExpertiseAdminListPage },
  { path: 'admin/:slug/edit', component: ExpertiseEditPage },
  { path: ':slug', component: ExpertiseDetailPage },
];
