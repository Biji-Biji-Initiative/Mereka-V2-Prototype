import { Routes } from '@angular/router';
import { UserDashboardShellComponent } from '../../user-dashboard/components/user-dashboard-shell.component';
import { FormsListPage } from './pages/forms-list.page';
import { FormBuilderPage } from './pages/form-builder.page';
import { FormResponsesPage } from './pages/form-responses.page';

// Builder + responses already render their own sidebar (full-bleed canvases),
// so they go OUTSIDE the shell. Only the list uses the shell wrapper.
export const FORMS_ROUTES: Routes = [
  { path: 'new',                              component: FormBuilderPage   },
  { path: ':id/responses',                    component: FormResponsesPage },
  { path: ':id',                              component: FormBuilderPage   },
  {
    path: '',
    component: UserDashboardShellComponent,
    children: [
      { path: '', pathMatch: 'full', component: FormsListPage },
    ],
  },
];
