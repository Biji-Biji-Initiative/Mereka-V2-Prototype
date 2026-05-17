import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DashboardSidebarComponent } from '../../dashboard/components/dashboard-sidebar.component';

/**
 * Dashboard sub-route shell — renders the shared dashboard sidebar alongside
 * the routed sub-page (broadcasts, bookings, courses, etc.) so navigation
 * stays consistent across the whole /dashboard tree.
 */
@Component({
  selector: 'mereka-user-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DashboardSidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex w-full min-h-[calc(100vh-64px)] items-start" style="background:#F6F6F6">
      <mereka-dashboard-sidebar />
      <main class="flex-1 min-w-0 w-full px-4 sm:px-6 lg:px-10 py-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class UserDashboardShellComponent {}
