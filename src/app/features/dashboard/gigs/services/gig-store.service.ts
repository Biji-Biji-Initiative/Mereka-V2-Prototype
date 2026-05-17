import { Injectable, signal, computed } from '@angular/core';

export interface GigJob {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: { min: number; max: number; currency: string };
  location: string;
  type: 'remote' | 'onsite' | 'hybrid';
  status: 'open' | 'in-progress' | 'closed' | 'draft';
  skills: string[];
  applicantCount: number;
  postedAt: string;
  deadline: string | null;
}

export interface GigApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  freelancerName: string;
  freelancerAvatar: string | null;
  coverLetter: string;
  proposedRate: number;
  currency: string;
  status: 'pending' | 'accepted' | 'rejected' | 'contracted';
  appliedAt: string;
}

const JOBS_KEY = 'mereka_gig_jobs';
const APPS_KEY = 'mereka_gig_applications';

@Injectable({ providedIn: 'root' })
export class GigStoreService {
  private readonly _jobs = signal<GigJob[]>(this.load<GigJob[]>(JOBS_KEY, []));
  private readonly _applications = signal<GigApplication[]>(this.load<GigApplication[]>(APPS_KEY, []));

  readonly jobs = this._jobs.asReadonly();
  readonly applications = this._applications.asReadonly();

  readonly openJobs = computed(() => this._jobs().filter(j => j.status === 'open'));
  readonly draftJobs = computed(() => this._jobs().filter(j => j.status === 'draft'));
  readonly closedJobs = computed(() => this._jobs().filter(j => j.status === 'closed' || j.status === 'in-progress'));

  readonly pendingApplications = computed(() => this._applications().filter(a => a.status === 'pending'));
  readonly contractedApplications = computed(() => this._applications().filter(a => a.status === 'contracted'));

  applicationsForJob(jobId: string) {
    return this._applications().filter(a => a.jobId === jobId);
  }

  createJob(job: Omit<GigJob, 'id' | 'applicantCount' | 'postedAt'>): GigJob {
    const created: GigJob = {
      ...job,
      id: `job-${Date.now()}`,
      applicantCount: 0,
      postedAt: new Date().toISOString(),
    };
    this._jobs.update(list => [...list, created]);
    this.save(JOBS_KEY, this._jobs());
    return created;
  }

  updateJobStatus(id: string, status: GigJob['status']): void {
    this._jobs.update(list => list.map(j => j.id === id ? { ...j, status } : j));
    this.save(JOBS_KEY, this._jobs());
  }

  deleteJob(id: string): void {
    this._jobs.update(list => list.filter(j => j.id !== id));
    this._applications.update(list => list.filter(a => a.jobId !== id));
    this.save(JOBS_KEY, this._jobs());
    this.save(APPS_KEY, this._applications());
  }

  updateApplicationStatus(id: string, status: GigApplication['status']): void {
    this._applications.update(list => list.map(a => a.id === id ? { ...a, status } : a));
    this.save(APPS_KEY, this._applications());
  }

  private load<T>(key: string, fallback: T): T {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  }
  private save(key: string, data: unknown): void {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
  }
}
