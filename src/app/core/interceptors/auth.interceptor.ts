import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, from, of, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

let isRefreshing = false;

/**
 * Same shape as mereka-frontend-workspace-v2's auth.interceptor.ts:
 *   1. Adds withCredentials so the SSO cookie travels.
 *   2. On 401, attempts a single refresh; queues subsequent calls until the refresh resolves.
 *   3. On refresh failure, clears auth state silently — Programs is browsable while logged out.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((err) => {
      if (err?.status !== 401 || isAuthEndpoint(req.url) || isRefreshing) {
        return throwError(() => err);
      }

      isRefreshing = true;
      return from(auth.refresh()).pipe(
        switchMap((ok) => {
          isRefreshing = false;
          if (ok) return next(authReq);
          auth.clear();
          return throwError(() => err);
        }),
        catchError(() => {
          isRefreshing = false;
          auth.clear();
          return of();
        }),
      );
    }),
  );
};

function isAuthEndpoint(url: string): boolean {
  return (
    url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/logout')
  );
}
