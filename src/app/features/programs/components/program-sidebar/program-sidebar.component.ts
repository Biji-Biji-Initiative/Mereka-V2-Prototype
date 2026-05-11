import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import type { Program } from '../../models/program.model';

interface NavItem { label: string; link: string; badge?: string; }
interface NavGroup { label: string; items: NavItem[]; }

@Component({
  selector: 'mereka-program-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-sidebar.component.html',
})
export class ProgramSidebarComponent {
  private readonly router = inject(Router);
  readonly program = input.required<Program>();
  readonly showAdmin = input<boolean>(false);

  readonly navGroups: NavGroup[] = [
    { label: 'Community', items: [
      { label: 'Feed', link: 'feed' },
      { label: 'Announcements', link: 'announcements' },
      { label: 'Discussions', link: 'discussions' },
      { label: 'Members', link: 'members' },
    ]},
    { label: 'Learning', items: [
      { label: 'Overview', link: 'curriculum' },
      { label: 'Resources', link: 'resources' },
    ]},
    { label: 'Events', items: [
      { label: 'Recordings', link: 'recordings' },
      { label: 'About', link: 'about' },
    ]},
  ];

  readonly adminGroup: NavGroup = {
    label: 'Admin',
    items: [
      { label: 'Dashboard', link: 'admin/dashboard' },
      { label: 'Analytics', link: 'admin/analytics' },
      { label: 'Manage Members', link: 'admin/members' },
      { label: 'Manage Forms', link: 'admin/forms' },
      { label: 'Manage Content', link: 'admin/content' },
      { label: 'Inbox', link: 'admin/inbox' },
      { label: 'Program Feedback', link: 'admin/feedback' },
    ],
  };

  goBack(): void { this.router.navigate(['/programs']); }
}
