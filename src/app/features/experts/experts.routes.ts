import { Routes } from '@angular/router';
import { ExpertListPage } from './pages/expert-list.page';
import { ExpertDetailPage } from './pages/expert-detail.page';

export const EXPERTS_ROUTES: Routes = [
  { path: '', component: ExpertListPage, pathMatch: 'full' },
  { path: ':slug', component: ExpertDetailPage },
];
