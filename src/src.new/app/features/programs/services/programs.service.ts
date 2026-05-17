import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import type {
  CurriculumItem,
  LearnerProgress,
  PaginatedResponse,
  Program,
  ProgramFilters,
  ProgramMember,
} from '../models/program.model';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

/**
 * Typed client for the Programs API. The endpoint shape follows the
 * mereka-backend-v2 convention (web routes for public reads, hub-scoped
 * routes for admin writes — see docs/programs-api-contract.md).
 *
 * While the backend Programs module is being built, the mock interceptor
 * (mock-handler.ts) intercepts these URLs and returns realistic seed data.
 */
@Injectable({ providedIn: 'root' })
export class ProgramsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/programs`;

  list(filters: ProgramFilters = {}): Observable<PaginatedResponse<Program>> {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    }
    return this.http
      .get<ApiResponse<PaginatedResponse<Program>>>(this.base, { params })
      .pipe(map((r) => unwrap(r)));
  }

  bySlug(slug: string): Observable<Program> {
    return this.http
      .get<ApiResponse<Program>>(`${this.base}/${encodeURIComponent(slug)}`)
      .pipe(map((r) => unwrap(r)));
  }

  curriculum(slug: string): Observable<CurriculumItem[]> {
    return this.http
      .get<ApiResponse<CurriculumItem[]>>(`${this.base}/${encodeURIComponent(slug)}/curriculum`)
      .pipe(map((r) => unwrap(r)));
  }

  members(slug: string): Observable<ProgramMember[]> {
    return this.http
      .get<ApiResponse<ProgramMember[]>>(`${this.base}/${encodeURIComponent(slug)}/members`)
      .pipe(map((r) => unwrap(r)));
  }

  /** Learner-only: returns the caller's progress snapshot for this program. */
  myProgress(slug: string): Observable<LearnerProgress> {
    return this.http
      .get<ApiResponse<LearnerProgress>>(`${this.base}/${encodeURIComponent(slug)}/me/progress`)
      .pipe(map((r) => unwrap(r)));
  }
}

function unwrap<T>(r: ApiResponse<T>): T {
  if (!r.success || r.data === undefined) {
    throw new Error(r.error?.message ?? 'API call failed');
  }
  return r.data;
}
