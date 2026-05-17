import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GigStoreService, GigJob } from '../services/gig-store.service';

@Component({
  selector: 'mereka-gigs-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gigs-main">
        <!-- Header -->
        <div class="gigs-header">
          <div>
            <h1 class="gigs-title">Manage Gigs</h1>
            <p class="gigs-subtitle">Post jobs, manage applications, and track contracts for your hub</p>
          </div>
          <button class="btn-primary" (click)="showCreateJob.set(true)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Post a Job
          </button>
        </div>

        <!-- Top-level tabs: My Jobs | Applications -->
        <div class="gigs-tabs">
          <button class="gigs-tab" [class.gigs-tab-active]="mainTab() === 'jobs'" (click)="mainTab.set('jobs')">
            My Jobs
            <span class="tab-count" *ngIf="store.jobs().length > 0">{{ store.jobs().length }}</span>
          </button>
          <button class="gigs-tab" [class.gigs-tab-active]="mainTab() === 'applications'" (click)="mainTab.set('applications')">
            Applications
            <span class="tab-count" *ngIf="store.applications().length > 0">{{ store.applications().length }}</span>
          </button>
        </div>

        <!-- ===================== MY JOBS TAB ===================== -->
        <div class="tab-content" *ngIf="mainTab() === 'jobs'">
          <!-- Sub-tabs for job status -->
          <div class="sub-tabs" *ngIf="store.jobs().length > 0">
            <button class="sub-tab" [class.sub-tab-active]="jobFilter() === 'all'" (click)="jobFilter.set('all')">All ({{ store.jobs().length }})</button>
            <button class="sub-tab" [class.sub-tab-active]="jobFilter() === 'open'" (click)="jobFilter.set('open')">Open ({{ store.openJobs().length }})</button>
            <button class="sub-tab" [class.sub-tab-active]="jobFilter() === 'draft'" (click)="jobFilter.set('draft')">Drafts ({{ store.draftJobs().length }})</button>
            <button class="sub-tab" [class.sub-tab-active]="jobFilter() === 'closed'" (click)="jobFilter.set('closed')">Closed ({{ store.closedJobs().length }})</button>
          </div>

          <!-- Job cards -->
          <div class="jobs-list" *ngIf="filteredJobs().length > 0">
            <div *ngFor="let job of filteredJobs()" class="job-card">
              <div class="job-card-body">
                <div class="job-card-left">
                  <div class="job-card-title-row">
                    <h3 class="job-card-title">{{ job.title }}</h3>
                    <span class="status-badge"
                          [class.status-open]="job.status === 'open'"
                          [class.status-draft]="job.status === 'draft'"
                          [class.status-closed]="job.status === 'closed'"
                          [class.status-progress]="job.status === 'in-progress'">
                      {{ job.status === 'in-progress' ? 'In Progress' : (job.status | titlecase) }}
                    </span>
                  </div>
                  <p class="job-card-desc">{{ job.description | slice:0:120 }}{{ job.description.length > 120 ? '...' : '' }}</p>
                  <div class="job-card-meta">
                    <span>{{ job.category }}</span>
                    <span>{{ job.type | titlecase }}</span>
                    <span>{{ job.budget.currency }} {{ job.budget.min | number }}–{{ job.budget.max | number }}</span>
                    <span>{{ job.applicantCount }} applicant{{ job.applicantCount !== 1 ? 's' : '' }}</span>
                    <span>{{ job.location }}</span>
                  </div>
                  <div class="job-card-skills">
                    <span *ngFor="let skill of job.skills" class="skill-tag">{{ skill }}</span>
                  </div>
                </div>
                <div class="job-card-actions">
                  <button class="btn-action" (click)="viewApplications(job)">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M9 3l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    View Applications
                  </button>
                  <button class="btn-action-secondary" *ngIf="job.status === 'open'" (click)="store.updateJobStatus(job.id, 'closed')">Close</button>
                  <button class="btn-action-secondary" *ngIf="job.status === 'draft'" (click)="store.updateJobStatus(job.id, 'open')">Publish</button>
                  <button class="btn-action-secondary" *ngIf="job.status === 'closed'" (click)="store.updateJobStatus(job.id, 'open')">Reopen</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div class="empty-state-card" *ngIf="store.jobs().length === 0">
            <div class="empty-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="5" y="8" width="22" height="16" rx="2" stroke="#BDBDBD" stroke-width="1.5"/>
                <path d="M11 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="#BDBDBD" stroke-width="1.5"/>
                <path d="M5 14h22" stroke="#BDBDBD" stroke-width="1.5"/>
                <circle cx="16" cy="14" r="2" fill="#BDBDBD"/>
              </svg>
            </div>
            <h3 class="empty-title">No Jobs Posted Yet</h3>
            <p class="empty-text">Post your first job to start receiving applications from talented freelancers.</p>
            <button class="btn-primary" (click)="showCreateJob.set(true)">Post your first job</button>
          </div>
        </div>

        <!-- ===================== APPLICATIONS TAB ===================== -->
        <div class="tab-content" *ngIf="mainTab() === 'applications'">
          <div class="sub-tabs">
            <button class="sub-tab" [class.sub-tab-active]="appFilter() === 'contracted'" (click)="appFilter.set('contracted')">Contracted</button>
            <button class="sub-tab" [class.sub-tab-active]="appFilter() === 'proposed'" (click)="appFilter.set('proposed')">Proposed</button>
          </div>

          <!-- Contracted -->
          <div *ngIf="appFilter() === 'contracted'">
            <div class="applications-list" *ngIf="store.contractedApplications().length > 0">
              <div *ngFor="let app of store.contractedApplications()" class="app-card">
                <div class="app-card-left">
                  <div class="app-avatar">{{ app.freelancerName.charAt(0) }}</div>
                  <div>
                    <div class="app-name">{{ app.freelancerName }}</div>
                    <div class="app-job">{{ app.jobTitle }}</div>
                    <div class="app-rate">{{ app.currency }} {{ app.proposedRate | number }} · Contracted</div>
                  </div>
                </div>
                <button class="btn-action-secondary">View Details</button>
              </div>
            </div>
            <div class="empty-state-card" *ngIf="store.contractedApplications().length === 0">
              <div class="empty-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="5" y="8" width="22" height="16" rx="2" stroke="#BDBDBD" stroke-width="1.5"/>
                  <path d="M11 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="#BDBDBD" stroke-width="1.5"/>
                  <path d="M5 14h22" stroke="#BDBDBD" stroke-width="1.5"/>
                  <circle cx="16" cy="14" r="2" fill="#BDBDBD"/>
                </svg>
              </div>
              <h3 class="empty-title">No Active Contracts</h3>
              <p class="empty-text">Accept an applicant's proposal to create a contract.</p>
            </div>
          </div>

          <!-- Proposed -->
          <div *ngIf="appFilter() === 'proposed'">
            <div class="applications-list" *ngIf="store.pendingApplications().length > 0">
              <div *ngFor="let app of store.pendingApplications()" class="app-card">
                <div class="app-card-left">
                  <div class="app-avatar">{{ app.freelancerName.charAt(0) }}</div>
                  <div>
                    <div class="app-name">{{ app.freelancerName }}</div>
                    <div class="app-job">{{ app.jobTitle }}</div>
                    <div class="app-rate">{{ app.currency }} {{ app.proposedRate | number }}</div>
                    <p class="app-cover">{{ app.coverLetter | slice:0:100 }}{{ app.coverLetter.length > 100 ? '...' : '' }}</p>
                  </div>
                </div>
                <div class="app-card-actions">
                  <button class="btn-accept" (click)="store.updateApplicationStatus(app.id, 'contracted')">Accept</button>
                  <button class="btn-action-secondary" (click)="store.updateApplicationStatus(app.id, 'rejected')">Decline</button>
                </div>
              </div>
            </div>
            <div class="empty-state-card" *ngIf="store.pendingApplications().length === 0">
              <div class="empty-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="7" y="4" width="18" height="24" rx="2" stroke="#BDBDBD" stroke-width="1.5"/>
                  <path d="M12 10h8M12 14h8M12 18h5" stroke="#BDBDBD" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </div>
              <h3 class="empty-title">No Pending Proposals</h3>
              <p class="empty-text">Post a job to start receiving proposals from freelancers.</p>
              <button class="btn-primary" (click)="showCreateJob.set(true)">Post a Job</button>
            </div>
          </div>
        </div>
    </div>

    <!-- ===================== CREATE JOB MODAL ===================== -->
    <div class="modal-backdrop" *ngIf="showCreateJob()" (click)="showCreateJob.set(false)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Post a New Job</h2>
          <button class="modal-close" (click)="showCreateJob.set(false)">&times;</button>
        </div>
        <div class="modal-body">
          <label class="field">
            <span class="field-label">Job Title *</span>
            <input class="field-input" [(ngModel)]="newJob.title" placeholder="e.g. Frontend Developer for Tourism Platform" />
          </label>
          <label class="field">
            <span class="field-label">Description *</span>
            <textarea class="field-input field-textarea" [(ngModel)]="newJob.description" placeholder="Describe the job responsibilities, requirements, and deliverables..."></textarea>
          </label>
          <div class="field-row">
            <label class="field">
              <span class="field-label">Category</span>
              <select class="field-input" [(ngModel)]="newJob.category">
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Content">Content</option>
                <option value="Consulting">Consulting</option>
                <option value="Operations">Operations</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label class="field">
              <span class="field-label">Work Type</span>
              <select class="field-input" [(ngModel)]="newJob.type">
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </label>
          </div>
          <div class="field-row">
            <label class="field">
              <span class="field-label">Budget Min (MYR)</span>
              <input type="number" class="field-input" [(ngModel)]="newJob.budgetMin" placeholder="500" />
            </label>
            <label class="field">
              <span class="field-label">Budget Max (MYR)</span>
              <input type="number" class="field-input" [(ngModel)]="newJob.budgetMax" placeholder="5000" />
            </label>
          </div>
          <label class="field">
            <span class="field-label">Location</span>
            <input class="field-input" [(ngModel)]="newJob.location" placeholder="e.g. Kuala Lumpur, Malaysia" />
          </label>
          <label class="field">
            <span class="field-label">Skills (comma separated)</span>
            <input class="field-input" [(ngModel)]="newJob.skills" placeholder="e.g. Angular, TypeScript, UI/UX" />
          </label>
          <label class="field">
            <span class="field-label">Application Deadline</span>
            <input type="date" class="field-input" [(ngModel)]="newJob.deadline" />
          </label>
        </div>
        <div class="modal-footer">
          <button class="btn-action-secondary" (click)="createJob('draft')">Save as Draft</button>
          <button class="btn-primary" (click)="createJob('open')" [disabled]="!newJob.title || !newJob.description">Publish Job</button>
        </div>
      </div>
    </div>

    <style>
      /* layout provided by shell */
      .gigs-main { padding: 0; max-width: 1100px; }

      .gigs-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
      .gigs-title { font-size: 26px; font-weight: 700; color: #1B1F3B; margin: 0; }
      .gigs-subtitle { font-size: 14px; color: #888; margin: 4px 0 0; }

      .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px; border: none; border-radius: 24px; background: #1B1F3B; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; }
      .btn-primary:hover { background: #2d3258; }
      .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

      /* Tabs */
      .gigs-tabs { display: flex; gap: 0; border-bottom: 2px solid #E5E5E5; margin-bottom: 0; }
      .gigs-tab { display: flex; align-items: center; gap: 6px; padding: 12px 20px; border: none; background: transparent; font-size: 15px; font-weight: 500; color: #888; cursor: pointer; position: relative; }
      .gigs-tab-active { color: #1B1F3B; font-weight: 600; }
      .gigs-tab-active::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2px; background: #1B1F3B; border-radius: 2px 2px 0 0; }
      .tab-count { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px; background: #E8EAF6; color: #3949AB; }

      .sub-tabs { display: flex; gap: 8px; padding: 16px 0; }
      .sub-tab { padding: 6px 16px; border: 1px solid #E0E0E0; border-radius: 20px; background: #fff; font-size: 13px; font-weight: 500; color: #666; cursor: pointer; }
      .sub-tab-active { background: #1B1F3B; color: #fff; border-color: #1B1F3B; }

      .tab-content { padding: 0; }

      /* Job cards */
      .jobs-list { display: flex; flex-direction: column; gap: 12px; margin-top: 4px; }
      .job-card { background: #fff; border: 1px solid #ECECEE; border-radius: 12px; padding: 24px; transition: box-shadow 0.15s; }
      .job-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
      .job-card-body { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
      .job-card-left { flex: 1; }
      .job-card-title-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap; }
      .job-card-title { font-size: 17px; font-weight: 700; color: #1B1F3B; margin: 0; }
      .job-card-desc { font-size: 14px; color: #666; margin: 0 0 10px; line-height: 1.5; }
      .job-card-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: #999; margin-bottom: 8px; }
      .job-card-meta span { display: flex; align-items: center; gap: 4px; }
      .job-card-skills { display: flex; flex-wrap: wrap; gap: 6px; }
      .skill-tag { font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 12px; background: #F0F0F2; color: #555; }
      .job-card-actions { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }

      .status-badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 12px; }
      .status-open { background: #E8F5E9; color: #2E7D32; }
      .status-draft { background: #FFF8E1; color: #F57F17; }
      .status-closed { background: #F5F5F5; color: #757575; }
      .status-progress { background: #E3F2FD; color: #1565C0; }

      .btn-action { display: flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 20px; font-size: 13px; font-weight: 600; text-decoration: none; border: 1px solid #1B1F3B; color: #1B1F3B; background: #fff; cursor: pointer; white-space: nowrap; }
      .btn-action:hover { background: #F6F6F8; }
      .btn-action-secondary { padding: 8px 18px; border-radius: 20px; font-size: 13px; font-weight: 600; border: 1px solid #E0E0E0; color: #666; background: #fff; cursor: pointer; white-space: nowrap; }
      .btn-action-secondary:hover { background: #F6F6F8; }
      .btn-accept { padding: 8px 18px; border-radius: 20px; font-size: 13px; font-weight: 600; border: none; background: #2E7D32; color: #fff; cursor: pointer; }
      .btn-accept:hover { background: #1B5E20; }

      /* Application cards */
      .applications-list { display: flex; flex-direction: column; gap: 12px; }
      .app-card { display: flex; justify-content: space-between; align-items: center; background: #fff; border: 1px solid #ECECEE; border-radius: 12px; padding: 20px 24px; }
      .app-card-left { display: flex; align-items: flex-start; gap: 14px; flex: 1; }
      .app-avatar { width: 40px; height: 40px; border-radius: 50%; background: #E8EAF6; color: #3949AB; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0; }
      .app-name { font-size: 15px; font-weight: 600; color: #1B1F3B; }
      .app-job { font-size: 13px; color: #888; }
      .app-rate { font-size: 13px; color: #555; font-weight: 500; margin-top: 2px; }
      .app-cover { font-size: 13px; color: #888; margin: 4px 0 0; line-height: 1.4; }
      .app-card-actions { display: flex; gap: 8px; flex-shrink: 0; }

      /* Empty state */
      .empty-state-card { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 40px; border: 1px solid #ECECEE; border-radius: 12px; background: #fff; text-align: center; margin-top: 12px; }
      .empty-icon { width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; background: #F5F5F5; border-radius: 50%; margin-bottom: 20px; }
      .empty-title { font-size: 18px; font-weight: 700; color: #1B1F3B; margin: 0 0 8px; }
      .empty-text { font-size: 14px; color: #888; margin: 0 0 24px; max-width: 400px; line-height: 1.5; }

      /* Modal */
      .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: center; justify-content: center; }
      .modal-content { background: #fff; border-radius: 16px; width: 90%; max-width: 640px; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
      .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 24px 28px 0; }
      .modal-title { font-size: 20px; font-weight: 700; color: #1B1F3B; margin: 0; }
      .modal-close { background: none; border: none; font-size: 28px; color: #999; cursor: pointer; line-height: 1; }
      .modal-body { padding: 20px 28px; display: flex; flex-direction: column; gap: 16px; }
      .modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 28px 24px; }

      .field { display: flex; flex-direction: column; gap: 4px; flex: 1; }
      .field-label { font-size: 13px; font-weight: 600; color: #555; }
      .field-input { padding: 10px 14px; border: 1px solid #E0E0E0; border-radius: 8px; font-size: 14px; color: #333; outline: none; }
      .field-input:focus { border-color: #1B1F3B; }
      .field-textarea { min-height: 100px; resize: vertical; }
      .field-row { display: flex; gap: 12px; }
    </style>
  `,
})
export class GigsApplicationsPage {
  readonly store = inject(GigStoreService);
  readonly mainTab = signal<'jobs' | 'applications'>('jobs');
  readonly jobFilter = signal<'all' | 'open' | 'draft' | 'closed'>('all');
  readonly appFilter = signal<'contracted' | 'proposed'>('contracted');
  readonly showCreateJob = signal(false);

  readonly filteredJobs = signal<GigJob[]>([]);

  newJob = {
    title: '',
    description: '',
    category: 'Development',
    type: 'remote' as const,
    budgetMin: 500,
    budgetMax: 5000,
    location: 'Kuala Lumpur, Malaysia',
    skills: '',
    deadline: '',
  };

  constructor() {
    // Use effect-like pattern — recalculate filtered jobs on signal changes
    // Since we can't use effect in constructor easily, we use computed via a getter pattern
  }

  ngDoCheck(): void {
    const filter = this.jobFilter();
    const all = this.store.jobs();
    let filtered: GigJob[];
    if (filter === 'all') filtered = all;
    else if (filter === 'open') filtered = this.store.openJobs();
    else if (filter === 'draft') filtered = this.store.draftJobs();
    else filtered = this.store.closedJobs();
    this.filteredJobs.set(filtered);
  }

  createJob(status: 'open' | 'draft'): void {
    if (!this.newJob.title || !this.newJob.description) return;
    this.store.createJob({
      title: this.newJob.title,
      description: this.newJob.description,
      category: this.newJob.category,
      budget: { min: this.newJob.budgetMin, max: this.newJob.budgetMax, currency: 'MYR' },
      location: this.newJob.location,
      type: this.newJob.type,
      status,
      skills: this.newJob.skills.split(',').map(s => s.trim()).filter(Boolean),
      deadline: this.newJob.deadline || null,
    });
    this.showCreateJob.set(false);
    this.resetNewJob();
  }

  viewApplications(job: GigJob): void {
    this.mainTab.set('applications');
  }

  private resetNewJob(): void {
    this.newJob = {
      title: '', description: '', category: 'Development', type: 'remote',
      budgetMin: 500, budgetMax: 5000, location: 'Kuala Lumpur, Malaysia', skills: '', deadline: '',
    };
  }
}
