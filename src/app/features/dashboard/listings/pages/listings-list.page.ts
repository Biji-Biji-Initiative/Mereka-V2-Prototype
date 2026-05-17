import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'mereka-listings-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-6">
      <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div class="text-xs font-bold uppercase tracking-wider" style="color:#7B7B7B">Hub · Biji-biji Initiative</div>
          <h1 class="text-[28px] sm:text-[32px] font-black leading-tight" style="color:#1A1623">{{ title }}</h1>
          <p class="text-sm mt-1" style="color:#7B7B7B">{{ subtitle }}</p>
        </div>
        <a [routerLink]="ctaLink" class="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full text-sm font-bold text-white" style="background:#1A1623;border:none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          {{ ctaLabel }}
        </a>
      </header>

      <div class="rounded-xl bg-white overflow-hidden" style="outline:1px solid #DDDDDE">
        <div class="hidden md:grid px-5 py-2.5 grid-cols-[1fr_120px_120px_140px_120px] gap-4 text-[11px] font-black uppercase tracking-wider" style="background:rgba(0,0,0,0.04);letter-spacing:0.5px">
          <span>Title</span><span>Type</span><span>Status</span><span>Updated</span><span class="text-center">Actions</span>
        </div>
        <div *ngFor="let r of rows; let i=index" class="px-5 py-4 grid grid-cols-1 md:grid-cols-[1fr_120px_120px_140px_120px] items-center gap-4" [style.background]="i%2===1 ? 'rgba(0,0,0,0.04)' : 'white'">
          <span class="text-sm font-bold" style="color:#1A1623">{{ r.title }}</span>
          <span class="text-xs" style="color:#7B7B7B">{{ r.type }}</span>
          <span class="inline-flex items-center gap-1 text-xs font-bold">
            <span class="w-1.5 h-1.5 rounded-full" [style.background]="r.status === 'Published' ? '#10B981' : '#F59E0B'"></span>
            {{ r.status }}
          </span>
          <span class="text-xs" style="color:#7B7B7B">{{ r.updated }}</span>
          <div class="flex md:justify-end gap-2">
            <button class="text-xs px-3 py-1.5 rounded-full" style="outline:1px solid #1A1623;color:#1A1623;outline-offset:-1px;background:transparent;border:none">Edit</button>
            <button class="text-xs px-3 py-1.5 rounded-full text-white" style="background:#1A1623;border:none">View</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ListingsListPage {
  private readonly route = inject(ActivatedRoute);

  get kind(): 'listings' | 'gigs' | 'programs' {
    const u = this.route.snapshot.url.map(s => s.path).join('/');
    if (u.includes('gigs')) return 'gigs';
    if (u.includes('programs')) return 'programs';
    return 'listings';
  }

  get title(): string {
    return this.kind === 'gigs' ? 'Manage Gigs'
         : this.kind === 'programs' ? 'Manage Programmes'
         : 'Manage Listings';
  }
  get subtitle(): string {
    return this.kind === 'gigs' ? 'Post jobs, review applicants, manage workflows for your hub.'
         : this.kind === 'programs' ? 'Run programmes — cohorts, curriculum, certificates, payments.'
         : 'Experiences, courses, expertise — everything your hub offers to learners.';
  }
  get ctaLabel(): string {
    return this.kind === 'gigs' ? 'Post a gig'
         : this.kind === 'programs' ? 'Create programme'
         : 'New listing';
  }
  get ctaLink(): string[] {
    return this.kind === 'gigs' ? ['/dashboard', 'listings', 'new']
         : this.kind === 'programs' ? ['/programs', 'admin', 'new']
         : ['/dashboard', 'listings', 'new'];
  }

  rows = [
    { title: 'AI4U Programme', type: 'Programme', status: 'Published', updated: '2 days ago' },
    { title: 'Career Accelerator', type: 'Programme', status: 'Published', updated: '1 week ago' },
    { title: 'Bike Sizing Workshop', type: 'Experience', status: 'Draft', updated: '5 hours ago' },
    { title: 'AI Strategy 1:1', type: 'Expertise', status: 'Published', updated: '3 weeks ago' },
  ];
}
