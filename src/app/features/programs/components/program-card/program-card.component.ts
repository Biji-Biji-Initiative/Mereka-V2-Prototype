import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import type { Program } from '../../models/program.model';

@Component({
  selector: 'mereka-program-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="rounded-lg overflow-hidden bg-white border border-neutral-200 hover:shadow-md transition group h-full flex flex-col"
    >
      <div class="aspect-[16/10] bg-neutral-100 overflow-hidden relative">
        <img
          [src]="program().coverImageUrl"
          [alt]="program().title"
          class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <span
          class="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] uppercase tracking-wider rounded-sm font-medium text-white"
          [class.bg-success]="isFree()"
          [class.bg-neutral-900]="!isFree()"
        >
          {{ priceLabel() }}
        </span>
      </div>
      <div class="p-5 flex flex-col gap-3 flex-1">
        <div class="flex items-center gap-2 text-xs text-neutral-500">
          <img
            *ngIf="program().ownerHub.hubLogo as logo"
            [src]="logo"
            [alt]="program().ownerHub.hubName"
            class="w-5 h-5 rounded-full object-cover"
          />
          <span class="font-medium text-neutral-700">{{ program().ownerHub.hubName }}</span>
          <span *ngIf="collaboratorBadge() as badge">{{ '· ' + badge }}</span>
        </div>
        <h3 class="font-semibold text-neutral-900 leading-snug">{{ program().title }}</h3>
        <p class="text-sm text-neutral-500 line-clamp-2 flex-1">{{ program().tagline }}</p>
        <div class="flex items-center justify-between text-xs text-neutral-500 mt-auto">
          <span>{{ program().curriculum.length }} modules</span>
          <span>{{ program().stats.memberCount | number }} members</span>
        </div>
      </div>
    </article>
  `,
})
export class ProgramCardComponent {
  readonly program = input.required<Program>();

  isFree(): boolean {
    return this.program().pricing.kind === 'free';
  }

  /** Stringified price chip — narrowed once so the template stays simple. */
  priceLabel(): string {
    const p = this.program().pricing;
    return p.kind === 'free' ? 'Free' : `${p.currency} ${p.price}`;
  }

  collaboratorBadge(): string | null {
    const collabs = this.program().collaborators;
    if (!collabs.length) return null;
    if (collabs.length === 1) return `with ${collabs[0].hub.hubName}`;
    return `with ${collabs.length} hubs`;
  }
}
