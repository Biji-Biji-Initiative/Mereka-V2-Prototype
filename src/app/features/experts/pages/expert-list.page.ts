import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EXPERTS, type Expert } from '../experts.fixtures';

@Component({
  selector: 'mereka-expert-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-gradient-to-br from-program-hero-start to-program-hero-end">
      <div class="max-w-[1320px] mx-auto px-6 py-16">
        <p class="uppercase tracking-widest text-xs font-medium text-primary-700">Experts</p>
        <h1 class="mt-3 text-4xl md:text-5xl font-semibold max-w-2xl leading-tight">Practitioners across Southeast Asia, ready to help you ship.</h1>
        <p class="mt-4 text-neutral-700 max-w-xl">Browse experts by skill or hub. Book a session, host them in a program, or hire them for a gig.</p>
        <div class="mt-8 max-w-md">
          <input type="search" [ngModel]="search()" (ngModelChange)="search.set($event)"
                 placeholder="Search by name, skill, or hub…"
                 class="w-full px-4 py-3 rounded-lg bg-white border border-neutral-200 text-sm" />
        </div>
      </div>
    </section>
    <section class="max-w-[1320px] mx-auto px-6 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a *ngFor="let e of filtered(); trackBy: trackById" [routerLink]="['/experts', e.slug]"
           class="block bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition">
          <div class="aspect-[16/6] bg-neutral-100"><img [src]="e.banner" [alt]="e.name" class="w-full h-full object-cover" /></div>
          <div class="p-5">
            <div class="flex items-center gap-3 -mt-12">
              <img [src]="e.avatar" [alt]="e.name" class="w-16 h-16 rounded-full ring-4 ring-white bg-white object-cover" />
            </div>
            <h3 class="font-semibold mt-3">{{ e.name }}</h3>
            <p class="text-sm text-neutral-500 line-clamp-2 mt-1">{{ e.tagline }}</p>
            <ul class="mt-3 flex flex-wrap gap-1.5">
              <li *ngFor="let s of e.skills.slice(0, 3)" class="text-[10px] uppercase tracking-wider bg-neutral-100 text-neutral-600 rounded-full px-2 py-0.5">{{ s }}</li>
            </ul>
            <div class="mt-3 flex items-center justify-between text-xs text-neutral-500">
              <span>★ {{ e.rating.average }} ({{ e.rating.total }})</span>
              <span>{{ e.hubName }}</span>
            </div>
          </div>
        </a>
      </div>
    </section>
  `,
})
export class ExpertListPage {
  readonly search = signal('');
  readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return EXPERTS.filter((e) =>
      !q || (e.name + ' ' + e.tagline + ' ' + e.skills.join(' ') + ' ' + e.hubName).toLowerCase().includes(q));
  });
  trackById(_: number, e: Expert): string { return e.id; }
}
