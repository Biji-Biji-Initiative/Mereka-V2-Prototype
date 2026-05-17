import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProgramFacadeService } from '../../../programs/services/program-facade.service';
import type { Program, CurriculumItem } from '../../../programs/models/program.model';

type TabKey = 'overview' | 'curriculum' | 'collaborators' | 'settings';

@Component({
  selector: 'mereka-program-detail-manage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="detail-page" *ngIf="program() as p">
      <!-- Header -->
      <div class="detail-header">
        <a routerLink="/dashboard/programs" class="back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Back to Programs
        </a>
        <div class="header-row">
          <div class="header-info">
            <h1 class="detail-title">{{ p.title }}</h1>
            <div class="header-meta">
              <span class="status-badge" [class]="'status-' + p.status">{{ p.status }}</span>
              <span class="hub-label">{{ p.ownerHub.hubName }}</span>
              <span class="collab-count" *ngIf="p.collaborators.length > 0">
                + {{ p.collaborators.length }} collaborator{{ p.collaborators.length > 1 ? 's' : '' }}
              </span>
            </div>
          </div>
          <div class="header-actions" *ngIf="!isFixture()">
            <a [routerLink]="['/programs', p.slug, 'edit']" class="btn-edit">Edit Program</a>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tab-bar">
        <button *ngFor="let tab of tabs" class="tab-btn" [class.tab-active]="activeTab() === tab.key" (click)="activeTab.set(tab.key)">
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content: Overview -->
      <div class="tab-content" *ngIf="activeTab() === 'overview'">
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">{{ p.stats.memberCount }}</span>
            <span class="stat-label">Members</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ p.curriculum.length }}</span>
            <span class="stat-label">Curriculum Items</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ courseCount() }}</span>
            <span class="stat-label">Courses</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ experienceCount() }}</span>
            <span class="stat-label">Experiences</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ expertiseCount() }}</span>
            <span class="stat-label">Expertise</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ p.pricing.kind === 'free' ? 'Free' : 'MYR ' + p.pricing.price }}</span>
            <span class="stat-label">Pricing</span>
          </div>
        </div>

        <div class="info-section">
          <h3>Description</h3>
          <p>{{ p.description }}</p>
        </div>

        <div class="info-section" *ngIf="p.timeline.startsAt">
          <h3>Timeline</h3>
          <div class="timeline-grid">
            <div *ngIf="p.timeline.enrollStart"><strong>Enrol opens:</strong> {{ p.timeline.enrollStart }}</div>
            <div *ngIf="p.timeline.enrollEnd"><strong>Enrol closes:</strong> {{ p.timeline.enrollEnd }}</div>
            <div *ngIf="p.timeline.startsAt"><strong>Starts:</strong> {{ p.timeline.startsAt }}</div>
            <div *ngIf="p.timeline.endsAt"><strong>Ends:</strong> {{ p.timeline.endsAt }}</div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Curriculum -->
      <div class="tab-content" *ngIf="activeTab() === 'curriculum'">
        <div class="curriculum-header">
          <h3>Programme Curriculum</h3>
          <div class="curriculum-filters">
            <button class="filter-chip" [class.filter-active]="curriculumFilter() === 'all'" (click)="curriculumFilter.set('all')">All ({{ p.curriculum.length }})</button>
            <button class="filter-chip" [class.filter-active]="curriculumFilter() === 'course'" (click)="curriculumFilter.set('course')">Courses ({{ courseCount() }})</button>
            <button class="filter-chip" [class.filter-active]="curriculumFilter() === 'experience'" (click)="curriculumFilter.set('experience')">Experiences ({{ experienceCount() }})</button>
            <button class="filter-chip" [class.filter-active]="curriculumFilter() === 'expertise'" (click)="curriculumFilter.set('expertise')">Expertise ({{ expertiseCount() }})</button>
          </div>
        </div>

        <!-- Hub filter for multi-hub programs -->
        <div class="hub-filter-row" *ngIf="curriculumHubs().length > 1">
          <span class="hub-filter-label">Filter by hub:</span>
          <button class="hub-chip" [class.hub-chip-active]="curriculumHubFilter() === 'all'" (click)="curriculumHubFilter.set('all')">All Hubs</button>
          <button *ngFor="let h of curriculumHubs()" class="hub-chip" [class.hub-chip-active]="curriculumHubFilter() === h.id" (click)="curriculumHubFilter.set(h.id)">{{ h.name }}</button>
        </div>

        <div class="curriculum-list">
          <div *ngFor="let item of filteredCurriculum(); let i = index" class="curriculum-item">
            <div class="item-order">{{ i + 1 }}</div>
            <div class="item-type-badge" [class]="'type-' + item.type">{{ item.type }}</div>
            <div class="item-info">
              <span class="item-title">{{ item.title }}</span>
              <span class="item-blurb" *ngIf="item.blurb">{{ item.blurb }}</span>
              <span class="item-hub">{{ item.ownerHub.hubName }}</span>
            </div>
            <div class="item-flags">
              <span class="flag-mandatory" *ngIf="item.isMandatory">Required</span>
              <span class="flag-optional" *ngIf="!item.isMandatory">Optional</span>
            </div>
            <div class="item-actions">
              <a *ngIf="item.type === 'course'" href="https://lms-prototype.mereka.dev/studio" target="_blank" rel="noopener" class="btn-manage-item">
                Manage in Studio
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 9l6-6M5 3h4v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </a>
              <a *ngIf="item.type !== 'course'" routerLink="/dashboard/listings" class="btn-manage-item">
                Manage in Listings
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 9l6-6M5 3h4v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Collaborators -->
      <div class="tab-content" *ngIf="activeTab() === 'collaborators'">
        <div class="collab-section">
          <h3>Owner Hub</h3>
          <div class="collab-card owner-card">
            <div class="collab-avatar">{{ p.ownerHub.hubName.charAt(0) }}</div>
            <div class="collab-info">
              <span class="collab-name">{{ p.ownerHub.hubName }}</span>
              <span class="collab-role">Owner — Full control</span>
            </div>
          </div>
        </div>

        <div class="collab-section" *ngIf="p.collaborators.length > 0">
          <h3>Collaborating Hubs</h3>
          <div *ngFor="let collab of p.collaborators" class="collab-card">
            <div class="collab-avatar">{{ collab.hub.hubName.charAt(0) }}</div>
            <div class="collab-info">
              <span class="collab-name">{{ collab.hub.hubName }}</span>
              <span class="collab-role">{{ collab.role | titlecase }} — {{ roleDescription(collab.role) }}</span>
            </div>
            <span class="collab-since">Since {{ collab.acceptedAt ? (collab.acceptedAt | date:'MMM yyyy') : 'Pending' }}</span>
          </div>
        </div>

        <div class="collab-section" *ngIf="p.collaborators.length === 0">
          <p class="empty-text">No collaborating hubs yet. This is a single-hub programme.</p>
        </div>
      </div>

      <!-- Tab Content: Settings -->
      <div class="tab-content" *ngIf="activeTab() === 'settings'">
        <div class="settings-grid">
          <div class="settings-item">
            <span class="settings-label">Visibility</span>
            <span class="settings-value">{{ p.visibility | titlecase }}</span>
          </div>
          <div class="settings-item">
            <span class="settings-label">Status</span>
            <span class="settings-value">{{ p.status | titlecase }}</span>
          </div>
          <div class="settings-item">
            <span class="settings-label">Pricing Model</span>
            <span class="settings-value">{{ p.pricing.kind === 'free' ? 'Free' : 'Paid — MYR ' + p.pricing.price }}</span>
          </div>
          <div class="settings-item">
            <span class="settings-label">Programme ID</span>
            <span class="settings-value monospace">{{ p.id }}</span>
          </div>
          <div class="settings-item">
            <span class="settings-label">Slug</span>
            <span class="settings-value monospace">{{ p.slug }}</span>
          </div>
        </div>
        <p class="settings-note" *ngIf="isFixture()">This is a system programme and cannot be edited or deleted.</p>
      </div>
    </div>

    <!-- Not found -->
    <div class="not-found" *ngIf="!program()">
      <h2>Programme Not Found</h2>
      <p>The programme you're looking for doesn't exist or has been removed.</p>
      <a routerLink="/dashboard/programs" class="btn-back">Back to Programs</a>
    </div>

    <style>
      .detail-page { max-width: 960px; }
      .back-link { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; color: #666; text-decoration: none; margin-bottom: 16px; }
      .back-link:hover { color: #1B1F3B; }
      .header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
      .detail-title { font-size: 26px; font-weight: 700; color: #1B1F3B; margin: 0 0 8px; }
      .header-meta { display: flex; align-items: center; gap: 10px; }
      .status-badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 12px; text-transform: capitalize; }
      .status-published { background: #E8F5E9; color: #2E7D32; }
      .status-draft { background: #FFF8E1; color: #F57F17; }
      .status-archived { background: #ECEFF1; color: #546E7A; }
      .hub-label { font-size: 13px; color: #555; }
      .collab-count { font-size: 12px; color: #3949AB; background: #E8EAF6; padding: 2px 8px; border-radius: 10px; }
      .btn-edit { padding: 8px 20px; border-radius: 20px; background: #1B1F3B; color: #fff; font-size: 13px; font-weight: 600; text-decoration: none; }
      .btn-edit:hover { background: #2d3258; }

      /* Tabs */
      .tab-bar { display: flex; gap: 0; border-bottom: 1px solid #E5E5E7; margin-bottom: 24px; }
      .tab-btn { padding: 10px 20px; font-size: 13px; font-weight: 500; color: #888; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; }
      .tab-btn:hover { color: #1B1F3B; }
      .tab-active { color: #1B1F3B; border-bottom-color: #1B1F3B; font-weight: 600; }

      /* Stats */
      .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-bottom: 28px; }
      .stat-card { background: #fff; border: 1px solid #ECECEE; border-radius: 10px; padding: 16px; text-align: center; }
      .stat-value { display: block; font-size: 22px; font-weight: 700; color: #1B1F3B; }
      .stat-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }

      /* Info sections */
      .info-section { margin-bottom: 24px; }
      .info-section h3 { font-size: 14px; font-weight: 600; color: #1B1F3B; margin: 0 0 8px; }
      .info-section p { font-size: 14px; color: #555; line-height: 1.6; margin: 0; }
      .timeline-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; color: #555; }

      /* Curriculum */
      .curriculum-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
      .curriculum-header h3 { font-size: 16px; font-weight: 600; color: #1B1F3B; margin: 0; }
      .curriculum-filters { display: flex; gap: 6px; }
      .filter-chip { padding: 5px 12px; border: 1px solid #E0E0E0; border-radius: 16px; font-size: 12px; color: #666; background: #fff; cursor: pointer; }
      .filter-chip:hover { border-color: #999; }
      .filter-active { background: #1B1F3B; color: #fff; border-color: #1B1F3B; }

      .hub-filter-row { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
      .hub-filter-label { font-size: 12px; color: #888; }
      .hub-chip { padding: 4px 12px; border: 1px solid #E0E0E0; border-radius: 14px; font-size: 11px; color: #666; background: #fff; cursor: pointer; }
      .hub-chip:hover { border-color: #999; }
      .hub-chip-active { background: #E8EAF6; color: #3949AB; border-color: #C5CAE9; }

      .curriculum-list { display: flex; flex-direction: column; gap: 8px; }
      .curriculum-item { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid #ECECEE; border-radius: 10px; padding: 14px 16px; }
      .item-order { width: 24px; height: 24px; border-radius: 50%; background: #F0F0F2; color: #888; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .item-type-badge { font-size: 10px; font-weight: 600; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; flex-shrink: 0; }
      .type-course { background: #E3F2FD; color: #1565C0; }
      .type-experience { background: #FFF3E0; color: #E65100; }
      .type-expertise { background: #F3E5F5; color: #7B1FA2; }
      .item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
      .item-title { font-size: 14px; font-weight: 600; color: #1B1F3B; }
      .item-blurb { font-size: 12px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .item-hub { font-size: 11px; color: #999; }
      .item-flags { flex-shrink: 0; }
      .flag-mandatory { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; background: #FCE4EC; color: #C62828; }
      .flag-optional { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px; background: #F5F5F5; color: #888; }
      .item-actions { flex-shrink: 0; }
      .btn-manage-item { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; color: #1565C0; text-decoration: none; padding: 4px 10px; border-radius: 6px; border: 1px solid #E3F2FD; }
      .btn-manage-item:hover { background: #E3F2FD; }

      /* Collaborators */
      .collab-section { margin-bottom: 24px; }
      .collab-section h3 { font-size: 14px; font-weight: 600; color: #1B1F3B; margin: 0 0 12px; }
      .collab-card { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid #ECECEE; border-radius: 10px; padding: 14px 16px; margin-bottom: 8px; }
      .owner-card { border-color: #C8E6C9; background: #F1F8E9; }
      .collab-avatar { width: 36px; height: 36px; border-radius: 8px; background: #E5E5E7; color: #555; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
      .collab-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
      .collab-name { font-size: 14px; font-weight: 600; color: #1B1F3B; }
      .collab-role { font-size: 12px; color: #888; }
      .collab-since { font-size: 11px; color: #999; flex-shrink: 0; }
      .empty-text { font-size: 14px; color: #888; }

      /* Settings */
      .settings-grid { display: flex; flex-direction: column; gap: 12px; }
      .settings-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #fff; border: 1px solid #ECECEE; border-radius: 8px; }
      .settings-label { font-size: 13px; font-weight: 500; color: #555; }
      .settings-value { font-size: 13px; color: #1B1F3B; }
      .monospace { font-family: monospace; font-size: 12px; color: #888; }
      .settings-note { margin-top: 16px; padding: 12px 16px; background: #FFF8E1; border-radius: 8px; font-size: 13px; color: #F57F17; }

      /* Not found */
      .not-found { text-align: center; padding: 80px 20px; }
      .not-found h2 { font-size: 20px; font-weight: 700; color: #1B1F3B; margin: 0 0 8px; }
      .not-found p { font-size: 14px; color: #888; margin: 0 0 20px; }
      .btn-back { padding: 10px 20px; border-radius: 20px; background: #1B1F3B; color: #fff; font-size: 13px; text-decoration: none; }

      @media (max-width: 768px) {
        .header-row { flex-direction: column; gap: 12px; }
        .stats-grid { grid-template-columns: repeat(2, 1fr); }
        .curriculum-item { flex-wrap: wrap; }
        .curriculum-header { flex-direction: column; align-items: flex-start; }
        .timeline-grid { grid-template-columns: 1fr; }
      }
    </style>
  `,
})
export class ProgramDetailManagePage {
  private readonly route = inject(ActivatedRoute);
  private readonly facade = inject(ProgramFacadeService);

  readonly activeTab = signal<TabKey>('overview');
  readonly curriculumFilter = signal<'all' | 'course' | 'experience' | 'expertise'>('all');
  readonly curriculumHubFilter = signal<string>('all');

  readonly tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'curriculum', label: 'Curriculum' },
    { key: 'collaborators', label: 'Collaborators' },
    { key: 'settings', label: 'Settings' },
  ];

  readonly program = computed<Program | undefined>(() => {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    return this.facade.bySlug(slug);
  });

  readonly isFixture = computed(() => {
    const p = this.program();
    return p ? this.facade.isFixture(p.slug) : false;
  });

  readonly courseCount = computed(() => this.program()?.curriculum.filter(c => c.type === 'course').length ?? 0);
  readonly experienceCount = computed(() => this.program()?.curriculum.filter(c => c.type === 'experience').length ?? 0);
  readonly expertiseCount = computed(() => this.program()?.curriculum.filter(c => c.type === 'expertise').length ?? 0);

  /** All unique hubs contributing curriculum items to this program. */
  readonly curriculumHubs = computed(() => {
    const p = this.program();
    if (!p) return [];
    const hubMap = new Map<string, string>();
    for (const item of p.curriculum) {
      hubMap.set(item.ownerHub.hubId, item.ownerHub.hubName);
    }
    return Array.from(hubMap.entries()).map(([id, name]) => ({ id, name }));
  });

  readonly filteredCurriculum = computed<CurriculumItem[]>(() => {
    const p = this.program();
    if (!p) return [];
    let items = p.curriculum;

    // Apply type filter
    const typeFilter = this.curriculumFilter();
    if (typeFilter !== 'all') {
      items = items.filter(c => c.type === typeFilter);
    }

    // Apply hub filter
    const hubFilter = this.curriculumHubFilter();
    if (hubFilter !== 'all') {
      items = items.filter(c => c.ownerHub.hubId === hubFilter);
    }

    return items;
  });

  roleDescription(role: string): string {
    switch (role) {
      case 'admin': return 'Full edit access';
      case 'editor': return 'Can add content & edit curriculum';
      case 'viewer': return 'View-only access';
      default: return '';
    }
  }
}
