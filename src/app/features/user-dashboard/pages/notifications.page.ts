import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type NotifType = 'system' | 'course' | 'hub' | 'booking' | 'social';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
  hub?: string;
}

const TYPE_ICON: Record<NotifType, { bg: string; color: string; label: string }> = {
  system:  { bg: '#ECECF1', color: '#303345', label: 'SYS' },
  course:  { bg: '#DBEAFE', color: '#276EF1', label: 'CRS' },
  hub:     { bg: '#D4E8D4', color: '#16A34A', label: 'HUB' },
  booking: { bg: '#FEF3C7', color: '#D97706', label: 'BKG' },
  social:  { bg: '#F3E8FF', color: '#7C3AED', label: 'SOC' },
};

@Component({
  selector: 'mereka-dashboard-notifications',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notifications.page.html',
})
export class DashboardNotificationsPage {
  readonly filters = ['All', 'Unread', 'System', 'Courses', 'Hub', 'Bookings'] as const;
  readonly activeFilter = signal<string>('All');
  readonly typeIcon = TYPE_ICON;

  setFilter(f: string): void { this.activeFilter.set(f); }

  readonly notifications = signal<Notification[]>([
    {
      id: 'n1', type: 'course', title: 'New Module Available',
      body: 'Module 11: Advanced Prompt Techniques has been added to AI Fundamentals.',
      time: '2 hours ago', read: false, actionLabel: 'View Module', hub: 'Biji-biji Initiative',
    },
    {
      id: 'n2', type: 'booking', title: 'Booking Confirmed',
      body: 'Your booking for "Portfolio Sprint: Build Your First Case Study" on 25 May 2026 has been confirmed.',
      time: '5 hours ago', read: false, actionLabel: 'View Booking',
    },
    {
      id: 'n3', type: 'hub', title: 'New Announcement in Biji-biji Initiative',
      body: 'Jessica posted a new announcement: "AI4U Phase 2 Launch Details"',
      time: '1 day ago', read: false, hub: 'Biji-biji Initiative', actionLabel: 'Read More',
    },
    {
      id: 'n4', type: 'system', title: 'Profile Completion Reminder',
      body: 'Your profile is 80% complete. Add a profile photo to reach 100% and unlock all features.',
      time: '1 day ago', read: true, actionLabel: 'Complete Profile',
    },
    {
      id: 'n5', type: 'course', title: 'Course Deadline Approaching',
      body: 'Prompt Engineering is due in 14 days. You have 4 modules remaining.',
      time: '2 days ago', read: true, hub: 'Biji-biji Initiative',
    },
    {
      id: 'n6', type: 'social', title: 'Dave replied to your discussion',
      body: '"Great progress on the 30-day challenge! Keep going."',
      time: '2 days ago', read: true, hub: 'Biji-biji Initiative',
    },
    {
      id: 'n7', type: 'booking', title: 'Booking Reminder',
      body: 'Your "Bike Sizing and Bike Fitting" session is tomorrow at 10:00 AM.',
      time: '3 days ago', read: true,
    },
    {
      id: 'n8', type: 'system', title: 'Payment Received',
      body: 'Payment of RM 490.00 for AI4U Programme has been processed successfully.',
      time: '5 days ago', read: true,
    },
    {
      id: 'n9', type: 'hub', title: 'New Programme Available',
      body: 'Mereka has launched "Green Skills Programme" — explore sustainability careers.',
      time: '1 week ago', read: true, hub: 'Mereka', actionLabel: 'Explore',
    },
    {
      id: 'n10', type: 'course', title: 'Certificate Ready',
      body: 'Your certificate for "Career Strategy & Planning" is ready to download.',
      time: '2 weeks ago', read: true, actionLabel: 'Download',
    },
    {
      id: 'n11', type: 'social', title: 'Welcome to Mereka!',
      body: 'Thanks for joining. Start by exploring programmes and courses available to you.',
      time: '3 weeks ago', read: true, actionLabel: 'Get Started',
    },
  ]);

  readonly filteredNotifications = computed(() => {
    const f = this.activeFilter();
    const all = this.notifications();
    if (f === 'All') return all;
    if (f === 'Unread') return all.filter(n => !n.read);
    if (f === 'System') return all.filter(n => n.type === 'system');
    if (f === 'Courses') return all.filter(n => n.type === 'course');
    if (f === 'Hub') return all.filter(n => n.type === 'hub');
    if (f === 'Bookings') return all.filter(n => n.type === 'booking');
    return all;
  });

  readonly unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  markAllRead(): void {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
  }

  toggleRead(id: string): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: !n.read } : n)
    );
  }
}
