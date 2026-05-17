/**
 * Default (development) environment.
 *
 * Mirrors the conventions used in mereka-frontend-workspace-v2:
 *   - apiUrl points at the Fastify backend (mereka-backend-v2)
 *   - appUrls is the cross-app SSO map (auth, app, web, admin, checkout)
 *
 * Programs is currently mocked client-side until the backend Programs module
 * lands; flip `useMocks` to false once the API surface ships.
 */
export const environment = {
  production: false,
  useMocks: true,

  apiUrl: 'http://localhost:4000/api/v1',
  apiBaseUrl: 'http://localhost:4000',

  appUrls: {
    auth: 'http://localhost:4201',
    app: 'http://localhost:4202',
    web: 'http://localhost:4200',
    admin: 'http://localhost:4204',
    checkout: 'http://localhost:4203',
    lms: 'http://localhost:18000', // Open edX (mereka-lms)
  },

  /**
   * SSO contract — must match mereka-frontend-workspace-v2/projects/web/src/app/core/services/auth.service.ts:
   * an httpOnly cookie ("mereka_session") set by mereka-backend-v2 /auth/login is shared across
   * *.mereka.io subdomains. We never read the cookie directly; we hit /auth/me with credentials.
   */
  ssoCookieDomain: 'localhost',
} as const;
