import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'mereka-hub-services', standalone: true, imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">Services</h1>
      <a routerLink="/experiences/new" class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm">+ Add service</a>
    </header>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <a routerLink="/programs/admin" class="bg-white border border-neutral-200 rounded-lg p-5 hover:shadow-sm transition">
        <div class="text-2xl">📚</div>
        <h3 class="font-semibold mt-2">Programs</h3>
        <p class="text-sm text-neutral-500 mt-1">Multi-month guided journeys.</p>
        <div class="text-xs text-neutral-500 mt-3">3 published · 0 drafts</div>
      </a>
      <a routerLink="/experiences/admin" class="bg-white border border-neutral-200 rounded-lg p-5 hover:shadow-sm transition">
        <div class="text-2xl">🎟️</div>
        <h3 class="font-semibold mt-2">Experiences</h3>
        <p class="text-sm text-neutral-500 mt-1">Workshops and live events.</p>
        <div class="text-xs text-neutral-500 mt-3">4 published</div>
      </a>
      <a routerLink="/expertise/admin" class="bg-white border border-neutral-200 rounded-lg p-5 hover:shadow-sm transition">
        <div class="text-2xl">🧑‍🏫</div>
        <h3 class="font-semibold mt-2">Expertise</h3>
        <p class="text-sm text-neutral-500 mt-1">1:1 and group mentoring.</p>
        <div class="text-xs text-neutral-500 mt-3">2 published</div>
      </a>
    </div>
  `,
})
export class HubServicesPage {}
