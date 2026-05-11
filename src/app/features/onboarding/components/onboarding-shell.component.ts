import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface OnboardingStep { key: string; label: string; }

@Component({
  selector: 'mereka-onboarding-shell',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-neutral-50 min-h-screen">
      <div class="max-w-[1320px] mx-auto px-6 py-10 grid grid-cols-12 gap-6">
        <aside class="col-span-12 md:col-span-3">
          <div class="bg-white border border-neutral-200 rounded-lg p-5 sticky top-20">
            <p class="text-[11px] uppercase tracking-widest text-neutral-400 mb-1">{{ kind() }}</p>
            <h2 class="text-xl font-semibold">{{ title() }}</h2>
            <p class="text-xs text-neutral-500 mt-1">Step {{ activeIndex() + 1 }} of {{ steps().length }}</p>
            <div class="h-1.5 bg-neutral-100 rounded-full mt-3 overflow-hidden">
              <div class="h-full bg-success transition-[width] duration-300" [style.width.%]="progress()"></div>
            </div>
            <ul class="mt-6 space-y-1">
              <li *ngFor="let s of steps(); let i = index">
                <button type="button" class="w-full text-left px-3 py-1.5 rounded-md text-sm flex items-center gap-2"
                        [class.bg-neutral-100]="active() === s.key"
                        [class.text-neutral-900]="active() === s.key || i < activeIndex()"
                        [class.text-neutral-500]="active() !== s.key && i > activeIndex()"
                        [class.font-medium]="active() === s.key"
                        (click)="activate.emit(s.key)">
                  <span class="w-5 h-5 inline-flex items-center justify-center rounded-full text-[10px]"
                        [class.bg-neutral-900]="i <= activeIndex()" [class.text-white]="i <= activeIndex()"
                        [class.bg-neutral-100]="i > activeIndex()">{{ i + 1 }}</span>
                  {{ s.label }}
                </button>
              </li>
            </ul>
          </div>
        </aside>
        <main class="col-span-12 md:col-span-9">
          <div class="bg-white border border-neutral-200 rounded-lg p-8 min-h-[420px]">
            <ng-content />
          </div>
        </main>
      </div>
    </div>
  `,
})
export class OnboardingShellComponent {
  readonly kind = input<string>('Onboarding');
  readonly title = input<string>('');
  readonly steps = input.required<OnboardingStep[]>();
  readonly active = input.required<string>();
  readonly activate = output<string>();
  readonly activeIndex = computed(() => this.steps().findIndex((s) => s.key === this.active()));
  readonly progress = computed(() => ((this.activeIndex() + 1) / this.steps().length) * 100);
}
