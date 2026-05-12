import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface ComponentRow {
  type: 'course' | 'experience' | 'expertise';
  title: string;
  completedAt: string;
  grade?: string;
}

/**
 * /programs/:slug/certificate — Programme-level certificate.
 *
 * Fills §2 Phase 3 closing screen + §8 final certificate sync.
 * Renders a printable certificate panel + a breakdown of the courses /
 * experiences / expertise that contributed to the completion.
 */
@Component({
  selector: 'mereka-programme-certificate',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen">
      <div class="max-w-[900px] mx-auto px-6 py-12">
        <a [routerLink]="['/programs', slug()]" class="text-sm text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1 mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to programme
        </a>

        <!-- Certificate canvas -->
        <article class="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div class="relative aspect-[4/3] p-12"
               style="background:
                radial-gradient(circle at 0% 0%, #fbe4ee 0%, transparent 40%),
                radial-gradient(circle at 100% 100%, #e8e0ff 0%, transparent 40%),
                linear-gradient(180deg, #ffffff 0%, #fafaff 100%);">
            <div class="absolute top-6 right-6 text-right">
              <div class="text-[10px] uppercase tracking-widest font-bold text-neutral-500">Mereka.io</div>
              <div class="text-[10px] uppercase tracking-widest text-neutral-400">Certificate · {{ certId() }}</div>
            </div>
            <div class="absolute bottom-6 left-12 right-12 flex items-end justify-between text-xs text-neutral-500">
              <div>
                <div class="font-semibold text-neutral-900 text-sm">{{ programmeOwner() }}</div>
                <div>Programme issuer</div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-neutral-900 text-sm">{{ issuedOn() }}</div>
                <div>Date of issue</div>
              </div>
            </div>

            <div class="h-full flex flex-col items-center justify-center text-center max-w-[480px] mx-auto">
              <div class="text-[11px] uppercase tracking-widest font-semibold text-neutral-500">Certificate of Completion</div>
              <h1 class="mt-2 text-3xl font-bold text-neutral-900 leading-tight"
                  style="font-family: 'Poppins', sans-serif;">
                {{ programmeTitle() }}
              </h1>
              <p class="text-sm text-neutral-500 mt-3">presented to</p>
              <p class="text-2xl font-bold text-neutral-900 mt-1"
                 style="font-family: 'Poppins', sans-serif;">
                {{ recipientName() }}
              </p>
              <p class="mt-3 text-xs text-neutral-500 max-w-md">
                For successfully completing all mandatory courses, experiences and expertise sessions
                that make up this Mereka programme.
              </p>
            </div>
          </div>
        </article>

        <!-- Actions -->
        <div class="mt-4 flex flex-wrap gap-3 justify-end">
          <button type="button" (click)="print()" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 text-sm font-medium hover:bg-neutral-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print
          </button>
          <button type="button" (click)="copyShareLink()" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-neutral-200 text-sm font-medium hover:bg-neutral-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            {{ copied() ? 'Link copied!' : 'Copy share link' }}
          </button>
          <a href="https://www.linkedin.com/profile/add" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800">
            Add to LinkedIn →
          </a>
        </div>

        <!-- Breakdown -->
        <section class="mt-10">
          <h2 class="text-lg font-bold text-neutral-900">What this certifies</h2>
          <p class="text-sm text-neutral-500">
            Programme certificates are issued only after every mandatory course, experience, and
            expertise session has been completed.
          </p>
          <ul class="mt-4 divide-y divide-neutral-100 bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            <li *ngFor="let c of components" class="px-5 py-4 flex items-center gap-4">
              <span class="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-base shrink-0">
                {{ c.type === 'course' ? '📘' : c.type === 'experience' ? '🎟️' : '🧑‍🏫' }}
              </span>
              <div class="flex-1 min-w-0">
                <div class="text-xs uppercase tracking-wider text-neutral-400">{{ c.type }}</div>
                <div class="font-semibold text-neutral-900 truncate">{{ c.title }}</div>
              </div>
              <div class="text-right text-xs text-neutral-500">
                <div>Completed {{ c.completedAt }}</div>
                <div *ngIf="c.grade" class="text-success font-semibold mt-0.5">{{ c.grade }}</div>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  `,
})
export class ProgrammeCertificatePage {
  private readonly route = inject(ActivatedRoute);

  readonly slug = signal(this.route.snapshot.paramMap.get('slug') ?? 'ai4u');
  readonly recipientName = signal('Nicholas Hon');
  readonly programmeTitle = signal('AI Fluency by Microsoft');
  readonly programmeOwner = signal('Microsoft Malaysia × Mereka');
  readonly certId = signal('MRK-2026-AI4U-00428');
  readonly issuedOn = signal('12 May 2026');
  readonly copied = signal(false);

  readonly components: ComponentRow[] = [
    { type: 'course', title: 'Generative AI Fundamentals', completedAt: '14 Mar 2026', grade: 'Grade A' },
    { type: 'course', title: 'Prompt Engineering Deep Dive', completedAt: '02 Apr 2026', grade: 'Grade A−' },
    { type: 'experience', title: 'Image Gen Crash Course (live workshop)', completedAt: '18 Apr 2026' },
    { type: 'expertise', title: 'AI Product Management — 1:1 with senior PM', completedAt: '05 May 2026' },
  ];

  print(): void {
    if (typeof window !== 'undefined') window.print();
  }

  copyShareLink(): void {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/programs/${this.slug()}/certificate?id=${this.certId()}`;
    if (navigator.clipboard?.writeText) void navigator.clipboard.writeText(url);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1800);
  }
}
