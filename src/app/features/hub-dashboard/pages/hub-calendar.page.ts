import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'mereka-hub-calendar', standalone: true, imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">Calendar</h1>
    <section class="bg-white border border-neutral-200 rounded-lg p-6">
      <h2 class="font-semibold mb-4">May 2026</h2>
      <div class="grid grid-cols-7 gap-2 text-center text-xs">
        <div *ngFor="let d of dow" class="font-medium text-neutral-500">{{ d }}</div>
        <div *ngFor="let day of days; let i = index" class="aspect-square rounded border p-2 text-left"
             [class.border-neutral-200]="!day.event" [class.border-neutral-900]="day.event">
          <div class="text-sm">{{ day.n }}</div>
          <div *ngIf="day.event" class="mt-1 text-[10px] truncate text-success">{{ day.event }}</div>
        </div>
      </div>
    </section>
  `,
})
export class HubCalendarPage {
  readonly dow = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  readonly days = Array.from({ length: 31 }, (_, i) => {
    const n = i + 1; let event = '';
    if (n === 7) event = 'Image Gen';
    if (n === 14) event = 'Design TBC';
    if (n === 22) event = '1:1 Aisha';
    if (n === 24) event = 'Climate walk';
    return { n, event };
  });
}
