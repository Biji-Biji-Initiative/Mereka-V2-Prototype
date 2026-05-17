import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
/* ── mock data interfaces ─────────────────────────────────────── */
interface BroadcastTemplate {
  id: string;
  name: string;
  channel: 'WhatsApp' | 'Email';
  lastUpdated: string;
  category: string;
  language: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Draft';
}

interface MessageHistoryItem {
  id: string;
  name: string;
  channel: 'WhatsApp' | 'Email';
  status: 'Sent' | 'Scheduled' | 'Failed';
  sentAt: string;
  category: string;
}

@Component({
  selector: 'mereka-broadcast-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="broadcast-main">
        <!-- Page header -->
        <div class="page-header">
          <div>
            <h1 class="page-title">Broadcast Message</h1>
            <p class="page-subtitle">Send announcements, reminders, and updates to selected learners across WhatsApp and emails.</p>
          </div>
          <button class="btn-settings">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.86 1.33h2.28l.35 1.76.16.08c.36.16.69.36.98.6l.14.11 1.7-.6 1.14 1.97-1.35 1.17.02.18c.02.2.02.4 0 .6l-.02.18 1.35 1.17-1.14 1.97-1.7-.6-.14.11c-.3.24-.62.44-.98.6l-.16.08-.35 1.76H6.86l-.35-1.76-.16-.08a4.3 4.3 0 0 1-.98-.6l-.14-.11-1.7.6-1.14-1.97 1.35-1.17-.02-.18a4.3 4.3 0 0 1 0-.6l.02-.18-1.35-1.17 1.14-1.97 1.7.6.14-.11c.3-.24.62-.44.98-.6l.16-.08.35-1.76ZM8 5.33a2.67 2.67 0 1 0 0 5.34A2.67 2.67 0 0 0 8 5.33Z" stroke="currentColor" stroke-width="1.2"/></svg>
            Settings
          </button>
        </div>

        <!-- Tabs -->
        <div class="tabs-row">
          <div class="tabs">
            <button
              class="tab"
              [class.tab-active]="activeTab() === 'templates'"
              (click)="activeTab.set('templates')">
              Templates
            </button>
            <button
              class="tab"
              [class.tab-active]="activeTab() === 'history'"
              (click)="activeTab.set('history')">
              Message history
            </button>
          </div>
          <a routerLink="templates/new" class="btn-primary" *ngIf="activeTab() === 'templates'">
            + Create new template
          </a>
          <a routerLink="new" class="btn-primary" *ngIf="activeTab() === 'history'">
            + New message
          </a>
        </div>

        <!-- ═══════ TEMPLATES TAB ═══════ -->
        <section class="card" *ngIf="activeTab() === 'templates'">
          <div class="card-header">
            <h2 class="card-title">Templates</h2>
            <div class="card-header-actions">
              <!-- Filter chips -->
              <div class="filter-chips">
                <button
                  *ngFor="let f of templateFilters"
                  class="chip"
                  [class.chip-active]="activeTemplateFilter() === f"
                  (click)="activeTemplateFilter.set(f)">
                  {{ f }}
                </button>
              </div>
              <div class="search-box">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#9CA0A6" stroke-width="1.2"/><path d="m11 11 3.5 3.5" stroke="#9CA0A6" stroke-width="1.2" stroke-linecap="round"/></svg>
                <input type="text" placeholder="Search templates..." [(ngModel)]="templateSearch" class="search-input" />
              </div>
            </div>
          </div>

          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" class="cb" /></th>
                  <th>Template Name</th>
                  <th>Channel</th>
                  <th>Last Updated</th>
                  <th>Category</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let t of filteredTemplates(); let i = index">
                  <td><input type="checkbox" class="cb" /></td>
                  <td class="cell-name">{{ t.name }}</td>
                  <td>{{ t.channel }}</td>
                  <td>{{ t.lastUpdated }}</td>
                  <td>{{ t.category }}</td>
                  <td>{{ t.language }}</td>
                  <td>
                    <span class="status-badge" [attr.data-status]="t.status.toLowerCase()">
                      {{ t.status }}
                    </span>
                  </td>
                  <td class="cell-actions">
                    <button class="btn-outline-sm">Use template</button>
                    <div class="dropdown-wrap">
                      <button class="btn-icon" (click)="toggleDropdown(i)">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="3" r="1.2" fill="#1B1F3B"/><circle cx="8" cy="8" r="1.2" fill="#1B1F3B"/><circle cx="8" cy="13" r="1.2" fill="#1B1F3B"/></svg>
                      </button>
                      <div class="dropdown-menu" *ngIf="openDropdown() === i">
                        <button class="dropdown-item" (click)="closeDropdown()">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.2"/><path d="m1 5 7 4 7-4" stroke="currentColor" stroke-width="1.2"/></svg>
                          Use template
                        </button>
                        <button class="dropdown-item" disabled (click)="closeDropdown()">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9.5 2H4.5A1.5 1.5 0 0 0 3 3.5v9A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5V5.5L9.5 2Z" stroke="#9CA0A6" stroke-width="1.2"/><path d="M9 2v4h4M6 9h4M6 11h2" stroke="#9CA0A6" stroke-width="1.2" stroke-linecap="round"/></svg>
                          Edit template
                        </button>
                        <button class="dropdown-item" (click)="closeDropdown()">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="3" width="8" height="10" rx="1" stroke="currentColor" stroke-width="1.2"/><path d="M7 3V1h6v10h-2" stroke="currentColor" stroke-width="1.2"/></svg>
                          Duplicate
                        </button>
                        <button class="dropdown-item" (click)="closeDropdown()">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="8" r="2" fill="currentColor"/></svg>
                          View details
                        </button>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item dropdown-item-danger" (click)="closeDropdown()">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M6 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5 6v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V6" stroke="#E53935" stroke-width="1.2" stroke-linecap="round"/></svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-footer">
            <span class="showing-text">Showing 1-{{ filteredTemplates().length }} of {{ filteredTemplates().length }}</span>
            <div class="pagination">
              <button class="page-btn" disabled>&lt;</button>
              <button class="page-btn page-btn-active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <button class="page-btn">&gt;</button>
            </div>
          </div>
        </section>

        <!-- ═══════ MESSAGE HISTORY TAB ═══════ -->
        <section class="card" *ngIf="activeTab() === 'history'">
          <div class="card-header">
            <h2 class="card-title">Message history</h2>
            <div class="card-header-actions">
              <div class="search-box">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#9CA0A6" stroke-width="1.2"/><path d="m11 11 3.5 3.5" stroke="#9CA0A6" stroke-width="1.2" stroke-linecap="round"/></svg>
                <input type="text" placeholder="Search messages..." [(ngModel)]="historySearch" class="search-input" />
              </div>
            </div>
          </div>

          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" class="cb" /></th>
                  <th>Message Name</th>
                  <th>Channel</th>
                  <th>Status</th>
                  <th>Sent at</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let m of filteredHistory()">
                  <td><input type="checkbox" class="cb" /></td>
                  <td class="cell-name">{{ m.name }}</td>
                  <td>{{ m.channel }}</td>
                  <td>
                    <span class="status-badge" [attr.data-status]="m.status.toLowerCase()">
                      {{ m.status }}
                    </span>
                  </td>
                  <td>{{ m.sentAt }}</td>
                  <td>{{ m.category }}</td>
                  <td class="cell-actions">
                    <button class="btn-outline-sm">View</button>
                    <button class="btn-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="3" r="1.2" fill="#1B1F3B"/><circle cx="8" cy="8" r="1.2" fill="#1B1F3B"/><circle cx="8" cy="13" r="1.2" fill="#1B1F3B"/></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-footer">
            <span class="showing-text">Showing 1-{{ filteredHistory().length }} of {{ filteredHistory().length }}</span>
            <div class="pagination">
              <button class="page-btn" disabled>&lt;</button>
              <button class="page-btn page-btn-active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <button class="page-btn">&gt;</button>
            </div>
          </div>
        </section>
    </div>

    <!-- Backdrop for dropdown close -->
    <div class="backdrop" *ngIf="openDropdown() !== null" (click)="closeDropdown()"></div>

    <style>
      /* ── layout ──────────────────────────── */
      .broadcast-main { padding: 0; max-width: 1200px; }

      /* ── page header ─────────────────────── */
      .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
      .page-title { font-size: 28px; font-weight: 700; color: #1B1F3B; margin: 0 0 4px; }
      .page-subtitle { font-size: 14px; color: rgba(27,31,59,0.6); margin: 0; }
      .btn-settings { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid #E0E0E0; border-radius: 8px; background: #fff; font-size: 13px; color: #1B1F3B; cursor: pointer; }
      .btn-settings:hover { background: #F6F6F8; }

      /* ── tabs ─────────────────────────────── */
      .tabs-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      .tabs { display: flex; gap: 4px; }
      .tab { padding: 8px 20px; border-radius: 8px; border: none; background: transparent; font-size: 14px; font-weight: 500; color: rgba(27,31,59,0.6); cursor: pointer; }
      .tab-active { background: #1B1F3B; color: #fff; }
      .btn-primary { display: inline-flex; align-items: center; gap: 4px; padding: 10px 20px; border-radius: 8px; background: #1B1F3B; color: #fff; font-size: 13px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; }
      .btn-primary:hover { background: #2d3258; }

      /* ── card ─────────────────────────────── */
      .card { background: #fff; border-radius: 12px; border: 1px solid #ECECEE; }
      .card-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #ECECEE; flex-wrap: wrap; gap: 12px; }
      .card-title { font-size: 16px; font-weight: 600; color: #1B1F3B; margin: 0; }
      .card-header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

      /* ── filter chips ────────────────────── */
      .filter-chips { display: flex; gap: 6px; }
      .chip { padding: 4px 12px; border-radius: 20px; border: 1px solid #E0E0E0; background: #fff; font-size: 12px; color: rgba(27,31,59,0.7); cursor: pointer; white-space: nowrap; }
      .chip:hover { border-color: #aaa; }
      .chip-active { background: #1B1F3B; color: #fff; border-color: #1B1F3B; }

      /* ── search ──────────────────────────── */
      .search-box { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border: 1px solid #E0E0E0; border-radius: 8px; background: #fff; }
      .search-input { border: none; outline: none; font-size: 13px; background: transparent; width: 140px; }

      /* ── table ────────────────────────────── */
      .table-wrap { overflow-x: auto; }
      .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .data-table th { text-align: left; padding: 12px 16px; color: rgba(27,31,59,0.5); font-weight: 500; border-bottom: 1px solid #ECECEE; white-space: nowrap; }
      .data-table td { padding: 14px 16px; border-bottom: 1px solid #F4F4F4; color: #1B1F3B; }
      .cell-name { font-weight: 500; }
      .cb { width: 16px; height: 16px; accent-color: #1B1F3B; cursor: pointer; }

      /* ── status badge ────────────────────── */
      .status-badge { padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
      .status-badge[data-status="approved"] { background: #E8F5E9; color: #2E7D32; }
      .status-badge[data-status="pending"] { background: #FFF8E1; color: #F57F17; }
      .status-badge[data-status="rejected"] { background: #FFEBEE; color: #C62828; }
      .status-badge[data-status="draft"] { background: #F5F5F5; color: #757575; }
      .status-badge[data-status="sent"] { background: #E8F5E9; color: #2E7D32; }
      .status-badge[data-status="scheduled"] { background: #E3F2FD; color: #1565C0; }
      .status-badge[data-status="failed"] { background: #FFEBEE; color: #C62828; }

      /* ── action buttons ──────────────────── */
      .cell-actions { display: flex; align-items: center; gap: 8px; }
      .btn-outline-sm { padding: 5px 14px; border: 1px solid #E0E0E0; border-radius: 6px; background: #fff; font-size: 12px; color: #1B1F3B; cursor: pointer; white-space: nowrap; }
      .btn-outline-sm:hover { background: #F6F6F8; }
      .btn-icon { background: none; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; }

      /* ── dropdown ─────────────────────────── */
      .dropdown-wrap { position: relative; }
      .dropdown-menu { position: absolute; right: 0; top: 100%; z-index: 100; background: #fff; border: 1px solid #E0E0E0; border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); min-width: 180px; padding: 6px 0; }
      .dropdown-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 16px; border: none; background: none; font-size: 13px; color: #1B1F3B; cursor: pointer; text-align: left; }
      .dropdown-item:hover { background: #F6F6F8; }
      .dropdown-item:disabled { color: #bbb; cursor: default; }
      .dropdown-item:disabled:hover { background: none; }
      .dropdown-item-danger { color: #E53935 !important; }
      .dropdown-divider { height: 1px; background: #ECECEE; margin: 4px 0; }
      .backdrop { position: fixed; inset: 0; z-index: 50; }

      /* ── table footer / pagination ───────── */
      .table-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px 24px; }
      .showing-text { font-size: 12px; color: rgba(27,31,59,0.5); }
      .pagination { display: flex; gap: 4px; }
      .page-btn { width: 32px; height: 32px; border: 1px solid #E0E0E0; border-radius: 6px; background: #fff; font-size: 12px; color: #1B1F3B; cursor: pointer; display: flex; align-items: center; justify-content: center; }
      .page-btn:disabled { color: #ccc; cursor: default; }
      .page-btn-active { background: #1B1F3B; color: #fff; border-color: #1B1F3B; }
    </style>
  `,
})
export class BroadcastListPage {
  readonly activeTab = signal<'templates' | 'history'>('templates');
  readonly templateFilters = ['All', 'WhatsApp', 'Email', 'Onboarding', 'Reminder'] as const;
  readonly activeTemplateFilter = signal<string>('All');
  readonly openDropdown = signal<number | null>(null);

  templateSearch = '';
  historySearch = '';

  /* ── mock templates ──────────────────── */
  readonly templates: BroadcastTemplate[] = [
    { id: '1', name: 'Onboarding template',  channel: 'WhatsApp', lastUpdated: '52 minutes ago', category: 'Onboarding', language: 'English', status: 'Approved' },
    { id: '2', name: 'Event Reminder',        channel: 'Email',    lastUpdated: '1 hr ago',       category: 'Marketing',   language: 'English', status: 'Approved' },
    { id: '3', name: 'Event Reminders',       channel: 'WhatsApp', lastUpdated: '2 days ago',     category: 'Reminder',    language: 'English', status: 'Approved' },
    { id: '4', name: 'Meeting Schedule',      channel: 'Email',    lastUpdated: '13/3/2024',      category: 'Marketing',   language: 'English', status: 'Approved' },
    { id: '5', name: 'Project Deadline',      channel: 'Email',    lastUpdated: '4/11/2023',      category: 'Marketing',   language: 'English', status: 'Approved' },
    { id: '6', name: 'Taxes Coding',          channel: 'WhatsApp', lastUpdated: '10/9/2024',      category: 'Onboarding',  language: 'English', status: 'Pending'  },
    { id: '7', name: 'Quarterly Review',      channel: 'Email',    lastUpdated: '4/11/2023',      category: 'Programme',   language: 'English', status: 'Approved' },
    { id: '8', name: 'Training Session',      channel: 'Email',    lastUpdated: '4/11/2023',      category: 'Marketing',   language: 'English', status: 'Approved' },
  ];

  readonly filteredTemplates = computed(() => {
    const f = this.activeTemplateFilter();
    const s = this.templateSearch.toLowerCase();
    return this.templates.filter((t) => {
      const matchFilter = f === 'All' || t.channel === f || t.category === f;
      const matchSearch = !s || t.name.toLowerCase().includes(s);
      return matchFilter && matchSearch;
    });
  });

  /* ── mock history ────────────────────── */
  readonly history: MessageHistoryItem[] = [
    { id: '1', name: 'Onboarding template',   channel: 'WhatsApp', status: 'Scheduled', sentAt: '3/10/2024, 12:00',  category: 'Onboarding' },
    { id: '2', name: 'Programme completion',   channel: 'Email',    status: 'Sent',      sentAt: '3/10/2024, 13:00',  category: 'Marketing'  },
    { id: '3', name: 'Event Reminder',         channel: 'WhatsApp', status: 'Sent',      sentAt: '3/10/2024, 21:00',  category: 'Reminder'   },
    { id: '4', name: 'Event Reminder',         channel: 'WhatsApp', status: 'Sent',      sentAt: '3/10/2024, 17:30',  category: 'Reminder'   },
  ];

  readonly filteredHistory = computed(() => {
    const s = this.historySearch.toLowerCase();
    return this.history.filter((m) => !s || m.name.toLowerCase().includes(s));
  });

  toggleDropdown(i: number): void {
    this.openDropdown.set(this.openDropdown() === i ? null : i);
  }
  closeDropdown(): void {
    this.openDropdown.set(null);
  }
}
