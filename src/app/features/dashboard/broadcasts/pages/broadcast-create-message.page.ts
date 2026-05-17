import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface TemplateRow {
  id: string;
  name: string;
  channel: 'WhatsApp' | 'Email';
  lastUpdated: string;
  category: string;
  language: string;
  status: string;
}

@Component({
  selector: 'mereka-broadcast-create-message',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wizard-layout">
      <!-- Left nav -->
      <aside class="wizard-nav">
        <a routerLink="/dashboard/broadcasts" class="wizard-back">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 15l-5-5 5-5" stroke="#1B1F3B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <h2 class="wizard-title">Create message</h2>
        <nav class="step-nav">
          <button *ngFor="let s of steps; let i = index"
            class="step-item"
            [class.step-active]="currentStep() === i"
            [class.step-done]="i < currentStep()"
            (click)="goToStep(i)">
            {{ s }}
          </button>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="wizard-main">
        <!-- ═══ STEP 0: AUDIENCE ═══ -->
        <section class="card" *ngIf="currentStep() === 0">
          <h2 class="card-title">Audience</h2>
          <p class="card-desc">Choose which group of users will receive this broadcast.</p>

          <div class="field-row">
            <div class="field field-half">
              <label class="field-label">Service category</label>
              <select class="field-select" [(ngModel)]="serviceCategory">
                <option value="">Select programme or experience</option>
                <option value="ai4u">AI Accelerator (AI4U)</option>
                <option value="career">Career Accelerator</option>
                <option value="bike">Bike Sizing Workshop</option>
              </select>
            </div>
            <div class="field field-half">
              <label class="field-label">Cohort</label>
              <select class="field-select" [(ngModel)]="cohort">
                <option value="">Select cohort</option>
                <option value="apr2026">Cohort APR 2026</option>
                <option value="mar2026">Cohort MAR 2026</option>
                <option value="feb2026">Cohort FEB 2026</option>
              </select>
            </div>
          </div>

          <!-- Cohort chips -->
          <div class="field" *ngIf="selectedCohorts().length">
            <label class="field-label">Cohorts ({{ selectedCohorts().length }})</label>
            <div class="chip-list">
              <span *ngFor="let c of selectedCohorts(); let i = index" class="cohort-chip">
                <span class="cohort-chip-name">{{ c.name }}</span>
                <span class="cohort-chip-meta">{{ c.type }} &bull; {{ c.cohort }}</span>
                <button class="chip-remove" (click)="removeCohort(i)">&times;</button>
              </span>
            </div>
          </div>

          <!-- Recipient list -->
          <div class="field">
            <label class="field-label">Recipient list ({{ recipients().length }})</label>
            <div class="search-box" style="margin-bottom:12px;">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#9CA0A6" stroke-width="1.2"/><path d="m11 11 3.5 3.5" stroke="#9CA0A6" stroke-width="1.2" stroke-linecap="round"/></svg>
              <input type="text" placeholder="Search email" class="search-input" [(ngModel)]="recipientSearch" />
            </div>
            <div class="recipient-chips">
              <span *ngFor="let r of recipients(); let i = index" class="recipient-chip">
                {{ r }}
                <button class="chip-remove" (click)="removeRecipient(i)">&times;</button>
              </span>
            </div>
          </div>

          <div class="step-footer">
            <div></div>
            <button class="btn-primary" (click)="nextStep()">Save & Continue</button>
          </div>
        </section>

        <!-- ═══ STEP 1: CONTENT ═══ -->
        <section class="card" *ngIf="currentStep() === 1">
          <h2 class="card-title">Content</h2>
          <p class="card-desc">Choose which group of users will receive this broadcast.</p>

          <!-- Channel selection -->
          <div class="field">
            <label class="field-label">Select message channel</label>
            <div class="channel-options">
              <label class="channel-option" [class.channel-active]="msgChannel() === 'email'" (click)="msgChannel.set('email')">
                <span>Email</span>
                <span class="radio" [class.radio-checked]="msgChannel() === 'email'"></span>
              </label>
              <label class="channel-option" [class.channel-active]="msgChannel() === 'whatsapp'" (click)="msgChannel.set('whatsapp')">
                <span>Whatsapp</span>
                <span class="radio" [class.radio-checked]="msgChannel() === 'whatsapp'"></span>
              </label>
              <p class="channel-hint">Messages sent via WhatsApp will only be delivered to recipients with an active WhatsApp account.</p>
            </div>
          </div>

          <!-- Template picker (shows when channel selected) -->
          <div class="field" *ngIf="msgChannel()">
            <h3 class="section-title">Select approved template</h3>
            <p class="card-desc">Choose which template to use for your message.</p>

            <div class="template-picker-header">
              <div class="filter-chips">
                <span class="chip-label">Templates</span>
                <span *ngFor="let f of templateFilterChips" class="chip chip-active">
                  {{ f }} <button class="chip-x">&times;</button>
                </span>
              </div>
              <div class="search-box">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#9CA0A6" stroke-width="1.2"/><path d="m11 11 3.5 3.5" stroke="#9CA0A6" stroke-width="1.2" stroke-linecap="round"/></svg>
                <input type="text" placeholder="Search templates..." class="search-input" />
              </div>
            </div>

            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Template Name</th>
                    <th>Channel</th>
                    <th>Last Updated</th>
                    <th>Category</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let t of availableTemplates" [class.row-selected]="selectedTemplate() === t.id">
                    <td class="cell-name">{{ t.name }}</td>
                    <td>{{ t.channel }}</td>
                    <td>{{ t.lastUpdated }}</td>
                    <td>{{ t.category }}</td>
                    <td>{{ t.language }}</td>
                    <td><span class="status-badge" data-status="approved">{{ t.status }}</span></td>
                    <td>
                      <span class="radio" [class.radio-checked]="selectedTemplate() === t.id" (click)="selectedTemplate.set(t.id)"></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Message content editor -->
          <div class="message-content-section" *ngIf="selectedTemplate()">
            <h3 class="section-title">Message content</h3>

            <div class="field">
              <label class="field-label">Version name</label>
              <input type="text" class="field-input" placeholder="E.g. onboarding message 1" [(ngModel)]="versionName" />
            </div>

            <div class="field">
              <label class="field-label">Subject</label>
              <input type="text" class="field-input" [(ngModel)]="msgSubject" placeholder="Welcome to Mereka Programme" />
            </div>

            <div class="field">
              <label class="field-label">Preheader</label>
              <input type="text" class="field-input" [(ngModel)]="msgPreheader" placeholder="Your learning journey starts here..." />
            </div>

            <div class="field">
              <div class="field-label-row">
                <label class="field-label">Message Body</label>
                <button class="btn-add-var" (click)="showMsgVarMenu.set(!showMsgVarMenu())">Add variable</button>
              </div>
              <div class="var-menu" *ngIf="showMsgVarMenu()">
                <button *ngFor="let v of variables" class="var-item" (click)="insertMsgVar(v)">{{ '{{' + v + '}}' }}</button>
              </div>
              <textarea class="field-textarea" [(ngModel)]="msgBody" rows="6" placeholder="'prefilled message from template'"></textarea>
              <p class="var-hint">Use variables: <code *ngFor="let v of variables; let last = last">{{ '{{' + v + '}}' }}{{ last ? '' : ' &nbsp;' }}</code></p>
            </div>
          </div>

          <div class="step-footer">
            <div></div>
            <button class="btn-primary" (click)="nextStep()">Save & Continue</button>
          </div>
        </section>

        <!-- ═══ STEP 2: PREVIEW ═══ -->
        <section class="card" *ngIf="currentStep() === 2">
          <h2 class="card-title">Preview</h2>
          <div class="preview-box">
            <div class="email-preview-header" *ngIf="msgSubject">
              <strong>Subject:</strong> {{ msgSubject }}
            </div>
            <div class="email-preview-preheader" *ngIf="msgPreheader">
              <strong>Preheader:</strong> {{ msgPreheader }}
            </div>
            <div class="email-preview-body">
              {{ msgBody || '(Preview will appear here based on your template and content)' }}
            </div>
          </div>

          <div class="step-footer">
            <div></div>
            <button class="btn-primary" (click)="nextStep()">Save & Continue</button>
          </div>
        </section>

        <!-- ═══ STEP 3: SCHEDULE ═══ -->
        <section class="card" *ngIf="currentStep() === 3">
          <h2 class="card-title">Schedule</h2>
          <p class="card-desc">Schedule when to send out your message</p>

          <div class="field">
            <label class="field-label">When do you want to send out your message?</label>
            <div class="channel-options">
              <label class="channel-option" [class.channel-active]="scheduleType() === 'now'" (click)="scheduleType.set('now')">
                <span>Send immediately</span>
                <span class="radio" [class.radio-checked]="scheduleType() === 'now'"></span>
              </label>
              <label class="channel-option" [class.channel-active]="scheduleType() === 'later'" (click)="scheduleType.set('later')">
                <span>Schedule for later</span>
                <span class="radio" [class.radio-checked]="scheduleType() === 'later'"></span>
              </label>
            </div>
          </div>

          <!-- Date/time picker for scheduled -->
          <div class="field-row" *ngIf="scheduleType() === 'later'">
            <div class="field field-half">
              <label class="field-label">Schedule date & time</label>
              <input type="date" class="field-input" [(ngModel)]="scheduleDate" />
            </div>
            <div class="field field-half">
              <label class="field-label">&nbsp;</label>
              <input type="time" class="field-input" [(ngModel)]="scheduleTime" />
            </div>
          </div>

          <!-- Summary card -->
          <div class="summary-card">
            <h3 class="summary-title">Summary</h3>
            <div class="summary-row"><span class="summary-label">Template:</span> <strong>{{ getSelectedTemplateName() }}</strong></div>
            <div class="summary-row"><span class="summary-label">Recipients:</span> <span class="summary-link">{{ recipients().length }}</span></div>
            <div class="summary-row"><span class="summary-label">Channel:</span> <strong>{{ msgChannel() === 'email' ? 'Email' : 'WhatsApp' }}</strong></div>
            <div class="summary-row">
              <span class="summary-label">Timing:</span>
              <strong *ngIf="scheduleType() === 'now'">Send immediately</strong>
              <span *ngIf="scheduleType() === 'later'" class="summary-link">Send at {{ scheduleDate }} {{ scheduleTime }}</span>
            </div>
          </div>

          <div class="step-footer">
            <div></div>
            <button class="btn-primary" (click)="scheduleMessage()">Schedule message</button>
          </div>
        </section>
      </main>
    </div>

    <style>
      /* ── wizard layout ───────────────────── */
      .wizard-layout { display: flex; min-height: calc(100vh - 64px); background: #F6F6F8; }
      .wizard-nav { width: 200px; padding: 24px; flex-shrink: 0; }
      .wizard-back { display: inline-flex; margin-bottom: 16px; color: #1B1F3B; }
      .wizard-title { font-size: 18px; font-weight: 700; color: #1B1F3B; margin: 0 0 24px; }
      .step-nav { display: flex; flex-direction: column; gap: 4px; }
      .step-item { text-align: left; padding: 10px 16px; border: none; border-radius: 8px; background: transparent; font-size: 14px; font-weight: 500; color: rgba(27,31,59,0.5); cursor: pointer; }
      .step-item:hover { background: #ECECEE; }
      .step-active { background: #1B1F3B !important; color: #fff !important; }
      .step-done { color: #1B1F3B; }

      .wizard-main { flex: 1; padding: 24px 40px; max-width: 1000px; }

      /* ── card ─────────────────────────────── */
      .card { background: #fff; border-radius: 12px; border: 1px solid #ECECEE; padding: 32px; }
      .card-title { font-size: 20px; font-weight: 700; color: #1B1F3B; margin: 0 0 4px; }
      .card-desc { font-size: 13px; color: rgba(27,31,59,0.5); margin: 0 0 24px; }
      .section-title { font-size: 15px; font-weight: 700; color: #1B1F3B; margin: 0 0 4px; }

      /* ── fields ──────────────────────────── */
      .field { margin-bottom: 20px; }
      .field-row { display: flex; gap: 20px; }
      .field-half { flex: 1; }
      .field-label { display: block; font-size: 13px; font-weight: 600; color: #1B1F3B; margin-bottom: 6px; }
      .field-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
      .field-input { width: 100%; padding: 10px 14px; border: 1px solid #E0E0E0; border-radius: 8px; font-size: 14px; color: #1B1F3B; background: #fff; outline: none; box-sizing: border-box; }
      .field-input:focus { border-color: #1B1F3B; }
      .field-select { width: 100%; padding: 10px 14px; border: 1px solid #E0E0E0; border-radius: 8px; font-size: 14px; color: #1B1F3B; background: #fff; outline: none; appearance: auto; box-sizing: border-box; }
      .field-textarea { width: 100%; padding: 12px 14px; border: 1px solid #E0E0E0; border-radius: 8px; font-size: 14px; color: #1B1F3B; background: #fff; outline: none; resize: vertical; font-family: inherit; box-sizing: border-box; }

      /* ── variables ───────────────────────── */
      .btn-add-var { padding: 4px 12px; border: 1px solid #E0E0E0; border-radius: 6px; background: #fff; font-size: 12px; color: #1B1F3B; cursor: pointer; }
      .var-menu { display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap; }
      .var-item { padding: 4px 10px; border: 1px solid #E0E0E0; border-radius: 6px; background: #F6F6F8; font-size: 12px; font-family: monospace; cursor: pointer; color: #1B1F3B; }
      .var-hint { font-size: 12px; color: rgba(27,31,59,0.5); margin: 6px 0 0; }
      .var-hint code { font-family: monospace; background: #F6F6F8; padding: 1px 5px; border-radius: 3px; font-size: 11px; }

      /* ── channel ─────────────────────────── */
      .channel-options { display: flex; flex-direction: column; gap: 8px; }
      .channel-option { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border: 1px solid #E0E0E0; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 500; color: #1B1F3B; }
      .channel-active { border-color: #1B1F3B; }
      .radio { width: 20px; height: 20px; border: 2px solid #ccc; border-radius: 50%; position: relative; flex-shrink: 0; }
      .radio-checked { border-color: #1B1F3B; }
      .radio-checked::after { content: ''; position: absolute; top: 3px; left: 3px; width: 10px; height: 10px; border-radius: 50%; background: #1B1F3B; }
      .channel-hint { font-size: 12px; color: rgba(27,31,59,0.5); margin: 4px 0 0; }

      /* ── cohort chips ────────────────────── */
      .chip-list { display: flex; flex-wrap: wrap; gap: 8px; }
      .cohort-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border: 1px solid #E0E0E0; border-radius: 8px; background: #fff; }
      .cohort-chip-name { font-size: 13px; font-weight: 600; color: #1B1F3B; }
      .cohort-chip-meta { font-size: 11px; color: #E91E63; }
      .chip-remove { background: none; border: none; color: #999; font-size: 16px; cursor: pointer; padding: 0 2px; }

      /* ── recipient chips ─────────────────── */
      .recipient-chips { display: flex; flex-wrap: wrap; gap: 6px; max-height: 200px; overflow-y: auto; }
      .recipient-chip { display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px; border: 1px solid #E0E0E0; border-radius: 16px; background: #fff; font-size: 12px; color: #1B1F3B; }

      /* ── search ──────────────────────────── */
      .search-box { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border: 1px solid #E0E0E0; border-radius: 8px; background: #fff; }
      .search-input { border: none; outline: none; font-size: 13px; background: transparent; width: 140px; }

      /* ── template picker ──────────────────── */
      .template-picker-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
      .filter-chips { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
      .chip-label { font-size: 14px; font-weight: 600; color: #1B1F3B; }
      .chip { padding: 4px 10px; border-radius: 16px; border: 1px solid #E0E0E0; background: #fff; font-size: 12px; color: #1B1F3B; display: inline-flex; align-items: center; gap: 4px; }
      .chip-active { background: #F6F6F8; }
      .chip-x { background: none; border: none; font-size: 14px; color: #999; cursor: pointer; padding: 0; }

      .table-wrap { overflow-x: auto; margin-bottom: 20px; }
      .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .data-table th { text-align: left; padding: 10px 14px; color: rgba(27,31,59,0.5); font-weight: 500; border-bottom: 1px solid #ECECEE; white-space: nowrap; }
      .data-table td { padding: 12px 14px; border-bottom: 1px solid #F4F4F4; color: #1B1F3B; }
      .cell-name { font-weight: 500; }
      .row-selected { background: #F8F8FA; }
      .status-badge { padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
      .status-badge[data-status="approved"] { background: #E8F5E9; color: #2E7D32; }

      .message-content-section { margin-top: 24px; }

      /* ── preview ─────────────────────────── */
      .preview-box { border: 1px solid #ECECEE; border-radius: 10px; padding: 24px; min-height: 300px; }
      .email-preview-header { font-size: 14px; color: #1B1F3B; margin-bottom: 8px; }
      .email-preview-preheader { font-size: 13px; color: rgba(27,31,59,0.6); margin-bottom: 16px; }
      .email-preview-body { font-size: 14px; color: #1B1F3B; line-height: 1.6; white-space: pre-wrap; }

      /* ── schedule / summary ──────────────── */
      .summary-card { background: #F0F7FF; border: 1px solid #D6EAFF; border-radius: 10px; padding: 20px; margin-top: 8px; }
      .summary-title { font-size: 15px; font-weight: 700; color: #1B1F3B; margin: 0 0 12px; }
      .summary-row { font-size: 14px; color: #1B1F3B; margin-bottom: 6px; }
      .summary-label { color: rgba(27,31,59,0.6); }
      .summary-link { color: #1565C0; font-weight: 600; }

      /* ── step footer ─────────────────────── */
      .step-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 28px; padding-top: 24px; border-top: 1px solid #ECECEE; }
      .btn-primary { padding: 12px 28px; border: none; border-radius: 8px; background: #1B1F3B; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; }
      .btn-primary:hover { background: #2d3258; }
    </style>
  `,
})
export class BroadcastCreateMessagePage {
  constructor(private router: Router) {}

  readonly steps = ['Audience', 'Content', 'Preview', 'Schedule'];
  readonly currentStep = signal(0);
  readonly variables = ['name', 'email', 'program_name'];

  /* ── Step 0: Audience ────────────────── */
  serviceCategory = '';
  cohort = '';
  recipientSearch = '';

  readonly selectedCohorts = signal([
    { name: 'AI ACCELERATOR (AI4U)', type: 'Programme', cohort: 'Cohort APR 2026' },
    { name: 'AI ACCELERATOR (AI4U)', type: 'Programme', cohort: 'Cohort APR 2026' },
    { name: 'GENERATIVE AI WOR...', type: 'Experience', cohort: 'Cohort APR 2026' },
  ]);

  readonly recipients = signal([
    'young.zheng@uxagents.com', 'nicholashon@uxagents.com', 'faiz@mereka.my',
    'florencejones@gmail.com', 'natalie123a@gmail.com', 'james.smith@outlook.com',
    'samantha.jones@yahoo.com', 'michael.brown@gmail.com', 'emily.davis@hotmail.com',
    'chris.wilson@icloud.com', 'olivia.johnson@fakemail.com', 'daniel.miller@live.com',
  ]);

  removeCohort(i: number): void {
    this.selectedCohorts.update((c) => c.filter((_, idx) => idx !== i));
  }

  removeRecipient(i: number): void {
    this.recipients.update((r) => r.filter((_, idx) => idx !== i));
  }

  /* ── Step 1: Content ─────────────────── */
  readonly msgChannel = signal<'email' | 'whatsapp' | ''>('');
  readonly selectedTemplate = signal<string>('');
  readonly showMsgVarMenu = signal(false);
  readonly templateFilterChips = ['Whatsapp', 'Onboarding', 'Reminder'];

  versionName = '';
  msgSubject = 'Welcome to Mereka Programme';
  msgPreheader = 'Your learning journey starts here – brochure inside...';
  msgBody = '';

  readonly availableTemplates: TemplateRow[] = [
    { id: '1', name: 'Onboarding message_1', channel: 'WhatsApp', lastUpdated: '52 minutes ago', category: 'Onboarding', language: 'English', status: 'Approved' },
    { id: '2', name: 'Marketing_1',          channel: 'WhatsApp', lastUpdated: '52 minutes ago', category: 'Onboarding', language: 'English', status: 'Approved' },
    { id: '3', name: 'May 2026 Promo',       channel: 'WhatsApp', lastUpdated: '52 minutes ago', category: 'Onboarding', language: 'English', status: 'Approved' },
  ];

  insertMsgVar(v: string): void {
    this.msgBody += `{{${v}}}`;
    this.showMsgVarMenu.set(false);
  }

  /* ── Step 2: Preview ─────────────────── */
  // (uses msgSubject, msgPreheader, msgBody from step 1)

  /* ── Step 3: Schedule ────────────────── */
  readonly scheduleType = signal<'now' | 'later'>('later');
  scheduleDate = '2026-05-02';
  scheduleTime = '00:00';

  getSelectedTemplateName(): string {
    const t = this.availableTemplates.find((x) => x.id === this.selectedTemplate());
    return t?.name ?? '(none selected)';
  }

  /* ── navigation ──────────────────────── */
  nextStep(): void {
    if (this.currentStep() < this.steps.length - 1) {
      this.currentStep.update((s) => s + 1);
    }
  }

  goToStep(i: number): void {
    if (i <= this.currentStep()) {
      this.currentStep.set(i);
    }
  }

  scheduleMessage(): void {
    const when = this.scheduleType() === 'now' ? 'immediately' : `at ${this.scheduleDate} ${this.scheduleTime}`;
    alert(`Message scheduled ${when} to ${this.recipients().length} recipients!`);
    this.router.navigate(['/dashboard/broadcasts']);
  }
}
