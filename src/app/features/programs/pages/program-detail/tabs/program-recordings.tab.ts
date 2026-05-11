import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

interface Recording { title: string; module: string; recordedAt: string; durationMinutes: number; speaker: string; thumbnail: string; }

@Component({
  selector: 'mereka-program-recordings-tab',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="font-semibold text-lg mb-4">Event Recordings</h2>
    <p class="text-sm text-neutral-500 mb-6 max-w-xl">Replays of live sessions and office hours, indexed by module.</p>
    <ul class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <li *ngFor="let r of recordings" class="rounded-lg overflow-hidden border border-neutral-200 bg-white hover:shadow-sm transition">
        <div class="aspect-[16/9] bg-neutral-100 relative">
          <img [src]="r.thumbnail" [alt]="r.title" class="w-full h-full object-cover" />
          <span class="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] px-1.5 py-0.5 rounded">{{ r.durationMinutes }}m</span>
        </div>
        <div class="p-4">
          <div class="text-xs text-neutral-500 mb-1">{{ r.module }} · {{ r.recordedAt | date: 'MMM d, y' }}</div>
          <h3 class="font-medium">{{ r.title }}</h3>
          <p class="text-xs text-neutral-500 mt-1">with {{ r.speaker }}</p>
        </div>
      </li>
    </ul>
  `,
})
export class ProgramRecordingsTab {
  readonly recordings: Recording[] = [
    { title: 'Module 1 — Welcome & program shape', module: 'Module 1', recordedAt: '2026-04-22', durationMinutes: 58, speaker: 'Aisha (Admin)', thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=70&auto=format&fit=crop' },
    { title: 'Office hours — week 2', module: 'Module 2', recordedAt: '2026-04-30', durationMinutes: 42, speaker: 'Justin (Mentor)', thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=900&q=70&auto=format&fit=crop' },
    { title: 'Image gen crash course replay', module: 'Module 3', recordedAt: '2026-05-04', durationMinutes: 76, speaker: 'Marcus (Expert)', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=70&auto=format&fit=crop' },
  ];
}
