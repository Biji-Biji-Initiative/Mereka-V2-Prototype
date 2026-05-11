import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'mereka-ai-fundamentals', standalone: true, imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative overflow-hidden bg-neutral-900 text-white">
      <div class="max-w-[1100px] mx-auto px-6 py-24 text-center">
        <p class="uppercase tracking-widest text-xs text-primary-300">AI Fundamentals</p>
        <h1 class="mt-3 text-5xl md:text-6xl font-semibold leading-tight">AI Fluency for Everyone.</h1>
        <p class="mt-4 text-lg text-neutral-300 max-w-2xl mx-auto">A 4-week guided programme by Mereka × Microsoft Malaysia. Practical, paced, and free to apply.</p>
        <div class="mt-8 flex items-center justify-center gap-3">
          <a routerLink="/programs/ai4u" class="px-6 py-3 rounded-full bg-white text-neutral-900 text-sm font-medium">Apply now</a>
          <a routerLink="/programs" class="px-6 py-3 rounded-full border border-white/30 text-white text-sm font-medium">Browse other programmes</a>
        </div>
      </div>
    </section>
    <section class="max-w-[1100px] mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      <article *ngFor="let p of pillars">
        <div class="text-3xl">{{ p.emoji }}</div>
        <h3 class="font-semibold mt-3">{{ p.title }}</h3>
        <p class="text-sm text-neutral-700 mt-2">{{ p.body }}</p>
      </article>
    </section>
    <section class="bg-neutral-50 py-20">
      <div class="max-w-[1100px] mx-auto px-6">
        <h2 class="text-2xl font-semibold">Programme structure</h2>
        <ol class="mt-6 space-y-4">
          <li *ngFor="let w of weeks; let i = index" class="bg-white border border-neutral-200 rounded-lg p-5 flex gap-4">
            <span class="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-semibold shrink-0">{{ i + 1 }}</span>
            <div>
              <h3 class="font-semibold">{{ w.title }}</h3>
              <p class="text-sm text-neutral-700 mt-1">{{ w.body }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  `,
})
export class AiFundamentalsPage {
  readonly pillars = [
    { emoji: '🧠', title: 'Mental models', body: "Understand how today's AI actually works — without getting buried in math." },
    { emoji: '⚙️', title: 'Daily workflows', body: 'Practical Copilot, ChatGPT, and Gemini workflows for non-engineers.' },
    { emoji: '🤝', title: 'Cohort & mentors', body: 'Live sessions, peer cohorts, and 1:1 mentoring from regional experts.' },
  ];
  readonly weeks = [
    { title: 'Week 1 — Foundations', body: 'What LLMs are, what they can/can\'t do, and how to evaluate output.' },
    { title: 'Week 2 — Daily AI workflows', body: 'Copilot in Word/Excel, prompt patterns, summarisation, structured extraction.' },
    { title: 'Week 3 — Project work', body: 'Apply AI to a real workflow in your team. Mentor pairing throughout.' },
    { title: 'Week 4 — Showcase + certification', body: 'Present your project to the cohort and receive your certificate.' },
  ];
}
