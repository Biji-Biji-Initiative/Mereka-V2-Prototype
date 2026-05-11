import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'mereka-hub-engagement', standalone: true, imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">Engagement</h1>
    <p class="text-sm text-neutral-500 mb-6 max-w-2xl">How members are interacting with your hub — posts, replies, attendance, completion.</p>
    <section class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div class="bg-white border border-neutral-200 rounded-lg p-5">
        <div class="text-xs text-neutral-500">Daily active members</div>
        <div class="text-2xl font-semibold mt-1">312</div>
      </div>
      <div class="bg-white border border-neutral-200 rounded-lg p-5">
        <div class="text-xs text-neutral-500">Posts per week</div>
        <div class="text-2xl font-semibold mt-1">142</div>
      </div>
      <div class="bg-white border border-neutral-200 rounded-lg p-5">
        <div class="text-xs text-neutral-500">Avg attendance</div>
        <div class="text-2xl font-semibold mt-1">84%</div>
      </div>
    </section>
  `,
})
export class HubEngagementPage {}
