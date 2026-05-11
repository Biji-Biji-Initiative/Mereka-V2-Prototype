import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mereka-auth-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-neutral-50 grid md:grid-cols-2">
      <aside class="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-program-hero-start to-program-hero-end">
        <a routerLink="/" aria-label="Mereka home" class="inline-block">
          <img src="logo-mereka.svg" alt="Mereka" class="h-8 w-auto" />
        </a>
        <div>
          <h1 class="text-3xl font-semibold text-neutral-900 leading-tight max-w-md">Build the future of work, together.</h1>
          <p class="text-neutral-700 mt-3 max-w-md">One account works across Mereka — programs, experiences, expertise, gigs, and hub dashboards.</p>
        </div>
        <p class="text-xs text-neutral-500">© {{ year }} Mereka</p>
      </aside>
      <main class="flex items-center justify-center px-6 py-12">
        <div class="w-full max-w-md"><router-outlet /></div>
      </main>
    </div>
  `,
})
export class AuthShellPage { readonly year = new Date().getFullYear(); }
