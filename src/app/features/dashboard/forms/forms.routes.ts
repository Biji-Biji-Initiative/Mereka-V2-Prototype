import { Routes } from '@angular/router';
import { UserDashboardShellComponent } from '../../user-dashboard/components/user-dashboard-shell.component';
import { FormsListPage } from './pages/forms-list.page';
import { FormBuilderPage } from './pages/form-builder.page';
import { FormResponsesPage } from './pages/form-responses.page';

export const FORMS_ROUTES: Routes = [
  {
    path: '',
    component: UserDashboardShellComponent,
    children: [
      { path: '',              pathMatch: 'full', component: FormsListPage     },
      { path: 'new',                              component: FormBuilderPage   },
      { path: ':id/responses',                    component: FormResponsesPage },
      { path: ':id',                              component: FormBuilderPage   },
    ],
  },
];
