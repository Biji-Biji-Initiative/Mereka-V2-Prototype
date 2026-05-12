import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BroadcastsMockService } from '../services/broadcasts-mock.service';

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
      <div>
        <a routerLink=".." class="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" /></svg>
          Back to broadcasts
        </a>
        <h1 class="text-2xl font-semibold text-neutral-900">Email templates</h1>
        <p class="text-sm text-neutral-500 mt-1">Reusable email layouts with pages, blocks, and variables.</p>
      </div>
      <a [routerLink]="['new']"
         class="h-10 px-4 inline-flex items-center gap-2 text-sm bg-neutral-900 text-white rounded-full hover:bg-neutral-800">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round" /></svg>
        New template
      </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <a *ngFor="let t of mock.emailTemplates()"
         [routerLink]="[t.id]"
         class="block bg-white border border-neutral-200 rounded-lg overflow-hidden hover:border-neutral-300 transition">
        <div class="aspect-[4/3] bg-neutral-50 border-b border-neutral-100 flex items-center justify-center p-6 text-center">
          <div>
            <div class="text-lg font-semibold mb-2">{{ t.name }}</div>
            <div class="text-xs text-neutral-500">{{ t.pages.length }} page{{ t.pages.length > 1 ? 's' : '' }}</div>
          </div>
        </div>
        <div class="p-4">
          <div class="text-sm font-medium text-neutral-900 truncate">{{ t.subject }}</div>
          <div class="text-xs text-neutral-500 mt-1">Updated {{ t.updatedAt | date: 'mediumDate' }}</div>
        </div>
      </a>
    </div>
  `,
})
export class EmailTemplatesListPage {
  protected readonly mock = inject(BroadcastsMockService);
}
