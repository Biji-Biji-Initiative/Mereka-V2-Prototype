import { Routes } from '@angular/router';
import { OnboardingLearnerPage } from './pages/onboarding-learner.page';
import { OnboardingExpertPage } from './pages/onboarding-expert.page';
import { OnboardingExpertisePage } from './pages/onboarding-expertise.page';
import { OnboardingExperiencePage } from './pages/onboarding-experience.page';
import { OnboardingHubPage } from './pages/onboarding-hub.page';
import { OnboardingJobPage } from './pages/onboarding-job.page';

export const ONBOARDING_ROUTES: Routes = [
  { path: 'learner', component: OnboardingLearnerPage },
  { path: 'expert', component: OnboardingExpertPage },
  { path: 'expertise', component: OnboardingExpertisePage },
  { path: 'experience', component: OnboardingExperiencePage },
  { path: 'hub', component: OnboardingHubPage },
  { path: 'job', component: OnboardingJobPage },
  { path: '', pathMatch: 'full', redirectTo: 'learner' },
];
