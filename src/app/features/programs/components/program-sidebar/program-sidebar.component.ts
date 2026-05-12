import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import type { Program } from '../../models/program.model';

interface NavItem { label: string; link: string; icon: string; badge?: boolean; }
interface NavGroup { label: string; items: NavItem[]; }

/**
 * Inner left sidebar — grouped Community/Learning/Events/Admin nav.
 * Matches Figma 5208:80547 (Manage Members) sidebar pattern.
 */
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
    {
      label: 'Community',
      items: [
        { label: 'Feed', link: 'feed', icon: 'feed' },
        { label: 'Announcements', link: 'announcements', icon: 'announcements', badge: true },
        { label: 'Discussions', link: 'discussions', icon: 'discussions' },
        { label: 'Members', link: 'members', icon: 'members' },
      ],
    },
    {
      label: 'Learning',
      items: [
        { label: 'Overview', link: 'curriculum', icon: 'overview', badge: true },
        { label: 'Curriculum', link: 'resources', icon: 'curriculum' },
      ],
    },
    {
      label: 'Events',
      items: [{ label: 'Recordings', link: 'recordings', icon: 'recordings' }],
    },
  ];

  readonly adminGroup: NavGroup = {
    label: 'Admin',
    items: [
      { label: 'Dashboard', link: 'admin/dashboard', icon: 'dashboard' },
      { label: 'Manage members', link: 'admin/members', icon: 'manage-members' },
      { label: 'Manage Content', link: 'admin/content', icon: 'manage-content' },
      { label: 'Inbox', link: 'admin/inbox', icon: 'inbox' },
      { label: 'Program feedback', link: 'admin/feedback', icon: 'feedback' },
    ],
  };

  goBack(): void {
    this.router.navigate(['/programs', 'me']);
  }
}
