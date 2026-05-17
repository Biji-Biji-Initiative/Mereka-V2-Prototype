import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
type FieldType = 'short_text' | 'long_text' | 'email' | 'phone' | 'number' | 'single_choice' | 'multi_choice' | 'dropdown' | 'date' | 'file' | 'rating' | 'section_break';

interface Field {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  description?: string;
}

const FIELD_LIBRARY: { type: FieldType; label: string; icon: string }[] = [
  { type: 'short_text',    label: 'Short answer',    icon: 'T' },
  { type: 'long_text',     label: 'Long answer',     icon: '¶' },
  { type: 'email',         label: 'Email',           icon: '@' },
  { type: 'phone',         label: 'Phone',           icon: '☎' },
  { type: 'number',        label: 'Number',          icon: '#' },
  { type: 'single_choice', label: 'Single choice',   icon: '○' },
  { type: 'multi_choice',  label: 'Multi choice',    icon: '☑' },
  { type: 'dropdown',      label: 'Dropdown',        icon: '▾' },
  { type: 'date',          label: 'Date',            icon: '📅' },
  { type: 'file',          label: 'File upload',     icon: '⬆' },
  { type: 'rating',        label: 'Rating',          icon: '★' },
  { type: 'section_break', label: 'Section break',   icon: '—' },
];

@Component({
  selector: 'mereka-form-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-builder.page.html',
})
export class FormBuilderPage {
  private readonly route = inject(ActivatedRoute);
  readonly id = toSignal(this.route.paramMap, { initialValue: null });

  readonly tab = signal<'build' | 'design' | 'settings' | 'share'>('build');
  setTab(t: 'build' | 'design' | 'settings' | 'share'): void { this.tab.set(t); }

  readonly title = signal('Untitled Form');
  readonly description = signal('');

  readonly fields = signal<Field[]>([
    { id: 'f1', type: 'short_text', label: 'Full name', placeholder: 'e.g. Nicholas Hon', required: true },
    { id: 'f2', type: 'email',      label: 'Email address', placeholder: 'you@mereka.io', required: true },
    { id: 'f3', type: 'single_choice', label: 'Which programme are you interested in?', required: true, options: ['AI4U', 'Career Accelerator', 'Future of Work', 'Other'] },
    { id: 'f4', type: 'long_text',  label: 'Why do you want to join?', placeholder: 'Tell us about your goals…' },
  ]);

  readonly selectedFieldId = signal<string | null>('f1');
  readonly library = FIELD_LIBRARY;

  readonly selectedField = computed(() => this.fields().find((f) => f.id === this.selectedFieldId()) ?? null);

  addField(type: FieldType): void {
    const id = 'f' + Math.random().toString(36).slice(2, 8);
    const label = FIELD_LIBRARY.find((l) => l.type === type)?.label ?? 'New field';
    const options = (['single_choice','multi_choice','dropdown'] as FieldType[]).includes(type) ? ['Option 1', 'Option 2'] : undefined;
    this.fields.update((arr) => [...arr, { id, type, label, options }]);
    this.selectedFieldId.set(id);
  }
  deleteField(id: string): void {
    this.fields.update((arr) => arr.filter((f) => f.id !== id));
    if (this.selectedFieldId() === id) this.selectedFieldId.set(null);
  }
  duplicateField(id: string): void {
    this.fields.update((arr) => {
      const i = arr.findIndex((f) => f.id === id);
      if (i < 0) return arr;
      const clone = { ...arr[i], id: 'f' + Math.random().toString(36).slice(2, 8) };
      return [...arr.slice(0, i + 1), clone, ...arr.slice(i + 1)];
    });
  }
  moveField(id: string, dir: -1 | 1): void {
    this.fields.update((arr) => {
      const i = arr.findIndex((f) => f.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return arr;
      const next = [...arr];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  selectField(id: string): void { this.selectedFieldId.set(id); }

  updateSelectedField(patch: Partial<Field>): void {
    const id = this.selectedFieldId();
    if (!id) return;
    this.fields.update((arr) => arr.map((f) => f.id === id ? { ...f, ...patch } : f));
  }

  fieldIcon(type: FieldType): string {
    return FIELD_LIBRARY.find((l) => l.type === type)?.icon ?? '?';
  }
}
