import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
interface FormRow {
  id: string;
  title: string;
  status: 'Live' | 'Draft' | 'Archived';
  responses: number;
  updated: string;
  type: 'Registration' | 'Application' | 'Survey' | 'Feedback' | 'Custom';
}

@Component({
  selector: 'mereka-forms-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forms-list.page.html',
})
export class FormsListPage {
  readonly statusFilter = signal<'All' | 'Live' | 'Draft' | 'Archived'>('All');
  readonly query = signal('');

  readonly forms: FormRow[] = [
    { id: 'ai4u-app',     title: 'AI4U Programme Application',  status: 'Live',     responses: 247, updated: '2 days ago',  type: 'Application'  },
    { id: 'sxsw-rsvp',    title: 'SXSW Asia Showcase RSVP',     status: 'Live',     responses: 128, updated: '5 days ago',  type: 'Registration' },
    { id: 'biji-fb',      title: 'Biji-biji Initiative Feedback', status: 'Live',   responses: 89,  updated: '1 week ago',  type: 'Feedback'     },
    { id: 'cohort-2026',  title: 'Cohort 2026 Pre-screening',   status: 'Draft',    responses: 0,   updated: 'Today',       type: 'Application'  },
    { id: 'partner-form', title: 'Partner Onboarding Form',     status: 'Live',     responses: 34,  updated: '3 weeks ago', type: 'Custom'       },
    { id: 'workshop-y23', title: 'Workshop 2023 Survey',        status: 'Archived', responses: 412, updated: '1 year ago',  type: 'Survey'       },
  ];

  setStatus(s: 'All' | 'Live' | 'Draft' | 'Archived'): void { this.statusFilter.set(s); }
  setQuery(v: string): void { this.query.set(v); }

  visible(): FormRow[] {
    const q = this.query().toLowerCase();
    return this.forms.filter((f) =>
      (this.statusFilter() === 'All' || f.status === this.statusFilter()) &&
      (q === '' || f.title.toLowerCase().includes(q))
    );
  }
}
