import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface BridgeStep {
  label: string;
  detail: string;
}

const STEPS: BridgeStep[] = [
  { label: 'Verify enrolment on mereka.io', detail: 'Confirms payment / approval / campaign access.' },
  { label: 'Look up your LMS account', detail: 'Resolves mereka_user_id ↔ openedx_username from UserLmsAccount.' },
  { label: 'Provision LMS account if first time', detail: 'POST /api/user/v1/accounts on OpenEdx.' },
  { label: 'Issue SSO token', detail: 'Mereka JWT → OpenEdx OAuth2 session token.' },
  { label: 'Redirect to your course', detail: 'You\'ll land on the LMS course outline.' },
];

/**
 * /lms/launch/:courseId — SSO bridge / loading screen.
 *
 * Fills §8 + §12 LMS gap from the E2E doc. The whole LMS integration is
 * marked PLANNED in the doc; this is the user-facing transition page that
 * shows what's happening behind the scenes during the SSO handshake.
 *
 * In production, the redirect to OpenEdx happens after the bridge resolves;
 * for the prototype we cycle through the steps and stop on the final state.
 */
@Component({
  selector: 'mereka-lms-bridge',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen flex items-center justify-center p-6">
      <div class="bg-white rounded-2xl border border-neutral-200 p-8 w-full max-w-lg">
        <div class="flex items-center gap-3 mb-1">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-neutral-900 text-white">
            Mereka LMS · OpenEdx
          </span>
          <code class="text-xs text-neutral-500 font-mono truncate">{{ courseId() }}</code>
        </div>
        <h1 class="text-xl font-bold text-neutral-900 mt-3">
          {{ done() ? 'Ready when you are' : 'Connecting to your course…' }}
        </h1>
        <p class="text-sm text-neutral-500 mt-1">
          {{ done()
            ? "We've signed you in on the LMS. Click below to open your course outline."
            : "Don't navigate away — we're handing you off to OpenEdx." }}
        </p>

        <ul class="mt-6 space-y-3">
          <li *ngFor="let step of steps; let i = index" class="flex items-start gap-3">
            <span class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5"
              [class.bg-success]="i < current()"
              [class.text-white]="i < current()"
              [class.bg-neutral-900]="i === current() && !done()"
              [class.text-white]="i === current() && !done()"
              [class.bg-neutral-100]="i > current()"
              [class.text-neutral-400]="i > current()">
              <ng-container *ngIf="i < current()">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </ng-container>
              <ng-container *ngIf="i === current() && !done()">
                <svg class="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 12a9 9 0 1 1-6.2-8.55"/></svg>
              </ng-container>
              <ng-container *ngIf="i > current()">{{ i + 1 }}</ng-container>
            </span>
            <div class="min-w-0">
              <div class="text-sm font-medium text-neutral-900">{{ step.label }}</div>
              <div class="text-xs text-neutral-500 mt-0.5">{{ step.detail }}</div>
            </div>
          </li>
        </ul>

        <div class="mt-7 pt-5 border-t border-neutral-100">
          <a *ngIf="done()" [href]="lmsUrl()" target="_blank" rel="noopener"
            class="inline-flex w-full items-center justify-center px-5 py-3 rounded-full bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800">
            Open course on Mereka LMS →
          </a>
          <p *ngIf="!done()" class="text-xs text-neutral-400 text-center">
            This usually takes 2–4 seconds.
          </p>
          <a routerLink="/programs/me" class="block text-center text-xs text-neutral-500 hover:text-neutral-900 mt-3">
            ← Back to Your Programs
          </a>
        </div>
      </div>
    </div>
  `,
})
export class LmsBridgePage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  readonly steps = STEPS;

  readonly courseId = signal('course-v1:Mereka+UNKNOWN+2026');
  readonly current = signal(0);
  readonly done = signal(false);
  private timer: number | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('courseId');
    if (id) this.courseId.set(id);

    if (typeof window !== 'undefined') {
      this.timer = window.setInterval(() => {
        if (this.current() >= STEPS.length - 1) {
          this.done.set(true);
          if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = null;
          }
          return;
        }
        this.current.update((c) => c + 1);
      }, 700);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined' && this.timer) window.clearInterval(this.timer);
  }

  lmsUrl(): string {
    return `https://lms.mereka.io/courses/${encodeURIComponent(this.courseId())}/course/?sso=ok`;
  }
}
