import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mereka-dashboard-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="text-2xl font-semibold mb-6">My Courses</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <article *ngFor="let c of courses" class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div class="aspect-[16/9] bg-neutral-100"><img [src]="c.thumb" [alt]="c.title" class="w-full h-full object-cover" /></div>
        <div class="p-4">
          <div class="text-xs text-neutral-500 uppercase tracking-wider">{{ c.hub }}</div>
          <h3 class="font-medium mt-1">{{ c.title }}</h3>
          <div class="mt-3 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div class="h-full bg-success" [style.width.%]="c.progress"></div>
          </div>
          <div class="flex items-center justify-between mt-2 text-xs text-neutral-500">
            <span>{{ c.progress }}% complete</span>
            <a routerLink="/programs/ai4u/curriculum" class="text-primary-700 font-medium">Continue →</a>
          </div>
        </div>
      </article>
    </div>
  `,
})
export class DashboardCoursesPage {
  readonly courses = [
    { title: 'Generative AI Fundamentals', hub: 'Bijibiji Initiative', progress: 100, thumb: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=70&auto=format&fit=crop' },
    { title: 'Prompt Craft for Builders', hub: 'AI4U Collective', progress: 40, thumb: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=70&auto=format&fit=crop' },
    { title: 'Explore Responsible AI', hub: 'Microsoft Malaysia', progress: 12, thumb: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=900&q=70&auto=format&fit=crop' },
  ];
}
