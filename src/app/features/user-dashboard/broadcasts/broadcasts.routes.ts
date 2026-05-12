import { Routes } from '@angular/router';
import { UserDashboardShellComponent } from '../components/user-dashboard-shell.component';
import { BroadcastsListPage } from './pages/broadcasts-list.page';
import { BroadcastComposePage } from './pages/broadcast-compose.page';
import { BroadcastDetailPage } from './pages/broadcast-detail.page';
import { EmailTemplatesListPage } from './pages/email-templates-list.page';
import { EmailTemplateBuilderPage } from './pages/email-template-builder.page';
import { WhatsappTemplatesListPage } from './pages/whatsapp-templates-list.page';
import { WhatsappTemplateBuilderPage } from './pages/whatsapp-template-builder.page';

// The template builders run full-bleed (no dashboard sidebar) to maximise
// canvas space, so they're siblings of the shell route rather than children.
export const BROADCASTS_ROUTES: Routes = [
  {
    path: 'templates/email/:id',
    component: EmailTemplateBuilderPage,
  },
  {
    path: 'templates/whatsapp/:id',
    component: WhatsappTemplateBuilderPage,
  },
  {
    path: '',
    component: UserDashboardShellComponent,
    children: [
      { path: '', pathMatch: 'full', component: BroadcastsListPage },
      { path: 'new', component: BroadcastComposePage },
      { path: 'templates/email', component: EmailTemplatesListPage },
      { path: 'templates/whatsapp', component: WhatsappTemplatesListPage },
      { path: ':id', component: BroadcastDetailPage },
    ],
  },
];
