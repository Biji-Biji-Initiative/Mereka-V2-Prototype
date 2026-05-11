import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import type { Program } from '../../programs/models/program.model';
import { MarketplaceService } from '../../marketplace/services/marketplace.service';
import { ProgramsService } from '../../programs/services/programs.service';

@Component({
  selector: 'mereka-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- HERO -->
    <section class="relative overflow-hidden bg-gradient-to-br from-program-hero-start to-program-hero-end">
      <div class="max-w-[1320px] mx-auto px-6 py-24 grid grid-cols-12 gap-8 items-center">
        <div class="col-span-12 md:col-span-7">
          <p class="uppercase tracking-widest text-xs font-medium text-primary-700">mereka.io v2</p>
          <h1 class="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
            Where ambitious people find programs, gigs, and the people who'll help them ship.
          </h1>
          <p class="mt-5 text-lg text-neutral-700 max-w-xl">
            Mereka brings together the best of Southeast Asia's learning hubs into one place — courses, experiences, expertise, and project work.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-3">
            <a routerLink="/programs" class="px-5 py-3 rounded-full bg-neutral-900 text-white text-sm font-medium">Browse programs</a>
            <a routerLink="/experiences" class="px-5 py-3 rounded-full bg-white border border-neutral-200 text-sm font-medium">Browse experiences</a>
          </div>
          <ul class="mt-10 flex items-center gap-6 text-xs text-neutral-500">
            <li>🎟️ {{ experiences()?.items?.length ?? 0 }} live experiences</li>
            <li>🧑‍🏫 {{ expertise()?.items?.length ?? 0 }} expertise listings</li>
            <li>💼 {{ gigs()?.items?.length ?? 0 }} open gigs</li>
          </ul>
        </div>
        <div class="col-span-12 md:col-span-5 relative">
          <img class="rounded-lg shadow-md w-full" src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=900&q=70&auto=format&fit=crop" alt="People collaborating" />
        </div>
      </div>
    </section>

    <!-- VALUE PROPS -->
    <section class="max-w-[1320px] mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      <article>
        <div class="text-3xl">📚</div>
        <h3 class="font-semibold mt-3">Guided Programs</h3>
        <p class="text-sm text-neutral-700 mt-2">Multi-month journeys combining LMS courses, live experiences, and 1:1 expertise — pay once, everything inside is unlocked.</p>
        <a routerLink="/programs" class="inline-block mt-3 text-sm text-primary-700 font-medium">Programs →</a>
      </article>
      <article>
        <div class="text-3xl">🎟️</div>
        <h3 class="font-semibold mt-3">Experiences</h3>
        <p class="text-sm text-neutral-700 mt-2">Workshops, walks, and live sessions — from free community events to ticketed bootcamps.</p>
        <a routerLink="/experiences" class="inline-block mt-3 text-sm text-primary-700 font-medium">Experiences →</a>
      </article>
      <article>
        <div class="text-3xl">🧑‍🏫</div>
        <h3 class="font-semibold mt-3">Expertise</h3>
        <p class="text-sm text-neutral-700 mt-2">Book 1:1 mentoring or join small-group clinics with practitioners across the region.</p>
        <a routerLink="/expertise" class="inline-block mt-3 text-sm text-primary-700 font-medium">Expertise →</a>
      </article>
    </section>

    <!-- FEATURED PROGRAMS -->
    <section class="bg-neutral-50 py-20">
      <div class="max-w-[1320px] mx-auto px-6">
        <div class="flex items-baseline justify-between mb-6">
          <h2 class="text-2xl font-semibold">Featured programs</h2>
          <a routerLink="/programs" class="text-sm text-primary-700 font-medium">View all →</a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a *ngFor="let p of programs()?.slice(0, 3)" [routerLink]="['/programs', p.slug]"
             class="block bg-white rounded-lg overflow-hidden border border-neutral-200 hover:shadow-md transition">
            <div class="aspect-[16/9] bg-neutral-100"><img [src]="p.coverImageUrl" [alt]="p.title" class="w-full h-full object-cover" /></div>
            <div class="p-5">
              <div class="text-xs text-neutral-500">{{ p.ownerHub.hubName }}</div>
              <h3 class="font-semibold mt-1">{{ p.title }}</h3>
              <p class="text-sm text-neutral-500 line-clamp-2 mt-1">{{ p.tagline }}</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- HUBS STRIP -->
    <section class="max-w-[1320px] mx-auto px-6 py-20">
      <div class="flex items-baseline justify-between mb-6">
        <h2 class="text-2xl font-semibold">Powered by Mereka hubs</h2>
        <a routerLink="/hubs" class="text-sm text-primary-700 font-medium">All hubs →</a>
      </div>
      <ul class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <li *ngFor="let h of hubs()?.items ?? []" class="bg-white border border-neutral-200 rounded-lg p-5 flex items-center gap-3">
          <img [src]="h.logo" [alt]="h.name" class="w-12 h-12 rounded-full" />
          <div class="min-w-0">
            <a [routerLink]="['/hubs', h.slug]" class="font-medium truncate block hover:underline">{{ h.name }}</a>
            <div class="text-xs text-neutral-500 truncate">{{ h.tagline }}</div>
          </div>
        </li>
      </ul>
    </section>

    <!-- CTA -->
    <section class="bg-neutral-900 text-white py-20">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-semibold">Run a hub? Bring your programs to Mereka.</h2>
        <p class="mt-3 text-neutral-300">Stop running spreadsheets. Launch programs, experiences, and gigs to a regional learner base in one place.</p>
        <a routerLink="/programs/new" class="inline-block mt-8 px-6 py-3 rounded-full bg-white text-neutral-900 text-sm font-medium">Create your first program →</a>
      </div>
    </section>
  `,
})
export class HomePage {
  private readonly market = inject(MarketplaceService);
  private readonly programsApi = inject(ProgramsService);

  readonly experiences = toSignal(this.market.listExperiences(), { initialValue: null });
  readonly expertise = toSignal(this.market.listExpertise(), { initialValue: null });
  readonly gigs = toSignal(this.market.listGigs(), { initialValue: null });
  readonly hubs = toSignal(this.market.listHubs(), { initialValue: null });
  readonly programs = toSignal(this.programsApi.list({}).pipe(map((r) => r.items)), { initialValue: [] as Program[] });
}
