import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import type { Program } from '../../models/program.model';

interface NavItem {
  label: string;
  link: string;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'mereka-program-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white rounded-lg border border-neutral-200 p-4 sticky top-20 text-sm">
      <a
        href="javascript:void(0)"
        class="text-neutral-400 hover:text-neutral-700 inline-flex items-center gap-1 mb-4"
        (click)="goBack()"
      >
        <span aria-hidden="true">←</span> Programs
      </a>

      <div class="flex items-center gap-2 mb-4">
        <div
          class="w-9 h-9 rounded-lg bg-primary-100 text-primary-800 flex items-center justify-center font-semibold uppercase"
        >
          {{ program().title[0] }}
        </div>
        <div class="leading-tight overflow-hidden">
          <div class="font-semibold truncate">{{ program().title }}</div>
          <div class="text-xs text-neutral-500 truncate">{{ program().ownerHub.hubName }}</div>
        </div>
      </div>

      <nav class="space-y-4">
        <div *ngFor="let group of navGroups">
          <div class="text-[11px] uppercase tracking-widest text-neutral-400 mb-2">
            {{ group.label }}
          </div>
          <ul class="space-y-1">
            <li *ngFor="let item of group.items">
              <a
                [routerLink]="item.link"
                routerLinkActive="bg-neutral-100 text-neutral-900 font-medium"
                class="flex items-center justify-between px-3 py-1.5 rounded-md text-neutral-600 hover:bg-neutral-50"
              >
                <span>{{ item.label }}</span>
                <span
                  *ngIf="item.badge"
                  class="text-[10px] bg-info text-white rounded-full px-1.5 py-0.5"
                  >{{ item.badge }}</span
                >
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  `,
})
export class ProgramSidebarComponent {
  readonly program = input.required<Program>();

  readonly navGroups: NavGroup[] = [
    {
      label: 'Community',
      items: [
        { label: 'Feed', link: 'feed' },
        { label: 'Discussions', link: 'discussions' },
        { label: 'Members', link: 'members' },
      ],
    },
    {
      label: 'Learning',
      items: [{ label: 'Curriculum', link: 'curriculum' }],
    },
    {
      label: 'Events',
      items: [{ label: 'About', link: 'about' }],
    },
  ];

  goBack(): void {
    history.back();
  }
}
