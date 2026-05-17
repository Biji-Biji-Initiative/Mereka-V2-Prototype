import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type BookingType = 'experiences' | 'courses' | 'expertise';
type BookingTimeFilter = 'upcoming' | 'past' | 'cancelled';
type BookingStatus = 'mostly_booked' | 'partially_booked' | 'fully_booked' | 'cancelled' | 'open';
type DeliveryMode = 'physical' | 'online';

interface Booking {
  id: string;
  title: string;
  type: BookingType;
  mode: DeliveryMode;
  host: string;
  dateLabel: string;
  status: BookingStatus;
  lastBooked: string;
  ticketsSold: number;
  ticketsTotal: number;
  profit: number;
  currency: string;
  isPast: boolean;
  isCancelled: boolean;
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; bg: string; color: string }> = {
  mostly_booked: { label: 'MOSTLY BOOKED', bg: '#FFF3E0', color: '#E65100' },
  partially_booked: { label: 'PARTIALLY BOOKED', bg: '#FFF8E1', color: '#F57F17' },
  fully_booked: { label: 'FULLY BOOKED', bg: '#E8F5E9', color: '#2E7D32' },
  cancelled: { label: 'CANCELLED', bg: '#FFEBEE', color: '#C62828' },
  open: { label: 'OPEN', bg: '#E3F2FD', color: '#1565C0' },
};

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1', title: 'AI in Action Sarawak for Teams', type: 'experiences', mode: 'physical',
    host: 'N/A', dateLabel: 'May 17, 2026, 9:00AM - 12:00PM (GMT+7)',
    status: 'mostly_booked', lastBooked: '5 hours ago', ticketsSold: 58, ticketsTotal: 80,
    profit: 0, currency: 'MYR', isPast: false, isCancelled: false,
  },
  {
    id: 'b2', title: 'AI in Action Sarawak for Leaders', type: 'experiences', mode: 'physical',
    host: 'N/A', dateLabel: 'May 16, 2026, 9:00AM - 12:00PM (GMT+7)',
    status: 'mostly_booked', lastBooked: '1 day ago', ticketsSold: 76, ticketsTotal: 80,
    profit: 0, currency: 'MYR', isPast: false, isCancelled: false,
  },
  {
    id: 'b3', title: '[AI4U x JSkills] Enhancing Professional Readiness with AI', type: 'experiences', mode: 'physical',
    host: 'Amyra Elsayafiga Binti Lisnawira Amraf', dateLabel: 'May 12, 2026, 8:00AM - 4:00PM (GMT+7)',
    status: 'mostly_booked', lastBooked: '1 week ago', ticketsSold: 119, ticketsTotal: 200,
    profit: 0, currency: 'MYR', isPast: false, isCancelled: false,
  },
  {
    id: 'b4', title: '[AI4U x INTI] Future Ready: AI Foundations', type: 'experiences', mode: 'online',
    host: 'Amyra Elsayafiga Binti Lisnawira Amraf', dateLabel: 'May 9, 2026, 8:00AM - 4:00PM (GMT+7)',
    status: 'mostly_booked', lastBooked: '1 week ago', ticketsSold: 587, ticketsTotal: 600,
    profit: 0, currency: 'MYR', isPast: false, isCancelled: false,
  },
  {
    id: 'b5', title: 'Mereka for Business: Subscriber Onboarding Essentials', type: 'experiences', mode: 'online',
    host: 'Jay Bala, Gurpreet, Nashvinder Kaur', dateLabel: 'May 3, 2026, 3:00PM - 3:45PM (GMT+7)',
    status: 'partially_booked', lastBooked: '2 weeks ago', ticketsSold: 1, ticketsTotal: 10,
    profit: 0, currency: 'MYR', isPast: false, isCancelled: false,
  },
  {
    id: 'b6', title: '[AI4U] Map Your Future with AI', type: 'experiences', mode: 'online',
    host: 'Amyra Elsayafiga, Keisha Wee', dateLabel: 'Mar 14, 2026, 9:00AM - 3:00PM (GMT+7)',
    status: 'partially_booked', lastBooked: '2 months ago', ticketsSold: 7, ticketsTotal: 100,
    profit: 0, currency: 'MYR', isPast: true, isCancelled: false,
  },
  {
    id: 'b7', title: 'Mereka AI Lab: AI in Action', type: 'experiences', mode: 'physical',
    host: 'N/A', dateLabel: 'Mar 12, 2026, 4:00PM - 6:00PM (GMT+7)',
    status: 'fully_booked', lastBooked: '2 months ago', ticketsSold: 35, ticketsTotal: 35,
    profit: 0, currency: 'MYR', isPast: true, isCancelled: false,
  },
  {
    id: 'b8', title: '[AI4UxSDEC] Digital Edge: AI for Entrepreneurs', type: 'experiences', mode: 'online',
    host: 'Amyra Elsayafiga Binti Lisnawira Amraf', dateLabel: 'Mar 12, 2026, 9:00AM - 3:00PM (GMT+7)',
    status: 'partially_booked', lastBooked: '2 months ago', ticketsSold: 117, ticketsTotal: 250,
    profit: 0, currency: 'MYR', isPast: true, isCancelled: false,
  },
  {
    id: 'b9', title: 'AI Training Session', type: 'experiences', mode: 'online',
    host: 'Gurpreet', dateLabel: 'Mar 10, 2026, 8:30AM - 9:30AM (GMT+7)',
    status: 'partially_booked', lastBooked: '2 months ago', ticketsSold: 5, ticketsTotal: 10,
    profit: 0, currency: 'MYR', isPast: true, isCancelled: false,
  },
  {
    id: 'b10', title: '[AI4U x Rotaract] AI in Action: Enhancing Future Readiness through AI', type: 'experiences', mode: 'online',
    host: 'Amyra Elsayafiga Binti Lisnawira Amraf', dateLabel: 'Mar 7, 2026, 8:00AM - 4:00PM (GMT+7)',
    status: 'mostly_booked', lastBooked: '2 months ago', ticketsSold: 105, ticketsTotal: 200,
    profit: 0, currency: 'MYR', isPast: true, isCancelled: false,
  },
  {
    id: 'b11', title: 'AI in Action Sarawak for Leaders', type: 'experiences', mode: 'physical',
    host: 'N/A', dateLabel: 'May 16, 2026, 9:00AM - 12:00PM (GMT+7)',
    status: 'partially_booked', lastBooked: '1 week ago', ticketsSold: 1, ticketsTotal: 80,
    profit: 0, currency: 'MYR', isPast: true, isCancelled: false,
  },
  {
    id: 'b12', title: '[AI4U x INTI] CareerForward: AI Essentials', type: 'experiences', mode: 'online',
    host: 'Amyra Elsayafiga Binti Lisnawira Amraf', dateLabel: 'Apr 18, 2026, 8:00AM - 4:00PM (GMT+7)',
    status: 'partially_booked', lastBooked: '1 month ago', ticketsSold: 1, ticketsTotal: 200,
    profit: 0, currency: 'MYR', isPast: true, isCancelled: false,
  },
  {
    id: 'b13', title: 'AI4U x UM: AI-Powered Graduates for the Future Workforce', type: 'experiences', mode: 'online',
    host: 'Amyra Elsayafiga Binti Lisnawira Amraf', dateLabel: 'Apr 10, 2026, 8:00AM - 11:00PM (GMT+7)',
    status: 'cancelled', lastBooked: '1 month ago', ticketsSold: 68, ticketsTotal: 200,
    profit: 0, currency: 'MYR', isPast: true, isCancelled: true,
  },
  {
    id: 'b14', title: 'AI4U x UM: AI-Powered Graduates for the Future Workforce (Session 2)', type: 'experiences', mode: 'online',
    host: 'Amyra Elsayafiga Binti Lisnawira Amraf', dateLabel: 'Apr 10, 2026, 8:00AM - 4:00PM (GMT+7)',
    status: 'cancelled', lastBooked: '1 month ago', ticketsSold: 1, ticketsTotal: 200,
    profit: 0, currency: 'MYR', isPast: true, isCancelled: true,
  },
  // Courses
  {
    id: 'b15', title: 'Generative AI Fundamentals', type: 'courses', mode: 'online',
    host: 'Mereka LMS', dateLabel: 'Self-paced (Ongoing)',
    status: 'partially_booked', lastBooked: '3 days ago', ticketsSold: 42, ticketsTotal: 500,
    profit: 0, currency: 'MYR', isPast: false, isCancelled: false,
  },
  {
    id: 'b16', title: 'Prompt Engineering Masterclass', type: 'courses', mode: 'online',
    host: 'Mereka LMS', dateLabel: 'Self-paced (Ongoing)',
    status: 'open', lastBooked: '1 week ago', ticketsSold: 18, ticketsTotal: 100,
    profit: 0, currency: 'MYR', isPast: false, isCancelled: false,
  },
  // Expertise
  {
    id: 'b17', title: 'AI Product Management 1-on-1', type: 'expertise', mode: 'online',
    host: 'Jey Bala', dateLabel: 'By appointment',
    status: 'partially_booked', lastBooked: '5 days ago', ticketsSold: 3, ticketsTotal: 10,
    profit: 150, currency: 'MYR', isPast: false, isCancelled: false,
  },
  {
    id: 'b18', title: 'Career Coaching Session', type: 'expertise', mode: 'physical',
    host: 'Rashvin Pal Singh', dateLabel: 'By appointment',
    status: 'open', lastBooked: '2 weeks ago', ticketsSold: 1, ticketsTotal: 5,
    profit: 200, currency: 'MYR', isPast: false, isCancelled: false,
  },
];

@Component({
  selector: 'mereka-dashboard-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex gap-6 w-full">
      <!-- Left filter sidebar -->
      <aside class="w-[200px] shrink-0 flex flex-col gap-4">
        <!-- Type dropdown -->
        <select
          class="w-full h-10 px-3 rounded-lg text-sm font-medium"
          style="border:1px solid #E0E0E0;background:white;color:#1A1623;outline:none"
          [ngModel]="activeType()"
          (ngModelChange)="activeType.set($event)"
        >
          <option value="experiences">Experiences</option>
          <option value="courses">Courses</option>
          <option value="expertise">Expertise</option>
        </select>

        <!-- Time filters -->
        <nav class="flex flex-col">
          <button
            *ngFor="let f of timeFilters"
            (click)="activeTime.set(f.value)"
            class="text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            [class.font-semibold]="activeTime() === f.value"
            [style.color]="activeTime() === f.value ? '#1A1623' : 'rgba(27,31,59,0.55)'"
            [style.background]="activeTime() === f.value ? '#F4F4F4' : 'transparent'"
            style="border:none;outline:none"
          >{{ f.label }}</button>
        </nav>

        <!-- Add button -->
        <button
          class="h-10 rounded-xl text-sm font-semibold text-white"
          style="background:#303345;border:none;outline:none;cursor:pointer"
        >Add an {{ activeTypeLabel() }}</button>
      </aside>

      <!-- Main content -->
      <div class="flex-1 min-w-0 flex flex-col gap-4">
        <!-- Toolbar -->
        <div class="flex items-center gap-3 flex-wrap">
          <!-- Checkbox (select all) -->
          <input type="checkbox" class="w-4 h-4 rounded" style="accent-color:#303345" />

          <!-- Search -->
          <div class="flex-1 min-w-[200px] max-w-[320px] relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#999" stroke-width="2"/>
              <path d="M16 16l4.5 4.5" stroke="#999" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input
              type="text"
              [placeholder]="'Search ' + activeTypeLabel()"
              class="w-full h-9 pl-9 pr-3 rounded-lg text-sm"
              style="border:1px solid #E0E0E0;outline:none;background:white"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
            />
          </div>

          <!-- Grouped toggle -->
          <button
            (click)="grouped.update(v => !v)"
            class="flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium"
            style="border:1px solid #E0E0E0;background:white;cursor:pointer;outline:none"
            [style.color]="grouped() ? '#2E7D32' : '#666'"
          >
            Grouped
            <svg *ngIf="grouped()" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#2E7D32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Count -->
          <span class="text-sm" style="color:rgba(27,31,59,0.55)">
            1 - {{ filteredBookings().length }} of {{ filteredBookings().length }} items
          </span>

          <div class="flex-1"></div>

          <!-- Add Booking -->
          <button
            class="h-9 px-4 rounded-lg text-sm font-medium"
            style="border:1px solid #E0E0E0;background:white;cursor:pointer;outline:none;color:#1A1623"
          >Add Booking</button>

          <!-- Export icon -->
          <button class="w-9 h-9 flex items-center justify-center rounded-lg" style="border:1px solid #E0E0E0;background:white;cursor:pointer;outline:none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M14 3v4a1 1 0 001 1h4" stroke="#666" stroke-width="2" stroke-linecap="round"/>
              <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="#666" stroke-width="2"/>
            </svg>
          </button>

          <!-- Settings icon -->
          <button class="w-9 h-9 flex items-center justify-center rounded-lg" style="border:1px solid #E0E0E0;background:white;cursor:pointer;outline:none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#666" stroke-width="2"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="#666" stroke-width="2"/>
            </svg>
          </button>
        </div>

        <!-- Booking list -->
        <div class="flex flex-col">
          <div
            *ngFor="let booking of filteredBookings(); let i = index"
            class="flex items-start gap-4 py-4 px-4 hover:bg-neutral-50 transition-colors"
            [style.border-top]="i === 0 ? '1px solid #E8E8E8' : 'none'"
            style="border-bottom:1px solid #E8E8E8"
          >
            <!-- Checkbox -->
            <input type="checkbox" class="w-4 h-4 mt-1 rounded shrink-0" style="accent-color:#303345" />

            <!-- Expand chevron -->
            <button
              class="mt-1 shrink-0"
              style="border:none;outline:none;background:none;cursor:pointer;padding:0"
              (click)="toggleExpand(booking.id)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                [style.transform]="expandedIds().has(booking.id) ? 'rotate(180deg)' : 'rotate(0)'"
                style="transition:transform 0.15s"
              >
                <path d="M4 6l4 4 4-4" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <!-- Info -->
            <div class="flex-1 min-w-0 flex flex-col gap-1">
              <span class="text-xs" style="color:rgba(27,31,59,0.45)">{{ booking.dateLabel }}</span>
              <span class="text-sm font-medium" style="color:#1A1623">{{ booking.title }}</span>
              <div class="flex items-center gap-2 text-xs" style="color:rgba(27,31,59,0.55)">
                <span class="flex items-center gap-1">
                  <svg *ngIf="booking.mode === 'physical'" width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <svg *ngIf="booking.mode === 'online'" width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  {{ booking.mode === 'physical' ? 'Physical' : 'Online' }}
                </span>
                <span>|</span>
                <span>Host: {{ booking.host }}</span>
              </div>
            </div>

            <!-- Status -->
            <div class="shrink-0 flex flex-col items-start gap-0.5 w-[130px]">
              <span class="text-[10px] font-medium tracking-wider" style="color:rgba(27,31,59,0.4)">STATUS</span>
              <span
                class="inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider"
                [style.background]="getStatusConfig(booking.status).bg"
                [style.color]="getStatusConfig(booking.status).color"
              >{{ getStatusConfig(booking.status).label }}</span>
            </div>

            <!-- Last Booked -->
            <div class="shrink-0 flex flex-col items-start gap-0.5 w-[100px]">
              <span class="text-[10px] font-medium tracking-wider" style="color:rgba(27,31,59,0.4)">LAST BOOKED</span>
              <span class="text-xs" style="color:#1A1623">{{ booking.lastBooked }}</span>
            </div>

            <!-- Tickets -->
            <div class="shrink-0 flex flex-col items-start gap-0.5 w-[80px]">
              <span class="text-[10px] font-medium tracking-wider" style="color:rgba(27,31,59,0.4)">TICKET</span>
              <div class="flex items-center gap-1">
                <span class="text-xs font-medium" style="color:#1A1623">{{ booking.ticketsSold }}/{{ booking.ticketsTotal }}</span>
                <svg *ngIf="booking.ticketsSold > 0" width="12" height="12" viewBox="0 0 24 24" fill="none" style="color:#276EF1">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>

            <!-- Profit -->
            <div class="shrink-0 flex flex-col items-start gap-0.5 w-[90px]">
              <span class="text-[10px] font-medium tracking-wider" style="color:rgba(27,31,59,0.4)">PROFIT</span>
              <span class="text-xs" style="color:#1A1623">{{ booking.currency }} {{ booking.profit | number:'1.2-2' }}</span>
            </div>

            <!-- More menu -->
            <button class="shrink-0 mt-1 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100" style="border:none;outline:none;background:none;cursor:pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5" r="1.5" fill="#666"/>
                <circle cx="12" cy="12" r="1.5" fill="#666"/>
                <circle cx="12" cy="19" r="1.5" fill="#666"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="filteredBookings().length === 0" class="flex flex-col items-center justify-center py-16 gap-3">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="color:#CCC">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="text-sm font-medium" style="color:rgba(27,31,59,0.45)">No {{ activeTypeLabel().toLowerCase() }} found</span>
          <span class="text-xs" style="color:rgba(27,31,59,0.35)">Try adjusting your filters or search query</span>
        </div>
      </div>
    </div>
  `,
})
export class DashboardBookingsPage {
  readonly timeFilters: { value: BookingTimeFilter; label: string }[] = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  readonly activeType = signal<BookingType>('experiences');
  readonly activeTime = signal<BookingTimeFilter>('upcoming');
  readonly searchQuery = signal('');
  readonly grouped = signal(true);
  readonly expandedIds = signal<Set<string>>(new Set());

  readonly activeTypeLabel = computed(() => {
    const map: Record<BookingType, string> = {
      experiences: 'Experience',
      courses: 'Course',
      expertise: 'Expertise',
    };
    return map[this.activeType()];
  });

  readonly filteredBookings = computed(() => {
    const type = this.activeType();
    const time = this.activeTime();
    const query = this.searchQuery().toLowerCase();

    return MOCK_BOOKINGS.filter((b) => {
      if (b.type !== type) return false;
      if (time === 'upcoming' && (b.isPast || b.isCancelled)) return false;
      if (time === 'past' && !b.isPast) return false;
      if (time === 'cancelled' && !b.isCancelled) return false;
      if (query && !b.title.toLowerCase().includes(query) && !b.host.toLowerCase().includes(query)) return false;
      return true;
    });
  });

  getStatusConfig(status: BookingStatus) {
    return STATUS_CONFIG[status];
  }

  toggleExpand(id: string): void {
    this.expandedIds.update((s) => {
      const copy = new Set(s);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  }
}
