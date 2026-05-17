import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mereka-listing-new',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-6">
      <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <a routerLink="/dashboard/listings" class="text-xs font-bold uppercase tracking-wider" style="color:#7B7B7B">← Manage Listings</a>
          <h1 class="text-[28px] sm:text-[32px] font-black leading-tight" style="color:#1A1623">Post a Listing</h1>
          <p class="text-sm mt-1" style="color:#7B7B7B">Choose what kind of listing you'd like to publish to your hub.</p>
        </div>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a *ngFor="let k of kinds" [routerLink]="k.link" class="rounded-xl bg-white p-5 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer" style="outline:1px solid #DDDDDE;outline-offset:-1px">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" [style.background]="k.bg">{{ k.icon }}</div>
          <h3 class="text-lg font-bold" style="color:#1A1623">{{ k.label }}</h3>
          <p class="text-xs" style="color:#7B7B7B">{{ k.desc }}</p>
          <span class="text-xs font-bold mt-auto" style="color:#276EF1">Start →</span>
        </a>
      </div>
    </div>
  `,
})
export class ListingNewPage {
  kinds = [
    { icon: '📚', label: 'Programme',   desc: 'Multi-week guided journey with cohorts and certificates.',     bg: '#EFE5F8', link: ['/programs', 'admin', 'new']     },
    { icon: '🎓', label: 'Course',      desc: 'Self-paced or instructor-led learning.',                       bg: '#E4F2FF', link: ['/dashboard', 'listings', 'new'] },
    { icon: '✨', label: 'Experience',  desc: 'Workshops, bootcamps, in-person events.',                      bg: '#FFE7F0', link: ['/dashboard', 'listings', 'new'] },
    { icon: '🤝', label: 'Expertise',   desc: '1:1 or group mentoring slots.',                                bg: '#E0F7EE', link: ['/dashboard', 'listings', 'new'] },
  ];
}
