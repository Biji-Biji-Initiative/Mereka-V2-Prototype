import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mereka-not-found',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="max-w-xl mx-auto py-24 text-center px-6">
      <div class="text-6xl font-bold text-neutral-900">404</div>
      <h1 class="mt-4 text-2xl font-semibold">We couldn't find that page</h1>
      <p class="mt-2 text-neutral-500">
        The link may be broken, or the page may have been moved.
      </p>
      <a
        routerLink="/programs"
        class="inline-block mt-8 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-sm font-medium"
      >
        Browse programs
      </a>
    </section>
  `,
})
export class NotFoundComponent {}
