import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mereka-dashboard-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">Saved for later</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <a *ngFor="let f of favorites" [routerLink]="f.link" class="block bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-sm transition">
        <div class="aspect-[16/9] bg-neutral-100"><img [src]="f.thumb" [alt]="f.title" class="w-full h-full object-cover" /></div>
        <div class="p-4">
          <div class="text-xs text-neutral-500 uppercase tracking-wider">{{ f.kind }}</div>
          <h3 class="font-medium mt-1">{{ f.title }}</h3>
        </div>
      </a>
    </div>
  `,
})
export class DashboardFavoritesPage {
  readonly favorites = [
    { kind: 'Program', title: 'AI4U — Practical AI for Everyone', link: '/programs/ai4u', thumb: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=70&auto=format&fit=crop' },
    { kind: 'Expertise', title: 'AI Product Management', link: '/expertise/ai-product-management', thumb: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=70&auto=format&fit=crop' },
    { kind: 'Experience', title: 'Design Thinking Bootcamp', link: '/experiences/design-thinking-bootcamp', thumb: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=900&q=70&auto=format&fit=crop' },
  ];
}
