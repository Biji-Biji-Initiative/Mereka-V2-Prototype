import { Routes } from '@angular/router';
import { programAccessGuard } from './guards/program-access.guard';
import { ProgramListPage } from './pages/program-list/program-list.page';
import { ProgramDetailPage } from './pages/program-detail/program-detail.page';
import { ProgramFeedTab } from './pages/program-detail/tabs/program-feed.tab';
import { ProgramAboutTab } from './pages/program-detail/tabs/program-about.tab';
import { ProgramCurriculumTab } from './pages/program-detail/tabs/program-curriculum.tab';
import { ProgramMembersTab } from './pages/program-detail/tabs/program-members.tab';
import { ProgramDiscussionsTab } from './pages/program-detail/tabs/program-discussions.tab';
import { ProgramAnnouncementsTab } from './pages/program-detail/tabs/program-announcements.tab';
import { ProgramResourcesTab } from './pages/program-detail/tabs/program-resources.tab';
import { ProgramRecordingsTab } from './pages/program-detail/tabs/program-recordings.tab';
import { ProgramCreatePage } from './pages/program-create/program-create.page';
import { ProgramAdminAllPage } from './pages/program-admin-all/program-admin-all.page';
import { ProgramAdminDashboardTab } from './pages/program-detail/admin/admin-dashboard.tab';
import { ProgramAdminAnalyticsTab } from './pages/program-detail/admin/admin-analytics.tab';
import { ProgramAdminMembersTab } from './pages/program-detail/admin/admin-members.tab';
import { ProgramAdminFormsTab } from './pages/program-detail/admin/admin-forms.tab';
import { ProgramAdminContentTab } from './pages/program-detail/admin/admin-content.tab';
import { ProgramAdminInboxTab } from './pages/program-detail/admin/admin-inbox.tab';
import { ProgramAdminFeedbackTab } from './pages/program-detail/admin/admin-feedback.tab';
import { ProgramLandingPage } from './pages/program-landing/program-landing.page';
import { YourProgramsPage } from './pages/your-programs/your-programs.page';

export const PROGRAMS_ROUTES: Routes = [
  { path: '', component: ProgramListPage, pathMatch: 'full' },
  { path: 'new', component: ProgramCreatePage },
  { path: 'me', component: YourProgramsPage },
  { path: 'admin', component: ProgramAdminAllPage },
  {
    path: ':slug/landing',
    component: ProgramLandingPage,
  },
  {
    path: ':slug',
    component: ProgramDetailPage,
    canActivate: [programAccessGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'feed' },
      { path: 'feed', component: ProgramFeedTab },
      { path: 'announcements', component: ProgramAnnouncementsTab },
      { path: 'about', component: ProgramAboutTab },
      { path: 'curriculum', component: ProgramCurriculumTab },
      { path: 'resources', component: ProgramResourcesTab },
      { path: 'recordings', component: ProgramRecordingsTab },
      { path: 'discussions', component: ProgramDiscussionsTab },
      { path: 'members', component: ProgramMembersTab },
      { path: 'admin', pathMatch: 'full', redirectTo: 'admin/dashboard' },
      { path: 'admin/dashboard', component: ProgramAdminDashboardTab },
      { path: 'admin/analytics', component: ProgramAdminAnalyticsTab },
      { path: 'admin/members', component: ProgramAdminMembersTab },
      { path: 'admin/forms', component: ProgramAdminFormsTab },
      { path: 'admin/content', component: ProgramAdminContentTab },
      { path: 'admin/inbox', component: ProgramAdminInboxTab },
      { path: 'admin/feedback', component: ProgramAdminFeedbackTab },
    ],
  },
];
