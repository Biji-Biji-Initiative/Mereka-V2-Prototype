import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';

/**
 * Mirrors the AuthUser contract used by mereka-frontend-workspace-v2/projects/web/.../auth.service.ts.
 * The backend returns it from GET /auth/me when the cross-domain SSO cookie is valid.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  profilePhoto?: string;
  authProviders: string[];
  hubs?: AuthHub[];
}

export interface AuthHub {
  hubId: string;
  hubName: string;
  hubLogo: string | null;
  /** Programs feature: this user's role in the hub for collaborative programs */
  hubRole?: 'admin' | 'editor' | 'viewer';
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private static readonly STORAGE_KEY = 'mereka_prototype_user';

  private readonly _user = signal<AuthUser | null>(null);
  private readonly _hubs = signal<AuthHub[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _isInitialized = signal(false);

  readonly user = this._user.asReadonly();
  readonly hubs = this._hubs.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isInitialized = this._isInitialized.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);

  constructor() {
    // Restore prototype user from localStorage on startup
    this.restorePrototypeUser();
  }

  /** Restore prototype user from localStorage (survives page refresh / SPA navigation). */
  private restorePrototypeUser(): void {
    try {
      const stored = localStorage.getItem(AuthService.STORAGE_KEY);
      if (stored) {
        const user: AuthUser = JSON.parse(stored);
        this._user.set(user);
        if (user.hubs) this._hubs.set(user.hubs);
        this._isInitialized.set(true);
      }
    } catch {
      localStorage.removeItem(AuthService.STORAGE_KEY);
    }
  }

  /** Returns the auth app URL with `redirect` set so the user lands back on the current page. */
  loginUrl(redirectTo: string = typeof window !== 'undefined' ? window.location.href : '/'): string {
    const url = new URL('/login', environment.appUrls.auth);
    url.searchParams.set('redirect', redirectTo);
    return url.toString();
  }

  async init(includeHubs = true): Promise<void> {
    if (this._isInitialized()) return;
    this._isLoading.set(true);
    try {
      const user = await this.getMe(includeHubs);
      this._user.set(user);
      if (user?.hubs) this._hubs.set(user.hubs);
    } catch {
      this._user.set(null);
      this._hubs.set([]);
    } finally {
      this._isLoading.set(false);
      this._isInitialized.set(true);
    }
  }

  async getMe(includeHubs = false): Promise<AuthUser | null> {
    const url = includeHubs
      ? `${environment.apiUrl}/auth/me?includeHubs=true`
      : `${environment.apiUrl}/auth/me`;
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<AuthUser>>(url, { withCredentials: true }),
      );
      return response.success && response.data ? response.data : null;
    } catch {
      return null;
    }
  }

  async refresh(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<ApiResponse<unknown>>(
          `${environment.apiUrl}/auth/refresh`,
          {},
          { withCredentials: true },
        ),
      );
      return response.success;
    } catch {
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }),
      );
    } finally {
      this.clear();
    }
  }

  clear(): void {
    this._user.set(null);
    this._hubs.set([]);
    try { localStorage.removeItem(AuthService.STORAGE_KEY); } catch {}
  }

  /**
   * Prototype-only: set user directly without hitting the backend.
   * Used by the demo login flow. Persists to localStorage so the
   * session survives page refresh and SPA sub-navigation.
   */
  setPrototypeUser(user: AuthUser): void {
    this._user.set(user);
    if (user.hubs) this._hubs.set(user.hubs);
    this._isLoading.set(false);
    this._isInitialized.set(true);
    try { localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(user)); } catch {}
  }
}
