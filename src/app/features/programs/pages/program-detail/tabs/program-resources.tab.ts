import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Resource { title: string; description: string; type: 'pdf' | 'video' | 'doc' | 'link'; url: string; }

@Component({
  selector: 'mereka-program-resources-tab',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="font-semibold text-lg mb-4">Resources</h2>
    <p class="text-sm text-neutral-500 mb-6 max-w-xl">Reading lists, slide decks, and starter repos curated for this cohort.</p>
    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <li *ngFor="let r of resources" class="rounded-lg border border-neutral-200 bg-white p-5 flex gap-3 hover:shadow-sm transition">
        <span class="text-2xl shrink-0" aria-hidden="true">{{ icon(r.type) }}</span>
        <div class="flex-1 min-w-0">
          <h3 class="font-medium truncate">{{ r.title }}</h3>
          <p class="text-sm text-neutral-500 mt-1 line-clamp-2">{{ r.description }}</p>
          <a [href]="r.url" target="_blank" rel="noopener" class="inline-block mt-3 text-xs text-primary-700 font-medium">Open →</a>
        </div>
      </li>
    </ul>
  `,
})
export class ProgramResourcesTab {
  readonly resources: Resource[] = [
    { title: 'Cohort kickoff slides', description: 'Slide deck from the kickoff session covering the program shape and norms.', type: 'pdf', url: '#' },
    { title: 'Prompting cheat-sheet', description: 'Two-page summary of the prompt patterns covered in Module 1.', type: 'pdf', url: '#' },
    { title: 'Starter repo: prompt-eval', description: 'GitHub starter repo for the optional weekly prompt-evaluation exercise.', type: 'link', url: '#' },
    { title: 'Office hours recording — Week 2', description: 'Live walkthrough of the Module 2 assignment with the mentors.', type: 'video', url: '#' },
  ];
  icon(type: Resource['type']): string {
    return type === 'pdf' ? '📄' : type === 'video' ? '🎥' : type === 'doc' ? '📝' : '🔗';
  }
}
