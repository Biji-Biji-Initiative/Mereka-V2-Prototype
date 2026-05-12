import { Routes } from '@angular/router';
import { PricingPage } from './pages/pricing.page';
import { RedeemPage } from './pages/redeem.page';
import { LmsBridgePage } from './pages/lms-bridge.page';
import { ProgramSurveyPage } from './pages/program-survey.page';
import { ProgrammeCertificatePage } from './pages/programme-certificate.page';
import { CorporateInquirePage } from './pages/corporate-inquire.page';
import { QuotationPage } from './pages/quotation.page';
import { AdminCampaignsPage } from './pages/admin-campaigns.page';

/**
 * Cross-cutting prototype pages that fill flow gaps from the
 * Mereka Platform — Complete E2E Flow Documentation v2.0:
 *   §3 B2B Non-Funded     → /corporate/inquire, /quotations/:id
 *   §8 LMS Course delivery → /lms/launch/:courseId
 *   §8 LMS Surveys + Cert  → /programs/:slug/survey, /programs/:slug/certificate
 *   §11 Plans / Paywall    → /plans
 *   §11 Campaign (PLANNED) → /redeem, /admin/campaigns
 */
export const FLOWS_ROUTES: Routes = [
  { path: 'plans', component: PricingPage },
  { path: 'pricing', component: PricingPage },
  { path: 'redeem', component: RedeemPage },
  { path: 'lms/launch/:courseId', component: LmsBridgePage },
  { path: 'corporate/inquire', component: CorporateInquirePage },
  { path: 'quotations/:id', component: QuotationPage },
  { path: 'admin/campaigns', component: AdminCampaignsPage },
  // Programme-scoped surveys + certificate live alongside /programs/:slug/* but are
  // surfaced from this module so they can be added without touching programs.routes.ts.
  { path: 'programs/:slug/survey', component: ProgramSurveyPage },
  { path: 'programmes/:slug/survey', component: ProgramSurveyPage },
  { path: 'programs/:slug/certificate', component: ProgrammeCertificatePage },
  { path: 'programmes/:slug/certificate', component: ProgrammeCertificatePage },
];
