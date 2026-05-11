import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'mereka-hub-settings', standalone: true, imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">Hub settings</h1>
    <section class="bg-white border border-neutral-200 rounded-lg p-6 max-w-xl space-y-4">
      <label class="block"><span class="text-sm font-medium">Hub name</span>
        <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="name()" (ngModelChange)="name.set($event)" name="name" /></label>
      <label class="block"><span class="text-sm font-medium">Tagline</span>
        <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200" [ngModel]="tagline()" (ngModelChange)="tagline.set($event)" name="tagline" /></label>
      <label class="block"><span class="text-sm font-medium">Public profile slug</span>
        <input class="mt-1 w-full px-3 py-2 rounded border border-neutral-200 font-mono" [ngModel]="slug()" (ngModelChange)="slug.set($event)" name="slug" /></label>
      <h3 class="font-semibold pt-4 border-t border-neutral-100">Danger zone</h3>
      <button class="text-error text-sm">Archive hub</button>
    </section>
  `,
})
export class HubSettingsPage {
  readonly name = signal('AI4U Collective'); readonly tagline = signal('Practical AI for everyone'); readonly slug = signal('ai4u');
}
