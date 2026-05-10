import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { mockHandler } from '../../mocks/mock-handler';

/**
 * Routes API calls through src/app/mocks when environment.useMocks === true.
 *
 * The contract: mockHandler returns a typed payload (or null when no route matched).
 * Real routes that aren't mocked still hit the network — useful for /auth/me where
 * we want to integrate the real SSO contract during development.
 */
export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMocks) return next(req);

  const handled = mockHandler(req);
  if (handled === null) return next(req);

  return of(
    new HttpResponse({
      status: 200,
      body: { success: true, data: handled },
    }),
  ).pipe(delay(120)); // small latency so loading states are visible during dev
};
