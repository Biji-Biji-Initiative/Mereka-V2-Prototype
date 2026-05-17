import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { ProgramsService } from '../../../services/programs.service';
import type { Program } from '../../../models/program.model';

@Component({
  selector: 'mereka-program-about-tab',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article *ngIf="program() as p" class="space-y-6">
      <section class="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 class="font-semibold text-lg mb-2">About this program</h2>
        <p class="text-neutral-700 leading-relaxed">{{ p.description }}</p>
      </section>

      <section class="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 class="font-semibold text-lg mb-3">Pricing</h2>
        <ng-container [ngSwitch]="p.pricing.kind">
          <p *ngSwitchCase="'free'" class="text-success font-medium">
            Free — every course, experience, and expertise inside this program is included.
          </p>
          <p *ngSwitchCase="'paid'">
            <span class="text-2xl font-semibold text-neutral-900">
              {{ priceLabel(p) }}
            </span>
            <span class="text-neutral-500 text-sm">
              · all-in. No additional fees for the courses, experiences, or expertise listed below.
            </span>
          </p>
        </ng-container>
      </section>

      <section class="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 class="font-semibold text-lg mb-3">Hub partners</h2>
        <ul class="space-y-3">
          <li class="flex items-center gap-3">
            <img
              *ngIf="p.ownerHub.hubLogo as l"
              [src]="l"
              [alt]="p.ownerHub.hubName"
              class="w-9 h-9 rounded-full"
            />
            <div>
              <div class="font-medium">{{ p.ownerHub.hubName }}</div>
              <div class="text-xs text-neutral-500">Owner</div>
            </div>
          </li>
          <li *ngFor="let c of p.collaborators" class="flex items-center gap-3">
            <img
              *ngIf="c.hub.hubLogo as l"
              [src]="l"
              [alt]="c.hub.hubName"
              class="w-9 h-9 rounded-full"
            />
            <div>
              <div class="font-medium">{{ c.hub.hubName }}</div>
              <div class="text-xs text-neutral-500 capitalize">Collaborator · {{ c.role }}</div>
            </div>
          </li>
        </ul>
      </section>

      <section *ngIf="p.timeline.startsAt || p.timeline.enrollEnd" class="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 class="font-semibold text-lg mb-3">Timeline</h2>
        <dl class="grid grid-cols-2 gap-y-2 text-sm">
          <ng-container *ngIf="p.timeline.enrollStart">
            <dt class="text-neutral-500">Enrolment opens</dt>
            <dd>{{ p.timeline.enrollStart | date: 'MMM d, y' }}</dd>
          </ng-container>
          <ng-container *ngIf="p.timeline.enrollEnd">
            <dt class="text-neutral-500">Enrolment closes</dt>
            <dd>{{ p.timeline.enrollEnd | date: 'MMM d, y' }}</dd>
          </ng-container>
          <ng-container *ngIf="p.timeline.startsAt">
            <dt class="text-neutral-500">Program starts</dt>
            <dd>{{ p.timeline.startsAt | date: 'MMM d, y' }}</dd>
          </ng-container>
          <ng-container *ngIf="p.timeline.endsAt">
            <dt class="text-neutral-500">Program ends</dt>
            <dd>{{ p.timeline.endsAt | date: 'MMM d, y' }}</dd>
          </ng-container>
        </dl>
      </section>
    </article>
  `,
})
export class ProgramAboutTab {
  private readonly route = inject(ActivatedRoute);
  private readonly programs = inject(ProgramsService);

  readonly program = toSignal(
    this.route.parent!.paramMap.pipe(
      switchMap((params) => this.programs.bySlug(params.get('slug') ?? '')),
    ),
    { initialValue: null },
  );

  /** Narrowed price label — keeps the discriminated union out of the template. */
  priceLabel(p: Program): string {
    return p.pricing.kind === 'free' ? 'Free' : `${p.pricing.currency} ${p.pricing.price}`;
  }
}
