import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

interface SurveyQuestion {
  id: string;
  prompt: string;
  type: 'rating' | 'text' | 'choice';
  choices?: string[];
}

const PRE_QUESTIONS: SurveyQuestion[] = [
  { id: 'pre_1', prompt: 'How would you rate your current familiarity with this topic?', type: 'rating' },
  { id: 'pre_2', prompt: 'What outcome are you most hoping for from this programme?', type: 'text' },
  { id: 'pre_3', prompt: 'How did you hear about us?', type: 'choice', choices: ['Mereka newsletter', 'A friend / colleague', 'Social media', 'My company / hub', 'Search engine', 'Other'] },
];

const POST_QUESTIONS: SurveyQuestion[] = [
  { id: 'post_1', prompt: 'Overall, how would you rate your experience?', type: 'rating' },
  { id: 'post_2', prompt: 'How confident do you feel applying what you learned?', type: 'rating' },
  { id: 'post_3', prompt: 'Anything we should change for the next cohort?', type: 'text' },
  { id: 'post_4', prompt: 'Would you recommend this programme to a peer?', type: 'choice', choices: ['Definitely', 'Probably', 'Maybe', 'Probably not', 'Definitely not'] },
];

/**
 * /programs/:slug/survey?stage=pre|post — Pre/post programme surveys.
 *
 * Fills §8 LMS survey gap (Phase 3 of §2 Program Lifecycle).
 * In production these would be authored in OpenEdx; for the prototype
 * we render them inline on mereka.io so the flow is unbroken.
 */
@Component({
  selector: 'mereka-program-survey',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen">
      <div class="max-w-[680px] mx-auto px-6 py-12">
        <a [routerLink]="['/programs', slug()]" class="text-sm text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1 mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to programme
        </a>

        <div *ngIf="!submitted(); else thanks" class="bg-white rounded-2xl border border-neutral-200 p-8">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-info/10 text-info mb-2">
            {{ stage() === 'pre' ? 'Pre-programme survey' : 'Post-programme survey' }}
          </span>
          <h1 class="text-2xl font-bold text-neutral-900">
            {{ stage() === 'pre' ? "Quick check-in before you start" : "How was the journey?" }}
          </h1>
          <p class="text-sm text-neutral-500 mt-1">
            {{ stage() === 'pre'
              ? "Five minutes now helps your mentors tailor the experience."
              : "Your feedback shapes how we run the next cohort." }}
          </p>

          <div class="mt-3 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div class="h-full bg-success transition-all" [style.width.%]="progress()"></div>
          </div>
          <p class="text-xs text-neutral-400 mt-1 text-right">{{ answeredCount() }} / {{ questions().length }}</p>

          <ol class="mt-6 space-y-7">
            <li *ngFor="let q of questions(); let i = index">
              <div class="text-sm font-semibold text-neutral-900 mb-2">
                {{ i + 1 }}. {{ q.prompt }}
              </div>

              <ng-container [ngSwitch]="q.type">
                <div *ngSwitchCase="'rating'" class="flex items-center gap-2">
                  <button *ngFor="let n of [1,2,3,4,5]" type="button"
                    class="w-10 h-10 rounded-full text-sm font-semibold transition"
                    [class.bg-neutral-900]="answers()[q.id] === n"
                    [class.text-white]="answers()[q.id] === n"
                    [class.bg-neutral-100]="answers()[q.id] !== n"
                    [class.text-neutral-700]="answers()[q.id] !== n"
                    (click)="setAnswer(q.id, n)">{{ n }}</button>
                  <span class="ml-2 text-xs text-neutral-400">1 = low, 5 = high</span>
                </div>

                <textarea *ngSwitchCase="'text'" rows="3"
                  class="w-full px-3 py-2 rounded-md border border-neutral-200 focus:outline-none focus:border-neutral-400 text-sm"
                  placeholder="Type your answer…"
                  [ngModel]="answers()[q.id]" (ngModelChange)="setAnswer(q.id, $event)"></textarea>

                <div *ngSwitchCase="'choice'" class="flex flex-wrap gap-2">
                  <button *ngFor="let opt of q.choices" type="button"
                    class="px-3 py-1.5 rounded-full text-sm transition"
                    [class.bg-neutral-900]="answers()[q.id] === opt"
                    [class.text-white]="answers()[q.id] === opt"
                    [class.bg-neutral-100]="answers()[q.id] !== opt"
                    [class.text-neutral-700]="answers()[q.id] !== opt"
                    (click)="setAnswer(q.id, opt)">{{ opt }}</button>
                </div>
              </ng-container>
            </li>
          </ol>

          <button type="button" (click)="submit()" [disabled]="!complete()" [class.opacity-40]="!complete()"
            class="mt-8 w-full px-5 py-3 rounded-full bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800">
            {{ stage() === 'pre' ? 'Submit & start learning →' : 'Submit feedback →' }}
          </button>
          <p *ngIf="!complete()" class="text-xs text-neutral-400 text-center mt-2">
            Answer all questions to continue.
          </p>
        </div>

        <ng-template #thanks>
          <div class="bg-white rounded-2xl border border-success/30 p-8 text-center">
            <div class="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 class="text-xl font-bold text-neutral-900">Thanks — saved.</h2>
            <p class="text-sm text-neutral-500 mt-1">
              {{ stage() === 'pre'
                ? 'Heading to your first module now.'
                : 'Your responses go straight to the programme team.' }}
            </p>
            <button type="button" (click)="continue()" class="mt-5 inline-flex items-center justify-center px-5 py-3 rounded-full bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800">
              {{ stage() === 'pre' ? 'Open the LMS →' : 'See programme certificate →' }}
            </button>
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class ProgramSurveyPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly slug = signal(this.route.snapshot.paramMap.get('slug') ?? 'ai4u');
  readonly stage = signal<'pre' | 'post'>(
    (this.route.snapshot.queryParamMap.get('stage') as 'pre' | 'post') ?? 'pre',
  );

  readonly questions = computed(() => (this.stage() === 'pre' ? PRE_QUESTIONS : POST_QUESTIONS));
  readonly answers = signal<Record<string, string | number>>({});

  readonly answeredCount = computed(() =>
    this.questions().filter((q) => {
      const v = this.answers()[q.id];
      return v !== undefined && v !== '' && v !== null;
    }).length,
  );
  readonly complete = computed(() => this.answeredCount() === this.questions().length);
  readonly progress = computed(() => Math.round((this.answeredCount() / this.questions().length) * 100));

  readonly submitted = signal(false);

  setAnswer(id: string, value: string | number): void {
    this.answers.update((a) => ({ ...a, [id]: value }));
  }

  submit(): void {
    this.submitted.set(true);
  }

  continue(): void {
    if (this.stage() === 'pre') {
      this.router.navigate(['/lms/launch', `course-v1:Mereka+${this.slug().toUpperCase()}+2026`]);
    } else {
      this.router.navigate(['/programs', this.slug(), 'certificate']);
    }
  }
}
