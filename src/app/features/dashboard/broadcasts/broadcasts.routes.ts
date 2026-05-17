import { Routes } from '@angular/router';
import { UserDashboardShellComponent } from '../../user-dashboard/components/user-dashboard-shell.component';
import { BroadcastListPage } from './pages/broadcast-list.page';
import { BroadcastCreateTemplatePage } from './pages/broadcast-create-template.page';
import { BroadcastCreateMessagePage } from './pages/broadcast-create-message.page';

export const BROADCASTS_ROUTES: Routes = [
  {
    path: '',
    component: UserDashboardShellComponent,
    children: [
      { path: '',              pathMatch: 'full', component: BroadcastListPage          },
      { path: 'templates/new',                    component: BroadcastCreateTemplatePage },
      { path: 'templates/:id',                    component: BroadcastCreateTemplatePage },
      { path: 'new',                              component: BroadcastCreateMessagePage },
    ],
  },
];
