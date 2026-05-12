# Flow coverage map

Source: **Mereka Platform — Complete E2E Flow Documentation v2.0** (2026-05-12).

This file tracks which sections of the E2E flow doc have prototype pages in `mereka-frontend-v2`.

| Section | Status | Routes / files |
|---|---|---|
| §1 Platform Ecosystem | n/a | reference only |
| §2 Program Lifecycle (Phase 1 — creation) | ✅ Covered | `/programs/new` (`program-create.page`) |
| §2 Program Lifecycle (Phase 2 — management) | ✅ Covered | `/programs/me`, `/programs/:slug/admin/*` |
| §2 Program Lifecycle (Phase 3 — execution) | ⚠️ Partial → ✅ now | + `/programs/:slug/survey?stage=pre|post`, `/programs/:slug/certificate` |
| §3 B2B Non-Funded | ❌ Missing → ✅ now | `/corporate/inquire`, `/quotations/:id` |
| §4 B2B Funded | ⚠️ Partial | hand-off after corporate inquiry; "Mark Funded" toggle still TODO on programme settings |
| §5 B2C Direct | ✅ Covered | existing `/checkout`, programs flow |
| §6 Create Experience | ⚠️ Single-page placeholder | `onboarding-experience.page.ts` — multi-step (basic-info → audience → booking → tickets → page → details → confirm) still TODO |
| §7 Create Expertise | ⚠️ Single-page placeholder | `onboarding-expertise.page.ts` — multi-step (your-expertise → availability-rates → booking-details → confirmation) still TODO |
| §8 Course & LMS | ❌ Missing → ✅ now | `/lms/launch/:courseId` (SSO bridge), pre/post surveys + programme certificate |
| §9 Jobs & Proposals | ✅ Partial | `/gigs`, `/checkout/proposal` exist; milestone dashboard + Stripe Connect payout view still TODO |
| §10 Onboarding (auth) | ✅ Covered | login, signup, otp, forgot/reset, verify, accept-invite, join-link |
| §10 Onboarding (hub multi-step) | ⚠️ Single-page placeholder | doc lists 8 hub steps; only one stub today |
| §10 Onboarding (expert solo) | ⚠️ Single-page placeholder | doc lists 4 expert steps; only one stub today |
| §10 Onboarding (learner) | ⚠️ Single-page placeholder | one stub today |
| §11 Plans / Pricing | ❌ Missing → ✅ now | `/plans` (Scale vs Soar with MY/INTL toggle) |
| §11 Campaign (PLANNED in doc) | ❌ Missing → ✅ now | `/redeem` user-facing, `/admin/campaigns` admin surface |
| §11 Subscription management | ⚠️ TODO | active plan / change plan / cancel still missing |
| §12 LMS↔IO Integration | ❌ All missing → ✅ user-facing now | LMS bridge UI added; backend services (UserLmsAccount, LmsCourseSyncService, LmsEnrollmentService, LmsProgressService) still PLANNED |

## What this branch ships

Eight new prototype pages, lazy-loaded via `src/app/features/flows/flows.routes.ts`:

| Route | Page | Fills |
|---|---|---|
| `/plans` (and `/pricing`) | `PricingPage` | §11 Plans |
| `/redeem` | `RedeemPage` | §11 Campaign — user redemption |
| `/lms/launch/:courseId` | `LmsBridgePage` | §8 + §12 SSO bridge |
| `/programs/:slug/survey?stage=pre` | `ProgramSurveyPage` | §8 pre-program survey |
| `/programs/:slug/survey?stage=post` | `ProgramSurveyPage` | §8 post-program survey |
| `/programs/:slug/certificate` | `ProgrammeCertificatePage` | §2 Phase 3 + §8 final cert |
| `/corporate/inquire` | `CorporateInquirePage` | §3 B2B Non-Funded entry |
| `/quotations/:id` | `QuotationPage` | §3 quotation review (corporate client view) |
| `/admin/campaigns` | `AdminCampaignsPage` | §11 Campaign admin |

## Still TODO after this branch

In rough priority for the next prototype pass:

1. **Hub onboarding multi-step** — split `/onboarding/hub` into form → pricing → payment-loader → setup → profile → details → about → confirm (Scale vs Soar fork on details/about).
2. **Expert solo onboarding multi-step** — your-profile → your-skills → your-background → confirmation.
3. **Create Experience platform multi-step** — basic-info → audience → booking → tickets → page → details → confirm.
4. **Create Expertise multi-step** — your-expertise → availability-rates → booking-details → confirmation.
5. **Job booking widget** on `/jobs/:id` detail (sidebar widget that links to `/checkout/proposal`).
6. **Milestone dashboard + Stripe Connect payout** view for §9.
7. **Subscription management** screen (active plan, change plan, cancel) for §11.
8. **B2B Funded admin** — "Mark Funded" toggle on programme settings + funder reporting export view.
9. **Course catalog sync admin** view (paired with the planned `LmsCourseSyncService`).
