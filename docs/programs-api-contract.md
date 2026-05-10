# Programs API contract — proposal for `mereka-backend-v2`

This document is the source of truth for the Programs API the frontend
consumes. The frontend mocks these endpoints today (see
`src/app/mocks/mock-handler.ts`); the backend should land routes that match
this shape so swapping `environment.useMocks = false` is a one-line change.

## Module layout (suggested)

Mirroring the existing `experiences` and `expertises` modules in
`mereka-backend-v2`:

```
src/modules/web/routes/programs/webProgram.routes.ts        # public reads
src/modules/web/controllers/programs/                       # handlers
src/modules/hub/routes/programs/hubProgram.routes.ts        # hub-scoped writes
src/modules/hub/controllers/programs/
src/core/models/Program.ts                                  # mongoose schema
src/core/models/CurriculumItem.ts
src/core/schemas/web/program.schema.ts                      # JSON schemas (request/response)
src/core/schemas/hub/program.schema.ts
```

## Web (public) routes

| Method | Path | Purpose |
|---|---|---|
| GET | `/programs` | List published programs. Supports `search`, `pricing` (`free`\|`paid`), `hubSlug`, `page`, `pageSize`. |
| GET | `/programs/:slug` | Program detail by slug. 404 if unpublished or doesn't exist. |
| GET | `/programs/:slug/curriculum` | Returns the curriculum items in stable order. |
| GET | `/programs/:slug/members` | Public members roster. Honors per-program `membersVisibility` flag. |
| GET | `/programs/:slug/me/progress` | Requires `requireAuth`. Returns the caller's `LearnerProgress`. 401 if logged out. |

## Hub-scoped (write) routes

All mounted under `/hubs/:hubId/programs` with the same preHandlers used by
`hubScopedExperienceRoutes`: `requireAuth`, `loadHubContext`, `requireHubAccess`,
plus a `requireHubPermission(PERMISSIONS.PROGRAMS_WRITE)` for mutating routes.

| Method | Path | Purpose |
|---|---|---|
| POST | `/` | Create a draft program owned by `:hubId`. |
| PATCH | `/:programId` | Update title, tagline, description, pricing, timeline. |
| POST | `/:programId/curriculum` | Append a `CurriculumItem` (course \| experience \| expertise). |
| PATCH | `/:programId/curriculum/:itemId` | Update item (mandatory, deadline, prerequisites, badge). |
| DELETE | `/:programId/curriculum/:itemId` | Remove from curriculum. |
| POST | `/:programId/collaborators` | Invite a partner hub by `hubId` and role. |
| PATCH | `/:programId/collaborators/:hubId` | Change role. |
| DELETE | `/:programId/collaborators/:hubId` | Revoke. |
| POST | `/:programId/publish` | Flip status from `draft` to `published`. Validates required fields. |

## Auth (already in `mereka-backend-v2`)

The frontend uses these as-is — no changes required:

- `POST /auth/login` (email/password) — sets the SSO cookie.
- `POST /auth/refresh` — refresh the access token.
- `GET /auth/me?includeHubs=true` — returns `{ id, email, name, hubs: [{ hubId, hubName, hubLogo, hubRole }] }`.
- `POST /auth/logout`.

The `hubRole` field on each entry of `hubs` should mirror the user's role
*in that hub* (admin / editor / viewer), not their role in any specific
program. Program-specific roles are derived from `Program.collaborators[]`
and the hub-membership table.

## Content sources

Programs do **not** duplicate course/experience/expertise content. Each
`CurriculumItem` carries a `sourceId` that points back to the owning system:

| `type` | `sourceId` format | Source of truth |
|---|---|---|
| `course` | Open edX course key, e.g. `course-v1:Mereka+AI101+2026` | `mereka-lms` |
| `experience` | Mongo ObjectId | `mereka-backend-v2 → Experience` |
| `expertise` | Mongo ObjectId | `mereka-backend-v2 → Expertise` |

When the curriculum is fetched, the backend should *resolve* each `sourceId`
to fill `title`, `slug`, `blurb`, `ownerHub` from the source — never store
those fields denormalized on the program. Otherwise the program drifts
silently when the underlying course/experience changes.

## Pricing rule

Programs are billed once. When a program is paid:

- Checkout collects a single payment for `Program.pricing.price`.
- All courses/experiences/expertise referenced by the curriculum are
  unlocked for the learner for the program's lifetime.
- The included content's individual prices are *not* charged; the LMS
  enrollment is auto-provisioned and experience/expertise tickets are
  redeemed via a new "program voucher" enum on the booking model.

When a program is free, all included content is free for enrolled members
for the program's lifetime — same mechanism, voucher of value `0`.
