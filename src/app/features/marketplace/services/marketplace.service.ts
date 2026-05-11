import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type {
  Experience, Expertise, Gig, GigApplicant, HubProfile, Order,
  PaginatedResponse, CartItem,
} from '../models/marketplace.model';

interface ApiResponse<T> { success: boolean; data?: T; error?: { code: string; message: string }; }

@Injectable({ providedIn: 'root' })
export class MarketplaceService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  /* Experiences */
  listExperiences(q: { search?: string; mode?: 'physical' | 'virtual' | 'hybrid' } = {}) {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(q)) if (v) params = params.set(k, String(v));
    return this.http.get<ApiResponse<PaginatedResponse<Experience>>>(`${this.base}/experiences`, { params }).pipe(map(unwrap));
  }
  experienceBySlug(slug: string) {
    return this.http.get<ApiResponse<Experience>>(`${this.base}/experiences/${slug}`).pipe(map(unwrap));
  }
  myExperiences() {
    return this.http.get<ApiResponse<Experience[]>>(`${this.base}/me/experiences`).pipe(map(unwrap));
  }

  /* Expertise */
  listExpertise(q: { search?: string } = {}) {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(q)) if (v) params = params.set(k, String(v));
    return this.http.get<ApiResponse<PaginatedResponse<Expertise>>>(`${this.base}/expertise`, { params }).pipe(map(unwrap));
  }
  expertiseBySlug(slug: string) {
    return this.http.get<ApiResponse<Expertise>>(`${this.base}/expertise/${slug}`).pipe(map(unwrap));
  }
  myExpertise() {
    return this.http.get<ApiResponse<Expertise[]>>(`${this.base}/me/expertise`).pipe(map(unwrap));
  }

  /* Gigs */
  listGigs(q: { search?: string; engagement?: string } = {}) {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(q)) if (v) params = params.set(k, String(v));
    return this.http.get<ApiResponse<PaginatedResponse<Gig>>>(`${this.base}/gigs`, { params }).pipe(map(unwrap));
  }
  gigBySlug(slug: string) {
    return this.http.get<ApiResponse<Gig>>(`${this.base}/gigs/${slug}`).pipe(map(unwrap));
  }
  gigApplicants(slug: string) {
    return this.http.get<ApiResponse<GigApplicant[]>>(`${this.base}/gigs/${slug}/applicants`).pipe(map(unwrap));
  }
  myGigs() {
    return this.http.get<ApiResponse<Gig[]>>(`${this.base}/me/gigs`).pipe(map(unwrap));
  }

  /* Hubs */
  listHubs() {
    return this.http.get<ApiResponse<PaginatedResponse<HubProfile>>>(`${this.base}/hubs`).pipe(map(unwrap));
  }
  hubBySlug(slug: string) {
    return this.http.get<ApiResponse<HubProfile>>(`${this.base}/hubs/${slug}`).pipe(map(unwrap));
  }

  /* Orders & checkout */
  myOrders() {
    return this.http.get<ApiResponse<Order[]>>(`${this.base}/me/orders`).pipe(map(unwrap));
  }
  createIntent() {
    return this.http.post<ApiResponse<{ clientSecret: string }>>(`${this.base}/checkout/intent`, {}).pipe(map(unwrap));
  }
  confirmOrder(payload: { items: CartItem[]; total: number; currency: string }) {
    return this.http.post<ApiResponse<Order>>(`${this.base}/checkout/confirm`, payload).pipe(map(unwrap));
  }
}

function unwrap<T>(r: ApiResponse<T>): T {
  if (!r.success || r.data === undefined) throw new Error(r.error?.message ?? 'API call failed');
  return r.data;
}
