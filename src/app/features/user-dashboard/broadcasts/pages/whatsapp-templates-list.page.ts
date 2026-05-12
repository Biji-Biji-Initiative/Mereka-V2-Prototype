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
        <h1 class="text-2xl font-semibold text-neutral-900">WhatsApp templates</h1>
        <p class="text-sm text-neutral-500 mt-1">Pre-approved message templates with header / body / footer / buttons + variables.</p>
      </div>
      <a [routerLink]="['new']"
         class="h-10 px-4 inline-flex items-center gap-2 text-sm bg-neutral-900 text-white rounded-full hover:bg-neutral-800">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round" /></svg>
        New template
      </a>
    </div>

    <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-500">
          <tr>
            <th class="text-left px-5 py-3 font-medium">Name</th>
            <th class="text-left px-3 py-3 font-medium">Category</th>
            <th class="text-left px-3 py-3 font-medium">Language</th>
            <th class="text-left px-3 py-3 font-medium">Status</th>
            <th class="text-left px-5 py-3 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-100">
          <tr *ngFor="let t of mock.whatsappTemplates()"
              [routerLink]="[t.id]"
              class="hover:bg-neutral-50 cursor-pointer">
            <td class="px-5 py-4 font-medium text-neutral-900 font-mono">{{ t.name }}</td>
            <td class="px-3 py-4 text-neutral-700">{{ t.category }}</td>
            <td class="px-3 py-4 text-neutral-700">{{ t.language }}</td>
            <td class="px-3 py-4">
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px]"
                    [ngClass]="{
                      'bg-neutral-100 text-neutral-600': t.status === 'draft',
                      'bg-yellow-50 text-yellow-700': t.status === 'pending',
                      'bg-green-50 text-green-700': t.status === 'approved',
                      'bg-red-50 text-red-700': t.status === 'rejected'
                    }">
                <span class="w-1.5 h-1.5 rounded-full"
                      [ngClass]="{
                        'bg-neutral-400': t.status === 'draft',
                        'bg-yellow-500': t.status === 'pending',
                        'bg-green-500': t.status === 'approved',
                        'bg-red-500': t.status === 'rejected'
                      }"></span>
                {{ t.status | titlecase }}
              </span>
            </td>
            <td class="px-5 py-4 text-neutral-500">{{ t.updatedAt | date: 'mediumDate' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class WhatsappTemplatesListPage {
  protected readonly mock = inject(BroadcastsMockService);
}
