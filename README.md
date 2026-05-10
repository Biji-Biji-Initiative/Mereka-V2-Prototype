# mereka-frontend-v2 — Programs

A standalone Angular 21 app implementing the **Programs** feature for mereka.io v2.

It is built to slot into the existing
[`mereka-frontend-workspace-v2`](https://github.com/Biji-Biji-Initiative/mereka-frontend-workspace-v2)
monorepo as a `web/features/programs` (or `app/features/programs`) module —
this repo is laid out so that the `src/app/features/programs` folder can be
copied across with no changes once the backend Programs module ships.

## What's in here

| Surface | Route | Notes |
|---|---|---|
| Programs feed | `/programs` | Browse all programs; filter by Free/Paid; search |
| Program profile | `/programs/:slug/feed` | Community-style hero + posts feed |
| Discussions | `/programs/:slug/discussions` | Long-form posts (channel = discussion) |
| **Curriculum** | `/programs/:slug/curriculum` | Learner progress across courses + experiences + expertise |
| Members | `/programs/:slug/members` | Roster grid |
| About | `/programs/:slug/about` | Description, pricing, hub partners, timeline |
| Create program | `/programs/new` | Multi-step admin flow: basic → timeline → collaborators → structure → landing → publish |

## Why Programs

Programs are a *combination* feature. They bundle:

- **Courses** from [`mereka-lms`](https://github.com/Biji-Biji-Initiative/mereka-lms) (Open edX)
- **Experiences** from [`mereka-backend-v2`](https://github.com/Biji-Biji-Initiative/mereka-backend-v2)
- **Expertise** sessions from `mereka-backend-v2`

…into a single guided journey owned by one Mereka **Hub** (with optional
collaborator hubs in `admin` / `editor` / `viewer` roles).

Pricing rule (encoded in `Program.pricing`): a paid program pays once for
**everything inside** — the included course/experience/expertise prices are
absorbed.

## Running it

```bash
npm install
npm start            # http://localhost:4200
npm run build
```

There's no installer-side state. A small seed (`src/app/mocks/programs.fixtures.ts`)
hydrates three sample programs so every screen has data to render.

## SSO contract (read this if you wire it up to a real backend)

Auth is **shared** with `mereka-lms` and the rest of the Mereka workspace
apps via an httpOnly cookie set on `*.mereka.io` (configurable via
`environment.ssoCookieDomain`). The contract this app honors:

1. `AuthService.init()` runs on app boot and calls
   `GET {apiUrl}/auth/me?includeHubs=true` with `withCredentials: true`.
2. `authInterceptor` adds `withCredentials` to every request and queues a
   single token refresh on 401, mirroring
   `mereka-frontend-workspace-v2/projects/web/.../auth.interceptor.ts`.
3. Logged-out users can browse `/programs` and `/programs/:slug` freely;
   `/programs/new` is logged-in-only (the admin Create flow). Login redirects
   to `environment.appUrls.auth/login?redirect=…`.

If you log into the LMS at `lms.mereka.io`, you're logged in here too —
because the SSO cookie travels.

## Programs API contract (mocked today)

The `ProgramsService` calls the following endpoints. While the backend
Programs module is being built, an Angular HTTP interceptor short-circuits
these to the seed data in `src/app/mocks/`. Set `environment.useMocks = false`
and the same calls go to the real Fastify backend.

| Method | Path | Returns |
|---|---|---|
| `GET` | `/api/v1/programs?search=&pricing=&page=&pageSize=` | `PaginatedResponse<Program>` |
| `GET` | `/api/v1/programs/:slug` | `Program` |
| `GET` | `/api/v1/programs/:slug/curriculum` | `CurriculumItem[]` |
| `GET` | `/api/v1/programs/:slug/members` | `ProgramMember[]` |
| `GET` | `/api/v1/programs/:slug/me/progress` | `LearnerProgress` |

Recommended write endpoints (not yet implemented in backend, but the Create
flow targets them):

| Method | Path | Notes |
|---|---|---|
| `POST` | `/api/v1/hubs/:hubId/programs` | Hub-scoped, requires `requireHubPermission('programs:write')` |
| `PATCH` | `/api/v1/hubs/:hubId/programs/:programId` | Same |
| `POST` | `/api/v1/hubs/:hubId/programs/:programId/collaborators` | Invite a partner hub |
| `POST` | `/api/v1/programs/:slug/enroll` | Learner-side, redirects through checkout for paid |

## Stack

Mirrored from `mereka-frontend-workspace-v2`:

- Angular 21 with **standalone components** + signals
- Tailwind 3 (preflight off — palette mirrored from the workspace `tailwind.config.js`)
- Strict TypeScript (`strict`, `noImplicitOverride`, `strictTemplates`)
- HTTP-only auth via `withCredentials` cookies
- Test runner: Karma (per Angular 21 default; tests not seeded here)

## Designs

The 241 Figma export PNGs that drove this implementation live in the
internal Mereka Workspace (`Mereka.io — UXA`); the most relevant ones for
Programs are:

- `PROGRAM LANDING PAGE.png` → `/programs`
- `Program-feed.png` → `/programs/:slug/feed`
- `Program-profile-about.png` → `/programs/:slug/about`
- `Program-learner-curriculum.png` → `/programs/:slug/curriculum`
- `Program-members.png` → `/programs/:slug/members`
- `Program-Creation-collaborator.png` and `Program-Creation-structure.png` → `/programs/new`

## What's intentionally not here

- **Server-side rendering / hydration** — the workspace's `web` project uses
  `@angular/ssr`; this scaffold is CSR-only because it simplifies the GitHub
  template. Wire it up by copying `app.config.server.ts` from the workspace.
- **Real write endpoints** — Create publishes via `alert()`. The form state
  is fully wired so swapping in a real `POST` is a single line.
- **Forum / inbox / analytics screens** — covered by the wider design set
  but out of scope for the Programs MVP per the Phase 1 brief.

## Where this came from

The brief was to combine three internal sources of truth into one app:

1. Conventions and shared patterns from `mereka-frontend-workspace-v2`.
2. The live API surface in `mereka-backend-v2` (where `programs/` doesn't
   exist yet — this repo is the proposed contract).
3. The Figma export delivered with the Mereka Access doc.

The ClickUp doc referenced in the original brief
(`app.clickup.com/2627356/v/l/2g5rw-111016`) requires login and could not be
fetched anonymously; if you spot an inconsistency between this implementation
and the doc, the doc wins — please open an issue.
