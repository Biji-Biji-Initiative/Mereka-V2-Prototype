import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProgramFacadeService } from '../../../programs/services/program-facade.service';
import { HubFilterService } from '../../../../core/services/hub-filter.service';

@Component({
  selector: 'mereka-manage-programs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="programs-main">
        <div class="programs-header">
          <div>
            <h1 class="programs-title">Manage Programs</h1>
            <p class="programs-subtitle">Create and manage learning programs for your hub</p>
          </div>
          <a routerLink="/programs/new" class="btn-create">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Create Program
          </a>
        </div>

        <!-- Filter tabs -->
        <div class="filter-tabs" *ngIf="store.myPrograms().length > 0">
          <button class="filter-tab" [class.filter-tab-active]="statusFilter() === 'all'" (click)="statusFilter.set('all')">
            All ({{ store.myPrograms().length }})
          </button>
          <button class="filter-tab" [class.filter-tab-active]="statusFilter() === 'published'" (click)="statusFilter.set('published')">
            Published ({{ publishedCount() }})
          </button>
          <button class="filter-tab" [class.filter-tab-active]="statusFilter() === 'draft'" (click)="statusFilter.set('draft')">
            Draft ({{ draftCount() }})
          </button>
          <button class="filter-tab" [class.filter-tab-active]="statusFilter() === 'archived'" (click)="statusFilter.set('archived')">
            Archived ({{ archivedCount() }})
          </button>
        </div>

        <!-- Program cards -->
        <div class="programs-list" *ngIf="filteredPrograms().length > 0">
          <div *ngFor="let program of filteredPrograms()" class="program-card">
            <!-- Cover image / placeholder -->
            <div class="program-cover">
              <img *ngIf="program.coverImageUrl" [src]="program.coverImageUrl" alt="" class="cover-img" />
              <div *ngIf="!program.coverImageUrl" class="cover-placeholder">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="3" y="5" width="22" height="18" rx="2" stroke="#BDBDBD" stroke-width="1.5"/>
                  <path d="M3 17l6-5 4 3 5-4 7 6" stroke="#BDBDBD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="cover-status"
                    [class.cover-status-published]="program.status === 'published'"
                    [class.cover-status-draft]="program.status === 'draft'"
                    [class.cover-status-archived]="program.status === 'archived'">
                {{ program.status === 'published' ? 'Published' : program.status === 'draft' ? 'Draft' : 'Archived' }}
              </span>
            </div>

            <div class="program-card-body">
              <!-- Title and hub -->
              <div class="program-card-header">
                <h3 class="program-card-title">{{ program.title }}</h3>
                <span class="multi-hub-badge" *ngIf="program.collaborators.length > 0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="4" cy="4" r="3" stroke="currentColor" stroke-width="1"/><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1"/></svg>
                  {{ program.collaborators.length + 1 }} Hubs
                </span>
              </div>
              <p class="program-card-tagline">{{ program.tagline }}</p>

              <!-- Stats row -->
              <div class="program-stats">
                <div class="stat-item">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 7a3 3 0 100-6 3 3 0 000 6zM1 13a6 6 0 0112 0" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                  <span>{{ program.stats.memberCount }} member{{ program.stats.memberCount !== 1 ? 's' : '' }}</span>
                </div>
                <div class="stat-item">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M1 5.5h12" stroke="currentColor" stroke-width="1.2"/></svg>
                  <span>{{ program.curriculum.length }} item{{ program.curriculum.length !== 1 ? 's' : '' }}</span>
                </div>
                <div class="stat-item">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.2"/><path d="M5 7l2 2 3-4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <span>{{ program.pricing.kind === 'free' ? 'Free' : 'Paid' }}</span>
                </div>
              </div>

              <!-- Hub info -->
              <div class="program-hub">
                <div class="hub-avatar">{{ program.ownerHub.hubName.charAt(0) }}</div>
                <span class="hub-name">{{ program.ownerHub.hubName }}</span>
              </div>

              <!-- Actions -->
              <div class="program-card-actions">
                <a [routerLink]="['/programs', program.slug, 'edit']" class="btn-manage">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10l6-6 2 2-6 6H2v-2z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 4l2-2 2 2-2 2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Edit
                </a>
                <a [routerLink]="['/dashboard/programs', program.slug]" class="btn-view">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7s2.5-5 6-5 6 5 6 5-2.5 5-6 5S1 7 1 7z" stroke="currentColor" stroke-width="1.2"/><circle cx="7" cy="7" r="2" stroke="currentColor" stroke-width="1.2"/></svg>
                  Manage
                </a>
                <div class="action-menu">
                  <button class="btn-more" (click)="toggleMenu(program.id)">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="3" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="11" r="1" fill="currentColor"/></svg>
                  </button>
                  <div class="menu-dropdown" *ngIf="activeMenu() === program.id">
                    <a [routerLink]="['/programs', program.slug, 'feed']" class="menu-link">View Community</a>
                    <button (click)="changeStatus(program.slug, 'draft')" *ngIf="program.status === 'published'">Unpublish</button>
                    <button (click)="changeStatus(program.slug, 'published')" *ngIf="program.status === 'draft'">Publish</button>
                    <button (click)="changeStatus(program.slug, 'archived')" *ngIf="program.status !== 'archived'">Archive</button>
                    <button (click)="confirmDelete(program.slug, program.title)" class="menu-danger">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div class="empty-card" *ngIf="store.myPrograms().length === 0">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="6" y="10" width="36" height="28" rx="3" stroke="#BDBDBD" stroke-width="1.5"/>
              <path d="M6 18h36" stroke="#BDBDBD" stroke-width="1.5"/>
              <path d="M15 26h18M15 32h12" stroke="#BDBDBD" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="38" cy="38" r="8" fill="#1B1F3B"/>
              <path d="M38 34v8M34 38h8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="empty-title">No Programs Yet</h3>
          <p class="empty-text">Create your first program to get started with cohorts, curriculum, and certificates. Build learning journeys by combining courses, experiences, and expertise.</p>
          <a routerLink="/programs/new" class="btn-create-lg">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
            Create your first program
          </a>
        </div>
    </div>

    <style>
      .programs-main { padding: 0; max-width: 1100px; }

      .programs-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
      .programs-title { font-size: 26px; font-weight: 700; color: #1B1F3B; margin: 0; }
      .programs-subtitle { font-size: 14px; color: #888; margin: 4px 0 0; }

      .btn-create { display: flex; align-items: center; gap: 8px; padding: 10px 22px; border-radius: 24px; background: #1B1F3B; color: #fff; font-size: 14px; font-weight: 600; text-decoration: none; white-space: nowrap; }
      .btn-create:hover { background: #2d3258; }

      /* Filter tabs */
      .filter-tabs { display: flex; gap: 8px; margin-bottom: 20px; }
      .filter-tab { padding: 6px 16px; border: 1px solid #E0E0E0; border-radius: 20px; background: #fff; font-size: 13px; font-weight: 500; color: #666; cursor: pointer; }
      .filter-tab-active { background: #1B1F3B; color: #fff; border-color: #1B1F3B; }

      /* Program cards - card layout */
      .programs-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
      .program-card { background: #fff; border: 1px solid #ECECEE; border-radius: 14px; overflow: hidden; transition: box-shadow 0.15s; display: flex; flex-direction: column; }
      .program-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

      .program-cover { position: relative; height: 140px; background: #F0F0F2; overflow: hidden; }
      .cover-img { width: 100%; height: 100%; object-fit: cover; }
      .cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #E8EAF6 0%, #F5F5F5 100%); }
      .cover-status { position: absolute; top: 12px; right: 12px; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 12px; }
      .cover-status-published { background: #E8F5E9; color: #2E7D32; }
      .cover-status-draft { background: #FFF8E1; color: #F57F17; }
      .cover-status-archived { background: rgba(0,0,0,0.5); color: #fff; }

      .program-card-body { padding: 18px 20px 20px; display: flex; flex-direction: column; flex: 1; }
      .program-card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
      .program-card-title { font-size: 16px; font-weight: 700; color: #1B1F3B; margin: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .multi-hub-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px; background: #E8EAF6; color: #3949AB; white-space: nowrap; flex-shrink: 0; }
      .program-card-tagline { font-size: 13px; color: #888; margin: 0 0 14px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

      .program-stats { display: flex; gap: 16px; margin-bottom: 12px; }
      .stat-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #777; }
      .stat-item svg { color: #999; }

      .program-hub { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
      .hub-avatar { width: 24px; height: 24px; border-radius: 6px; background: #E5E5E7; color: #555; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
      .hub-name { font-size: 12px; color: #888; }

      .program-card-actions { display: flex; gap: 8px; align-items: center; margin-top: auto; padding-top: 14px; border-top: 1px solid #F0F0F2; }
      .btn-manage, .btn-view { display: inline-flex; align-items: center; gap: 5px; padding: 7px 16px; border-radius: 18px; font-size: 12px; font-weight: 600; text-decoration: none; border: 1px solid #E0E0E0; color: #1B1F3B; background: #fff; cursor: pointer; }
      .btn-manage:hover, .btn-view:hover { background: #F6F6F8; }
      .action-menu { position: relative; margin-left: auto; }
      .btn-more { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #E0E0E0; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #999; }
      .btn-more:hover { background: #F6F6F8; }
      .menu-dropdown { position: absolute; right: 0; top: 36px; background: #fff; border: 1px solid #E5E5E5; border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); z-index: 10; min-width: 140px; overflow: hidden; }
      .menu-dropdown button { display: block; width: 100%; padding: 10px 16px; border: none; background: none; text-align: left; font-size: 13px; color: #333; cursor: pointer; }
      .menu-dropdown button:hover { background: #F6F6F8; }
      .menu-link { display: block; width: 100%; padding: 10px 16px; text-decoration: none; font-size: 13px; color: #333; }
      .menu-link:hover { background: #F6F6F8; }
      .menu-danger { color: #D32F2F !important; }
      .menu-danger:hover { background: #FFF0F0 !important; }

      /* Empty state */
      .empty-card { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 40px; border: 1px solid #ECECEE; border-radius: 14px; background: #fff; text-align: center; }
      .empty-icon { margin-bottom: 24px; }
      .empty-title { font-size: 20px; font-weight: 700; color: #1B1F3B; margin: 0 0 10px; }
      .empty-text { font-size: 14px; color: #888; margin: 0 0 28px; max-width: 440px; line-height: 1.6; }
      .btn-create-lg { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 24px; background: #1B1F3B; color: #fff; font-size: 14px; font-weight: 600; text-decoration: none; }
      .btn-create-lg:hover { background: #2d3258; }
    </style>
  `,
})
export class ManageProgramsPage {
  readonly store = inject(ProgramFacadeService);
  private readonly hubFilter = inject(HubFilterService);
  readonly statusFilter = signal<'all' | 'published' | 'draft' | 'archived'>('all');
  readonly activeMenu = signal<string | null>(null);

  /** Programs filtered by active hub (owner or collaborator). */
  private readonly hubFilteredPrograms = computed(() => {
    const hubId = this.hubFilter.activeHub();
    return this.store.programsByHub(hubId);
  });

  readonly publishedCount = computed(() => this.hubFilteredPrograms().filter(p => p.status === 'published').length);
  readonly draftCount = computed(() => this.hubFilteredPrograms().filter(p => p.status === 'draft').length);
  readonly archivedCount = computed(() => this.hubFilteredPrograms().filter(p => p.status === 'archived').length);

  readonly filteredPrograms = computed(() => {
    const filter = this.statusFilter();
    const programs = this.hubFilteredPrograms();
    if (filter === 'all') return programs;
    return programs.filter(p => p.status === filter);
  });

  toggleMenu(id: string): void {
    this.activeMenu.update(current => current === id ? null : id);
  }

  changeStatus(slug: string, status: 'published' | 'draft' | 'archived'): void {
    this.store.updateStatus(slug, status);
    this.activeMenu.set(null);
  }

  confirmDelete(slug: string, title: string): void {
    this.activeMenu.set(null);
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      this.store.delete(slug);
    }
  }
}
