import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { ProgramListPage } from './pages/program-list/program-list.page';
import { ProgramDetailPage } from './pages/program-detail/program-detail.page';
import { ProgramLandingPage } from './pages/program-landing/program-landing.page';
import { ProgramFeedTab } from './pages/program-detail/tabs/program-feed.tab';
import { ProgramAboutTab } from './pages/program-detail/tabs/program-about.tab';
import { ProgramCurriculumTab } from './pages/program-detail/tabs/program-curriculum.tab';
import { ProgramMembersTab } from './pages/program-detail/tabs/program-members.tab';
import { ProgramDiscussionsTab } from './pages/program-detail/tabs/program-discussions.tab';
import { ProgramCreatePage } from './pages/program-create/program-create.page';
import { ProgramEditPage } from './pages/program-edit/program-edit.page';
import { MyProgramsPage } from './pages/my-programs/my-programs.page';

export const PROGRAMS_ROUTES: Routes = [
  { path: '', component: ProgramListPage, pathMatch: 'full' },
  { path: 'new', canActivate: [authGuard], component: ProgramCreatePage },
  { path: 'me', canActivate: [authGuard], component: MyProgramsPage },
  { path: ':slug/edit', canActivate: [authGuard], component: ProgramEditPage },
  {
    path: ':slug',
    component: ProgramDetailPage,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'feed' },
      { path: 'feed', component: ProgramFeedTab },
      { path: 'about', component: ProgramAboutTab },
      { path: 'curriculum', component: ProgramCurriculumTab },
      { path: 'discussions', component: ProgramDiscussionsTab },
      { path: 'members', component: ProgramMembersTab },
      /** Public landing / marketing page — full-width, no sidebar */
      { path: 'landing', component: ProgramLandingPage },
    ],
  },
];
