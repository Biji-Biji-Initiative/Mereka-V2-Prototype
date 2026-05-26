import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardSidebarComponent } from '../../components/dashboard-sidebar.component';

type PageType = 'welcome' | 'short_text' | 'long_text' | 'email' | 'phone' | 'number'
              | 'single_choice' | 'multi_choice' | 'dropdown' | 'date' | 'file' | 'rating'
              | 'statement' | 'end_screen';

interface FormPage {
  id: string;
  type: PageType;
  label: string;
  title: string;
  description?: string;
  buttonLabel?: string;
  mediaUrl?: string;
  required?: boolean;
  options?: string[];
}

const PAGE_LIBRARY: { type: PageType; label: string; icon: string }[] = [
  { type: 'welcome',       label: 'Welcome screen',    icon: '👋' },
  { type: 'statement',     label: 'Statement',         icon: '📣' },
  { type: 'short_text',    label: 'Short answer',      icon: 'T' },
  { type: 'long_text',     label: 'Long answer',       icon: '¶' },
  { type: 'email',         label: 'Email',             icon: '@' },
  { type: 'phone',         label: 'Phone',             icon: '☎' },
  { type: 'number',        label: 'Number',            icon: '#' },
  { type: 'single_choice', label: 'Single choice',     icon: '○' },
  { type: 'multi_choice',  label: 'Multi choice',      icon: '☑' },
  { type: 'dropdown',      label: 'Dropdown',          icon: '▾' },
  { type: 'date',          label: 'Date',              icon: '📅' },
  { type: 'file',          label: 'File upload',       icon: '⬆' },
  { type: 'rating',        label: 'Rating',            icon: '★' },
  { type: 'end_screen',    label: 'End screen',        icon: '🏁' },
];

@Component({
  selector: 'mereka-form-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DashboardSidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-builder.page.html',
})
export class FormBuilderPage {
  private readonly route = inject(ActivatedRoute);
  readonly id = toSignal(this.route.paramMap, { initialValue: null });

  readonly tab = signal<'content' | 'connect' | 'share' | 'results'>('content');
  setTab(t: 'content' | 'connect' | 'share' | 'results'): void { this.tab.set(t); }

  readonly title = signal('My New Form');

  readonly pages = signal<FormPage[]>([
    {
      id: 'p1', type: 'welcome', label: 'Welcome screen',
      title: 'Hi! Welcome to...', description: 'Description (Optional)', buttonLabel: 'Start',
    },
  ]);

  readonly selectedPageId = signal<string | null>('p1');
  readonly library = PAGE_LIBRARY;
  readonly showAddPagePicker = signal(false);

  readonly selectedPage = computed(() => this.pages().find((p) => p.id === this.selectedPageId()) ?? null);

  selectPage(id: string): void {
    this.selectedPageId.set(id);
  }

  addPage(type: PageType): void {
    const id = 'p' + Math.random().toString(36).slice(2, 8);
    const libItem = PAGE_LIBRARY.find((l) => l.type === type);
    const label = libItem?.label ?? 'New page';
    const titleDefaults: Partial<Record<PageType, string>> = {
      welcome:       'Hi! Welcome to...',
      statement:     'A short message for your respondents',
      short_text:    'Your question here',
      long_text:     'Your long-form question',
      email:         'What’s your email?',
      phone:         'What’s your phone number?',
      number:        'Enter a number',
      single_choice: 'Pick one option',
      multi_choice:  'Pick all that apply',
      dropdown:      'Select an option',
      date:          'Pick a date',
      file:          'Upload a file',
      rating:        'How would you rate this?',
      end_screen:    'Thanks for completing the form!',
    };
    const opts = (['single_choice','multi_choice','dropdown'] as PageType[]).includes(type)
      ? ['Option 1', 'Option 2', 'Option 3']
      : undefined;
    const page: FormPage = {
      id,
      type,
      label,
      title: titleDefaults[type] ?? label,
      description: type === 'welcome' || type === 'statement' ? 'Description (Optional)' : undefined,
      buttonLabel: type === 'welcome' ? 'Start' : type === 'end_screen' ? 'Done' : undefined,
      options: opts,
    };
    this.pages.update((arr) => [...arr, page]);
    this.selectedPageId.set(id);
    this.showAddPagePicker.set(false);
  }

  removePage(id: string): void {
    this.pages.update((arr) => arr.filter((p) => p.id !== id));
    if (this.selectedPageId() === id) {
      this.selectedPageId.set(this.pages()[0]?.id ?? null);
    }
  }
  duplicatePage(id: string): void {
    this.pages.update((arr) => {
      const i = arr.findIndex((p) => p.id === id);
      if (i < 0) return arr;
      const clone = { ...arr[i], id: 'p' + Math.random().toString(36).slice(2, 8), label: arr[i].label + ' (copy)' };
      return [...arr.slice(0, i + 1), clone, ...arr.slice(i + 1)];
    });
  }
  movePage(id: string, dir: -1 | 1): void {
    this.pages.update((arr) => {
      const i = arr.findIndex((p) => p.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return arr;
      const next = [...arr];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  updateSelectedPage(patch: Partial<FormPage>): void {
    const id = this.selectedPageId();
    if (!id) return;
    this.pages.update((arr) => arr.map((p) => p.id === id ? { ...p, ...patch } : p));
  }

  pageIcon(type: PageType): string {
    return PAGE_LIBRARY.find((l) => l.type === type)?.icon ?? '?';
  }
}
