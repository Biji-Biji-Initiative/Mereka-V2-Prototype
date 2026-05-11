import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'mereka-hub-jobs', standalone: true, imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold">Hub jobs</h1>
      <a routerLink="/gigs/new" class="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm">+ Post a gig</a>
    </header>
    <p class="text-sm text-neutral-500 mb-6">Project work you've posted to the Mereka network.</p>
    <a routerLink="/gigs/admin" class="inline-block text-primary-700 text-sm font-medium">Open the gig manager →</a>
  `,
})
export class HubJobsPage {}
