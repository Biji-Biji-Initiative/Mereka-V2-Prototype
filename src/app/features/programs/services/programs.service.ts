import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type {
  ApplicationForm, CurriculumItem, DashboardSnapshot,
  InboxChannel, InboxThread, LearnerProgress, PaginatedResponse,
  Program, ProgramAnalytics, ProgramFeedback, ProgramFilters, ProgramMember,
} from '../models/program.model';

interface ApiResponse<T> { success: boolean; data?: T; error?: { code: string; message: string }; }

@Injectable({ providedIn: 'root' })
export class ProgramsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/programs`;
  private readonly meBase = `${environment.apiUrl}/me`;

  list(filters: ProgramFilters = {}): Observable<PaginatedResponse<Program>> {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    }
    return this.http.get<ApiResponse<PaginatedResponse<Program>>>(this.base, { params }).pipe(map((r) => unwrap(r)));
  }
  bySlug(slug: string) { return this.http.get<ApiResponse<Program>>(`${this.base}/${encodeURIComponent(slug)}`).pipe(map((r) => unwrap(r))); }
  curriculum(slug: string) { return this.http.get<ApiResponse<CurriculumItem[]>>(`${this.base}/${encodeURIComponent(slug)}/curriculum`).pipe(map((r) => unwrap(r))); }
  members(slug: string) { return this.http.get<ApiResponse<ProgramMember[]>>(`${this.base}/${encodeURIComponent(slug)}/members`).pipe(map((r) => unwrap(r))); }
  myProgress(slug: string) { return this.http.get<ApiResponse<LearnerProgress>>(`${this.base}/${encodeURIComponent(slug)}/me/progress`).pipe(map((r) => unwrap(r))); }
  feedback(slug: string) { return this.http.get<ApiResponse<ProgramFeedback>>(`${this.base}/${encodeURIComponent(slug)}/feedback`).pipe(map((r) => unwrap(r))); }
  analytics(slug: string) { return this.http.get<ApiResponse<ProgramAnalytics>>(`${this.base}/${encodeURIComponent(slug)}/analytics`).pipe(map((r) => unwrap(r))); }
  inboxChannels(slug: string) { return this.http.get<ApiResponse<InboxChannel[]>>(`${this.base}/${encodeURIComponent(slug)}/inbox/channels`).pipe(map((r) => unwrap(r))); }
  inboxThread(slug: string, channelId: string) { return this.http.get<ApiResponse<InboxThread>>(`${this.base}/${encodeURIComponent(slug)}/inbox/threads/${encodeURIComponent(channelId)}`).pipe(map((r) => unwrap(r))); }
  forms(slug: string) { return this.http.get<ApiResponse<ApplicationForm[]>>(`${this.base}/${encodeURIComponent(slug)}/forms`).pipe(map((r) => unwrap(r))); }
  dashboard() { return this.http.get<ApiResponse<DashboardSnapshot>>(`${this.meBase}/dashboard`).pipe(map((r) => unwrap(r))); }
  myPrograms() { return this.http.get<ApiResponse<Program[]>>(`${this.meBase}/programs`).pipe(map((r) => unwrap(r))); }
  hubPrograms() { return this.http.get<ApiResponse<Program[]>>(`${this.meBase}/hubs/programs`).pipe(map((r) => unwrap(r))); }
}

function unwrap<T>(r: ApiResponse<T>): T {
  if (!r.success || r.data === undefined) throw new Error(r.error?.message ?? 'API call failed');
  return r.data;
}
