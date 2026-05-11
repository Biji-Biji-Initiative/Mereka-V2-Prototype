import { Routes } from '@angular/router';
import { ExperienceListPage } from './pages/experience-list.page';
import { ExperienceDetailPage } from './pages/experience-detail.page';
import { ExperienceCreatePage } from './pages/experience-create.page';
import { ExperienceAdminListPage } from './pages/experience-admin-list.page';
import { ExperienceEditPage } from './pages/experience-edit.page';

export const EXPERIENCES_ROUTES: Routes = [
  { path: '', component: ExperienceListPage, pathMatch: 'full' },
  { path: 'new', component: ExperienceCreatePage },
  { path: 'admin', component: ExperienceAdminListPage },
  { path: 'admin/:slug/edit', component: ExperienceEditPage },
  { path: ':slug', component: ExperienceDetailPage },
];
