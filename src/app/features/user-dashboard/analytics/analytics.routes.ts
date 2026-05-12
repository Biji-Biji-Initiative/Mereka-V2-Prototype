import { Routes } from '@angular/router';
import { AnalyticsShellComponent } from './analytics-shell.component';
import { analyticsPlanGuard } from './services/analytics-plan.guard';
import { ImpactOverviewPage } from './pages/impact-overview.page';
import { CategoryListPage } from './pages/category-list.page';
import { CategoryDetailPage } from './pages/category-detail.page';
import { CorrelationsPage } from './pages/correlations.page';
import { KpiBuilderPage } from './pages/kpi-builder.page';
import { B40ImpactPage } from './pages/b40-impact.page';
import { ServiceCategory } from './services/analytics.types';

interface CategoryRoute {
  path: string;
  category: ServiceCategory;
  title: string;
  nameLabel: string;
  backLabel: string;
}

const CATEGORIES: CategoryRoute[] = [
  { path: 'programme',  category: 'programme',  title: 'All Programmes',  nameLabel: 'Programme',  backLabel: 'programmes' },
  { path: 'courses',    category: 'course',     title: 'All Courses',     nameLabel: 'Course',     backLabel: 'courses' },
  { path: 'experience', category: 'experience', title: 'All Experiences', nameLabel: 'Experience', backLabel: 'experiences' },
  { path: 'expertise',  category: 'expertise',  title: 'All Expertise',   nameLabel: 'Expertise',  backLabel: 'expertise' },
  { path: 'gig',        category: 'gig',        title: 'All Gigs',        nameLabel: 'Gig',        backLabel: 'gigs' },
];

export const ANALYTICS_ROUTES: Routes = [
  {
    path: '',
    component: AnalyticsShellComponent,
    canMatch: [analyticsPlanGuard],
    children: [
      { path: '', pathMatch: 'full', component: ImpactOverviewPage },
      ...CATEGORIES.flatMap((c) => [
        {
          path: c.path,
          component: CategoryListPage,
          // route data + withComponentInputBinding() flow into @Input fields
          data: { category: c.category, title: c.title, nameLabel: c.nameLabel },
        },
        {
          path: `${c.path}/:id`,
          component: CategoryDetailPage,
          data: {
            category: c.category,
            backTo: `/dashboard/analytics/${c.path}`,
            backLabel: c.backLabel,
          },
        },
      ]),
      { path: 'correlations', component: CorrelationsPage },
      { path: 'kpi-builder',  component: KpiBuilderPage },
      { path: 'b40',          component: B40ImpactPage },
    ],
  },
];
