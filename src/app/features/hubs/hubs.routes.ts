import { Routes } from '@angular/router';
import { HubListPage } from './pages/hub-list.page';
import { HubDetailPage } from './pages/hub-detail.page';
export const HUBS_ROUTES: Routes = [
  { path: '', component: HubListPage, pathMatch: 'full' },
  { path: ':slug', component: HubDetailPage },
];
