import { ChangeDetectionStrategy, Component, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
/* ── Block type definitions ────────────────────── */
interface EmailBlock {
  id: string;
  type: 'heading' | 'text' | 'button' | 'image' | 'divider' | 'spacer' | 'html' | 'columns' | 'container';
  content: string;
  styles: Record<string, string>;
  children?: EmailBlock[];      // for columns / container
  columnCount?: number;         // for columns block
}

const BLOCK_DEFAULTS: Record<string, Partial<EmailBlock>> = {
  heading:   { content: 'Your heading here', styles: { fontSize: '28px', fontWeight: '700', color: '#1B1F3B', textAlign: 'left', padding: '12px 20px' } },
  text:      { content: 'Write your content here. You can edit this text inline.', styles: { fontSize: '15px', fontWeight: '400', color: '#333333', lineHeight: '1.6', textAlign: 'left', padding: '8px 20px' } },
  button:    { content: 'Click here', styles: { backgroundColor: '#1B1F3B', color: '#ffffff', fontSize: '15px', fontWeight: '600', padding: '12px 28px', borderRadius: '8px', textAlign: 'center', buttonAlign: 'center', url: '#' } },
  image:     { content: '', styles: { width: '100%', height: 'auto', padding: '8px 20px', alt: 'Image', src: '' } },
  divider:   { content: '', styles: { borderColor: '#E0E0E0', borderWidth: '1px', borderStyle: 'solid', padding: '8px 20px' } },
  spacer:    { content: '', styles: { height: '32px' } },
  html:      { content: '<p style="color:#555;">Custom HTML content</p>', styles: { padding: '8px 20px' } },
  columns:   { content: '', styles: { padding: '8px 20px', gap: '16px' }, children: [], columnCount: 2 },
  container: { content: '', styles: { backgroundColor: '#F6F6F8', borderRadius: '8px', padding: '16px 20px', border: '1px solid #ECECEE' }, children: [] },
};

const BLOCK_ICONS: Record<string, string> = {
  heading:   'H',
  text:      'T',
  button:    'B',
  image:     'Img',
  divider:   '---',
  spacer:    '[ ]',
  html:      '</>',
  columns:   '||',
  container: '[ ]',
};

const BLOCK_LABELS: Record<string, string> = {
  heading: 'Heading', text: 'Text', button: 'Button', image: 'Image',
  divider: 'Divider', spacer: 'Spacer', html: 'Html', columns: 'Columns', container: 'Container',
};

let _blockIdCounter = 0;
function createBlock(type: string): EmailBlock {
  const defaults = BLOCK_DEFAULTS[type] || {};
  return {
    id: `block_${++_blockIdCounter}_${Date.now()}`,
    type: type as EmailBlock['type'],
    content: defaults.content || '',
    styles: { ...(defaults.styles || {}) },
    children: defaults.children ? [] : undefined,
    columnCount: defaults.columnCount,
  };
}

@Component({
  selector: 'mereka-broadcast-create-template',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tpl-main">
        <!-- Top bar -->
        <div class="top-bar">
          <a routerLink="/dashboard/broadcasts" class="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 15l-5-5 5-5" stroke="#1B1F3B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Back
          </a>
          <div class="top-actions">
            <button class="btn-save-draft" (click)="saveDraft()">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M5 1v3h4V1" stroke="currentColor" stroke-width="1.2"/><path d="M4 8h6M4 10h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
              Save as draft
            </button>
            <button class="btn-discard" (click)="discard()">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5 4V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M4 5.5v5a1.5 1.5 0 0 0 1.5 1.5h3A1.5 1.5 0 0 0 10 10.5v-5" stroke="#E53935" stroke-width="1.1" stroke-linecap="round"/></svg>
              Discard
            </button>
          </div>
        </div>

        <!-- ═══ STEP 1: Form ═══ -->
        <section class="card" *ngIf="step() === 'form'">
          <h2 class="form-title">Create broadcast message template</h2>

          <!-- Template Name -->
          <div class="field">
            <label class="field-label">Template Name</label>
            <input type="text" class="field-input" placeholder="E.g. onboarding message" [(ngModel)]="templateName" />
          </div>

          <!-- Category -->
          <div class="field">
            <label class="field-label">Category</label>
            <select class="field-select" [(ngModel)]="category">
              <option value="" disabled>Select category</option>
              <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
            </select>
          </div>

          <!-- Language -->
          <div class="field">
            <label class="field-label">Language</label>
            <select class="field-select" [(ngModel)]="language">
              <option value="" disabled>Select language</option>
              <option *ngFor="let l of languages" [value]="l">{{ l }}</option>
            </select>
          </div>

          <!-- Label -->
          <div class="field">
            <label class="field-label">Label (optional)</label>
            <input type="text" class="field-input" placeholder="Add labels" [(ngModel)]="label" />
          </div>

          <!-- Channel selection -->
          <div class="field">
            <label class="field-label">Select message channel</label>
            <div class="channel-options">
              <label class="channel-option" [class.channel-active]="channel() === 'email'" (click)="channel.set('email')">
                <span>Email</span>
                <span class="radio" [class.radio-checked]="channel() === 'email'"></span>
              </label>
              <label class="channel-option" [class.channel-active]="channel() === 'whatsapp'" (click)="channel.set('whatsapp')">
                <span>Whatsapp</span>
                <span class="radio" [class.radio-checked]="channel() === 'whatsapp'"></span>
              </label>
              <p class="channel-hint" *ngIf="channel() === 'whatsapp'">
                Messages sent via WhatsApp will only be delivered to recipients with an active WhatsApp account.
              </p>
            </div>
          </div>

          <!-- WhatsApp approval warning -->
          <div class="approval-notice" *ngIf="channel() === 'whatsapp'">
            <div class="approval-header">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="#F57F17" stroke-width="1.3"/><path d="M9 5v4M9 12h.01" stroke="#F57F17" stroke-width="1.5" stroke-linecap="round"/></svg>
              <strong>WhatsApp Template Approval Required</strong>
            </div>
            <p class="approval-text">WhatsApp templates must be approved by Meta before use. This typically takes 24-48 hours.</p>
          </div>

          <!-- ═══════════════════════════════════════════ -->
          <!-- ═══ EMAIL VISUAL BUILDER ═══════════════════ -->
          <!-- ═══════════════════════════════════════════ -->
          <div *ngIf="channel() === 'email'" class="email-builder-section">
            <h3 class="section-title">Message content</h3>

            <div class="field">
              <label class="field-label">Subject</label>
              <input type="text" class="field-input" placeholder="Type your subject here..." [(ngModel)]="emailSubject" />
            </div>

            <div class="field">
              <label class="field-label">Preheader</label>
              <input type="text" class="field-input" placeholder="Type your preheader here..." [(ngModel)]="emailPreheader" />
            </div>

            <!-- Builder toolbar -->
            <div class="builder-toolbar">
              <div class="toolbar-left">
                <span class="toolbar-label">Email Body</span>
                <div class="format-toggle">
                  <button class="format-btn" [class.format-btn-active]="emailMode() === 'visual'" (click)="emailMode.set('visual')">Visual</button>
                  <button class="format-btn" [class.format-btn-active]="emailMode() === 'html'" (click)="switchToHtml()">HTML</button>
                </div>
              </div>
              <div class="toolbar-right">
                <button class="toolbar-icon-btn" title="Add variable" (click)="showVarMenu.set(!showVarMenu())">
                  <span style="font-size:13px;font-weight:600;">{{'{ }'}}</span>
                </button>
                <button class="toolbar-icon-btn" title="Preview" (click)="goToPreview()">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.2"/></svg>
                </button>
                <div class="device-toggle">
                  <button class="device-btn" [class.device-btn-active]="previewDevice() === 'desktop'" (click)="previewDevice.set('desktop')" title="Desktop">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="10" rx="1" stroke="currentColor" stroke-width="1.2"/><path d="M5 14h6M8 12v2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                  </button>
                  <button class="device-btn" [class.device-btn-active]="previewDevice() === 'mobile'" (click)="previewDevice.set('mobile')" title="Mobile">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="4" y="1" width="8" height="14" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M7 12.5h2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Variable menu -->
            <div class="var-menu" *ngIf="showVarMenu()">
              <button *ngFor="let v of variables" class="var-item" (click)="insertVariableToBlock(v)">{{ '{{' + v + '}}' }}</button>
            </div>

            <!-- ═══ VISUAL MODE ═══ -->
            <div class="builder-container" *ngIf="emailMode() === 'visual'">

              <!-- Left: Block palette + Canvas -->
              <div class="builder-left">
                <!-- Add blocks button / palette -->
                <div class="blocks-palette-trigger">
                  <button class="btn-add-block" (click)="showBlockPalette.set(!showBlockPalette())">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    Content blocks
                  </button>
                </div>

                <!-- Block palette popup -->
                <div class="blocks-palette" *ngIf="showBlockPalette()">
                  <div class="palette-grid">
                    <div *ngFor="let bt of blockTypes"
                         class="palette-block"
                         draggable="true"
                         (dragstart)="onPaletteDragStart($event, bt)"
                         (click)="addBlockToCanvas(bt)">
                      <div class="palette-icon" [attr.data-type]="bt">{{ blockIcons[bt] }}</div>
                      <span class="palette-label">{{ blockLabels[bt] }}</span>
                    </div>
                  </div>
                </div>

                <!-- Canvas -->
                <div class="email-canvas"
                     [class.canvas-mobile]="previewDevice() === 'mobile'"
                     (dragover)="onCanvasDragOver($event)"
                     (drop)="onCanvasDrop($event)"
                     (dragleave)="onCanvasDragLeave($event)">

                  <div class="canvas-inner"
                       [style.borderColor]="canvasStyles.borderColor"
                       [style.borderRadius]="canvasStyles.borderRadius"
                       [style.fontFamily]="canvasStyles.fontFamily"
                       [style.color]="canvasStyles.textColor">

                    <!-- Empty state -->
                    <div class="canvas-empty" *ngIf="emailBlocks().length === 0">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="4" y="4" width="40" height="40" rx="8" stroke="#D0D0D0" stroke-width="1.5" stroke-dasharray="4 3"/><path d="M24 16v16M16 24h16" stroke="#D0D0D0" stroke-width="1.5" stroke-linecap="round"/></svg>
                      <p class="canvas-empty-text">Drag content blocks here or click "Content blocks" above</p>
                    </div>

                    <!-- Blocks on canvas -->
                    <div *ngFor="let block of emailBlocks(); let i = index; trackBy: trackBlock"
                         class="canvas-block"
                         [class.canvas-block-selected]="selectedBlockId() === block.id"
                         (click)="selectBlock(block.id, $event)"
                         draggable="true"
                         (dragstart)="onBlockDragStart($event, i)"
                         (dragover)="onBlockDragOver($event, i)"
                         (drop)="onBlockDrop($event, i)"
                         (dragend)="onBlockDragEnd()">

                      <!-- Drop indicator line -->
                      <div class="drop-indicator" *ngIf="dropTargetIndex() === i && dragSource() === 'palette'"></div>

                      <!-- Block toolbar (shows on hover/select) -->
                      <div class="block-toolbar" *ngIf="selectedBlockId() === block.id">
                        <button class="block-toolbar-btn" title="Move up" (click)="moveBlock(i, -1); $event.stopPropagation()">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3v8M4 6l3-3 3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <button class="block-toolbar-btn" title="Move down" (click)="moveBlock(i, 1); $event.stopPropagation()">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 11V3M4 8l3 3 3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <button class="block-toolbar-btn" title="Duplicate" (click)="duplicateBlock(i); $event.stopPropagation()">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.1"/><path d="M10 4V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1" stroke="currentColor" stroke-width="1.1"/></svg>
                        </button>
                        <button class="block-toolbar-btn block-toolbar-delete" title="Delete" (click)="deleteBlock(i); $event.stopPropagation()">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 4h8M5.5 4V3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M4.5 5.5v5a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>
                        </button>
                      </div>

                      <!-- ── Heading block ── -->
                      <div *ngIf="block.type === 'heading'" class="block-content"
                           [style.padding]="block.styles['padding']">
                        <div contenteditable="true"
                             class="inline-edit heading-edit"
                             [style.fontSize]="block.styles['fontSize']"
                             [style.fontWeight]="block.styles['fontWeight']"
                             [style.color]="block.styles['color']"
                             [style.textAlign]="block.styles['textAlign']"
                             (blur)="onContentEdit($event, block)"
                             [innerHTML]="block.content">
                        </div>
                      </div>

                      <!-- ── Text block ── -->
                      <div *ngIf="block.type === 'text'" class="block-content"
                           [style.padding]="block.styles['padding']">
                        <div contenteditable="true"
                             class="inline-edit"
                             [style.fontSize]="block.styles['fontSize']"
                             [style.fontWeight]="block.styles['fontWeight']"
                             [style.color]="block.styles['color']"
                             [style.lineHeight]="block.styles['lineHeight']"
                             [style.textAlign]="block.styles['textAlign']"
                             (blur)="onContentEdit($event, block)"
                             [innerHTML]="block.content">
                        </div>
                      </div>

                      <!-- ── Button block ── -->
                      <div *ngIf="block.type === 'button'" class="block-content"
                           [style.padding]="block.styles['padding']"
                           [style.textAlign]="block.styles['buttonAlign']">
                        <a class="email-button"
                           [style.backgroundColor]="block.styles['backgroundColor']"
                           [style.color]="block.styles['color']"
                           [style.fontSize]="block.styles['fontSize']"
                           [style.fontWeight]="block.styles['fontWeight']"
                           [style.borderRadius]="block.styles['borderRadius']"
                           [style.padding]="block.styles['padding']"
                           contenteditable="true"
                           (blur)="onContentEdit($event, block)">{{ block.content }}</a>
                      </div>

                      <!-- ── Image block ── -->
                      <div *ngIf="block.type === 'image'" class="block-content"
                           [style.padding]="block.styles['padding']">
                        <div class="image-placeholder" *ngIf="!block.styles['src']">
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="2" y="4" width="28" height="24" rx="3" stroke="#BDBDBD" stroke-width="1.5"/><circle cx="10" cy="12" r="3" stroke="#BDBDBD" stroke-width="1.5"/><path d="M2 22l8-7 5 5 4-3 11 8" stroke="#BDBDBD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          <p>Click to upload or drag an image</p>
                          <input type="text" class="image-url-input" placeholder="Or paste image URL..." (change)="onImageUrl($event, block)" (click)="$event.stopPropagation()" />
                        </div>
                        <img *ngIf="block.styles['src']"
                             [src]="block.styles['src']"
                             [alt]="block.styles['alt']"
                             [style.width]="block.styles['width']"
                             style="display:block;max-width:100%;height:auto;" />
                      </div>

                      <!-- ── Divider block ── -->
                      <div *ngIf="block.type === 'divider'" class="block-content"
                           [style.padding]="block.styles['padding']">
                        <hr [style.borderColor]="block.styles['borderColor']"
                            [style.borderWidth]="block.styles['borderWidth']"
                            [style.borderStyle]="block.styles['borderStyle']"
                            style="border-bottom:none;border-left:none;border-right:none;" />
                      </div>

                      <!-- ── Spacer block ── -->
                      <div *ngIf="block.type === 'spacer'" class="block-content spacer-block"
                           [style.height]="block.styles['height']">
                        <span class="spacer-label" *ngIf="selectedBlockId() === block.id">Spacer ({{ block.styles['height'] }})</span>
                      </div>

                      <!-- ── HTML block ── -->
                      <div *ngIf="block.type === 'html'" class="block-content"
                           [style.padding]="block.styles['padding']">
                        <div class="html-block-content" [innerHTML]="block.content"></div>
                        <textarea *ngIf="selectedBlockId() === block.id"
                                  class="html-edit-area"
                                  [(ngModel)]="block.content"
                                  rows="4"
                                  placeholder="<p>Write HTML here...</p>"
                                  (click)="$event.stopPropagation()"></textarea>
                      </div>

                      <!-- ── Columns block ── -->
                      <div *ngIf="block.type === 'columns'" class="block-content columns-block"
                           [style.padding]="block.styles['padding']"
                           [style.gap]="block.styles['gap']">
                        <div class="column-cell" *ngFor="let col of getColumnArray(block); let ci = index"
                             [style.flex]="'1 1 0'">
                          <div class="column-placeholder">Column {{ ci + 1 }}</div>
                        </div>
                      </div>

                      <!-- ── Container block ── -->
                      <div *ngIf="block.type === 'container'" class="block-content container-block"
                           [style.padding]="block.styles['padding']"
                           [style.backgroundColor]="block.styles['backgroundColor']"
                           [style.borderRadius]="block.styles['borderRadius']"
                           [style.border]="block.styles['border']">
                        <div class="container-placeholder" *ngIf="!block.children || block.children.length === 0">
                          Container - drag blocks here
                        </div>
                      </div>
                    </div>

                    <!-- Bottom drop zone -->
                    <div class="drop-indicator" *ngIf="dropTargetIndex() === emailBlocks().length && dragSource() === 'palette'"></div>
                  </div>
                </div>
              </div>

              <!-- Right: Styles panel -->
              <div class="styles-panel">
                <div class="styles-tabs">
                  <button class="styles-tab" [class.styles-tab-active]="stylesTab() === 'styles'" (click)="stylesTab.set('styles')">Styles</button>
                  <button class="styles-tab" [class.styles-tab-active]="stylesTab() === 'inspect'" (click)="stylesTab.set('inspect')">Inspect</button>
                </div>

                <!-- Canvas styles (when no block selected) -->
                <div class="styles-body" *ngIf="stylesTab() === 'styles' && !selectedBlockId()">
                  <p class="styles-section-title">Canvas</p>

                  <div class="style-field">
                    <label class="style-label">Border color</label>
                    <div class="color-input-row">
                      <input type="color" class="color-swatch" [(ngModel)]="canvasStyles.borderColor" />
                      <input type="text" class="style-text-input" [(ngModel)]="canvasStyles.borderColor" />
                    </div>
                  </div>

                  <div class="style-field">
                    <label class="style-label">Border radius</label>
                    <input type="range" min="0" max="24" [(ngModel)]="canvasStyles.borderRadiusNum" (input)="canvasStyles.borderRadius = canvasStyles.borderRadiusNum + 'px'" class="style-range" />
                    <span class="range-value">{{ canvasStyles.borderRadiusNum }}px</span>
                  </div>

                  <div class="style-field">
                    <label class="style-label">Font family</label>
                    <select class="style-select" [(ngModel)]="canvasStyles.fontFamily">
                      <option *ngFor="let f of fontFamilies" [value]="f">{{ f }}</option>
                    </select>
                  </div>

                  <div class="style-field">
                    <label class="style-label">Text color</label>
                    <div class="color-input-row">
                      <input type="color" class="color-swatch" [(ngModel)]="canvasStyles.textColor" />
                      <input type="text" class="style-text-input" [(ngModel)]="canvasStyles.textColor" />
                    </div>
                  </div>

                  <div class="style-field">
                    <label class="style-label">Background color</label>
                    <div class="color-input-row">
                      <input type="color" class="color-swatch" [(ngModel)]="canvasStyles.bgColor" />
                      <input type="text" class="style-text-input" [(ngModel)]="canvasStyles.bgColor" />
                    </div>
                  </div>
                </div>

                <!-- Block styles (when a block is selected) -->
                <div class="styles-body" *ngIf="stylesTab() === 'styles' && selectedBlock()">
                  <p class="styles-section-title">{{ blockLabels[selectedBlock()!.type] }} styles</p>

                  <!-- Shared: padding -->
                  <div class="style-field">
                    <label class="style-label">Padding</label>
                    <input type="text" class="style-text-input full" [(ngModel)]="selectedBlock()!.styles['padding']" placeholder="8px 20px" />
                  </div>

                  <!-- Text / Heading -->
                  <ng-container *ngIf="selectedBlock()!.type === 'heading' || selectedBlock()!.type === 'text'">
                    <div class="style-field">
                      <label class="style-label">Font size</label>
                      <input type="text" class="style-text-input full" [(ngModel)]="selectedBlock()!.styles['fontSize']" />
                    </div>
                    <div class="style-field">
                      <label class="style-label">Font weight</label>
                      <select class="style-select" [(ngModel)]="selectedBlock()!.styles['fontWeight']">
                        <option value="400">Normal</option>
                        <option value="500">Medium</option>
                        <option value="600">Semi-bold</option>
                        <option value="700">Bold</option>
                      </select>
                    </div>
                    <div class="style-field">
                      <label class="style-label">Color</label>
                      <div class="color-input-row">
                        <input type="color" class="color-swatch" [(ngModel)]="selectedBlock()!.styles['color']" />
                        <input type="text" class="style-text-input" [(ngModel)]="selectedBlock()!.styles['color']" />
                      </div>
                    </div>
                    <div class="style-field">
                      <label class="style-label">Text align</label>
                      <div class="align-buttons">
                        <button class="align-btn" [class.align-btn-active]="selectedBlock()!.styles['textAlign']==='left'" (click)="selectedBlock()!.styles['textAlign']='left'">L</button>
                        <button class="align-btn" [class.align-btn-active]="selectedBlock()!.styles['textAlign']==='center'" (click)="selectedBlock()!.styles['textAlign']='center'">C</button>
                        <button class="align-btn" [class.align-btn-active]="selectedBlock()!.styles['textAlign']==='right'" (click)="selectedBlock()!.styles['textAlign']='right'">R</button>
                      </div>
                    </div>
                  </ng-container>

                  <!-- Button -->
                  <ng-container *ngIf="selectedBlock()!.type === 'button'">
                    <div class="style-field">
                      <label class="style-label">Background</label>
                      <div class="color-input-row">
                        <input type="color" class="color-swatch" [(ngModel)]="selectedBlock()!.styles['backgroundColor']" />
                        <input type="text" class="style-text-input" [(ngModel)]="selectedBlock()!.styles['backgroundColor']" />
                      </div>
                    </div>
                    <div class="style-field">
                      <label class="style-label">Text color</label>
                      <div class="color-input-row">
                        <input type="color" class="color-swatch" [(ngModel)]="selectedBlock()!.styles['color']" />
                        <input type="text" class="style-text-input" [(ngModel)]="selectedBlock()!.styles['color']" />
                      </div>
                    </div>
                    <div class="style-field">
                      <label class="style-label">Border radius</label>
                      <input type="text" class="style-text-input full" [(ngModel)]="selectedBlock()!.styles['borderRadius']" />
                    </div>
                    <div class="style-field">
                      <label class="style-label">URL</label>
                      <input type="text" class="style-text-input full" [(ngModel)]="selectedBlock()!.styles['url']" placeholder="https://..." />
                    </div>
                    <div class="style-field">
                      <label class="style-label">Alignment</label>
                      <div class="align-buttons">
                        <button class="align-btn" [class.align-btn-active]="selectedBlock()!.styles['buttonAlign']==='left'" (click)="selectedBlock()!.styles['buttonAlign']='left'">L</button>
                        <button class="align-btn" [class.align-btn-active]="selectedBlock()!.styles['buttonAlign']==='center'" (click)="selectedBlock()!.styles['buttonAlign']='center'">C</button>
                        <button class="align-btn" [class.align-btn-active]="selectedBlock()!.styles['buttonAlign']==='right'" (click)="selectedBlock()!.styles['buttonAlign']='right'">R</button>
                      </div>
                    </div>
                  </ng-container>

                  <!-- Image -->
                  <ng-container *ngIf="selectedBlock()!.type === 'image'">
                    <div class="style-field">
                      <label class="style-label">Image URL</label>
                      <input type="text" class="style-text-input full" [(ngModel)]="selectedBlock()!.styles['src']" placeholder="https://..." />
                    </div>
                    <div class="style-field">
                      <label class="style-label">Alt text</label>
                      <input type="text" class="style-text-input full" [(ngModel)]="selectedBlock()!.styles['alt']" />
                    </div>
                    <div class="style-field">
                      <label class="style-label">Width</label>
                      <input type="text" class="style-text-input full" [(ngModel)]="selectedBlock()!.styles['width']" placeholder="100%" />
                    </div>
                  </ng-container>

                  <!-- Divider -->
                  <ng-container *ngIf="selectedBlock()!.type === 'divider'">
                    <div class="style-field">
                      <label class="style-label">Color</label>
                      <div class="color-input-row">
                        <input type="color" class="color-swatch" [(ngModel)]="selectedBlock()!.styles['borderColor']" />
                        <input type="text" class="style-text-input" [(ngModel)]="selectedBlock()!.styles['borderColor']" />
                      </div>
                    </div>
                    <div class="style-field">
                      <label class="style-label">Width</label>
                      <input type="text" class="style-text-input full" [(ngModel)]="selectedBlock()!.styles['borderWidth']" />
                    </div>
                    <div class="style-field">
                      <label class="style-label">Style</label>
                      <select class="style-select" [(ngModel)]="selectedBlock()!.styles['borderStyle']">
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                      </select>
                    </div>
                  </ng-container>

                  <!-- Spacer -->
                  <ng-container *ngIf="selectedBlock()!.type === 'spacer'">
                    <div class="style-field">
                      <label class="style-label">Height</label>
                      <input type="text" class="style-text-input full" [(ngModel)]="selectedBlock()!.styles['height']" placeholder="32px" />
                    </div>
                  </ng-container>

                  <!-- Container -->
                  <ng-container *ngIf="selectedBlock()!.type === 'container'">
                    <div class="style-field">
                      <label class="style-label">Background</label>
                      <div class="color-input-row">
                        <input type="color" class="color-swatch" [(ngModel)]="selectedBlock()!.styles['backgroundColor']" />
                        <input type="text" class="style-text-input" [(ngModel)]="selectedBlock()!.styles['backgroundColor']" />
                      </div>
                    </div>
                    <div class="style-field">
                      <label class="style-label">Border</label>
                      <input type="text" class="style-text-input full" [(ngModel)]="selectedBlock()!.styles['border']" />
                    </div>
                    <div class="style-field">
                      <label class="style-label">Border radius</label>
                      <input type="text" class="style-text-input full" [(ngModel)]="selectedBlock()!.styles['borderRadius']" />
                    </div>
                  </ng-container>

                  <!-- Columns -->
                  <ng-container *ngIf="selectedBlock()!.type === 'columns'">
                    <div class="style-field">
                      <label class="style-label">Columns</label>
                      <select class="style-select" [(ngModel)]="selectedBlock()!.columnCount">
                        <option [ngValue]="2">2 columns</option>
                        <option [ngValue]="3">3 columns</option>
                        <option [ngValue]="4">4 columns</option>
                      </select>
                    </div>
                    <div class="style-field">
                      <label class="style-label">Gap</label>
                      <input type="text" class="style-text-input full" [(ngModel)]="selectedBlock()!.styles['gap']" placeholder="16px" />
                    </div>
                  </ng-container>
                </div>

                <!-- Inspect tab -->
                <div class="styles-body" *ngIf="stylesTab() === 'inspect'">
                  <p class="styles-section-title">Block tree</p>
                  <div class="inspect-tree">
                    <div *ngFor="let block of emailBlocks(); let i = index"
                         class="inspect-item"
                         [class.inspect-item-active]="selectedBlockId() === block.id"
                         (click)="selectBlock(block.id, $event)">
                      <span class="inspect-icon">{{ blockIcons[block.type] }}</span>
                      <span class="inspect-name">{{ blockLabels[block.type] }}</span>
                    </div>
                    <p class="inspect-empty" *ngIf="emailBlocks().length === 0">No blocks added yet</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- ═══ HTML MODE ═══ -->
            <div class="html-editor-container" *ngIf="emailMode() === 'html'">
              <textarea class="html-code-editor"
                        [(ngModel)]="rawHtmlContent"
                        rows="20"
                        placeholder="<html>&#10;  <body>&#10;    <h1>Your email content</h1>&#10;    <p>Write HTML here...</p>&#10;  </body>&#10;</html>"
                        spellcheck="false"></textarea>
            </div>
          </div>

          <!-- ═══ WHATSAPP CONTENT ═══ -->
          <div *ngIf="channel() === 'whatsapp'" class="message-content-section">
            <h3 class="section-title">Message content</h3>

            <div class="field">
              <div class="field-label-row">
                <label class="field-label">Message Body</label>
                <button class="btn-add-var" (click)="showVarMenu.set(!showVarMenu())">Add variable</button>
              </div>
              <div class="var-menu" *ngIf="showVarMenu()">
                <button *ngFor="let v of variables" class="var-item" (click)="insertVariable(v)">{{ '{{' + v + '}}' }}</button>
              </div>
              <textarea class="field-textarea" placeholder="Type your message here..." [(ngModel)]="waBody" rows="6"></textarea>
              <p class="var-hint">Use variables: <code *ngFor="let v of variables; let last = last">{{ '{{' + v + '}}' }}{{ last ? '' : ' &nbsp;' }}</code></p>
            </div>

            <!-- Optional content -->
            <h3 class="section-title" style="margin-top:24px;">Optional content</h3>

            <!-- Header -->
            <div class="optional-block">
              <div class="optional-block-top">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="3" rx="1" stroke="currentColor" stroke-width="1.2"/><path d="M2 8h12M2 11h8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                <span class="optional-label">Header</span>
              </div>
              <div class="header-types">
                <button *ngFor="let ht of headerTypes" class="header-type-btn" [class.header-type-active]="waHeaderType() === ht" (click)="waHeaderType.set(ht)">{{ ht }}</button>
              </div>
              <input *ngIf="waHeaderType() === 'Text'" type="text" class="field-input" placeholder="Header text..." [(ngModel)]="waHeaderText" />
              <div *ngIf="waHeaderType() === 'Image' || waHeaderType() === 'Video' || waHeaderType() === 'Document'" class="upload-area">
                <p class="upload-text">Insert {{ waHeaderType().toLowerCase() }} file (pdf or png)</p>
              </div>
              <input *ngIf="waHeaderType() === 'Location'" type="text" class="field-input" placeholder="Enter location URL or coordinates" [(ngModel)]="waHeaderLocation" />
            </div>

            <!-- Footer -->
            <div class="optional-block">
              <div class="optional-block-top">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5h12M2 8h8M2 11h12M2 14h6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                <span class="optional-label">Footer</span>
              </div>
              <input type="text" class="field-input" placeholder="Add footer text" [(ngModel)]="waFooter" />
            </div>

            <!-- Buttons -->
            <div class="optional-block">
              <div class="optional-block-top">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="5" width="12" height="6" rx="2" stroke="currentColor" stroke-width="1.2"/><path d="M6 8h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                <span class="optional-label">Buttons</span>
              </div>
              <div class="button-type-tabs">
                <button class="btn-type-tab" [class.btn-type-tab-active]="waButtonMode() === 'cta'" (click)="waButtonMode.set('cta')">Call to action</button>
                <button class="btn-type-tab" [class.btn-type-tab-active]="waButtonMode() === 'quick'" (click)="waButtonMode.set('quick')">Quick reply</button>
              </div>
              <div *ngFor="let btn of waButtons(); let i = index" class="button-row">
                <input type="text" class="field-input btn-name-input" placeholder="Name" [(ngModel)]="btn.name" />
                <span class="btn-row-arrow">&rarr;</span>
                <select class="field-select btn-type-select" [(ngModel)]="btn.actionType">
                  <option value="">Button text</option>
                  <option value="url">URL</option>
                  <option value="phone">Phone</option>
                  <option value="whatsapp">Call on Whatsapp</option>
                  <option value="coupon">Coupon Code</option>
                </select>
                <input type="text" class="field-input" placeholder="Please select an option" [(ngModel)]="btn.value" />
              </div>
              <button class="btn-add-button" (click)="addButton()">+ Add button</button>
            </div>
          </div>

          <!-- ═══ WHATSAPP PHONE PREVIEW ═══ -->
          <div class="wa-preview-panel" *ngIf="channel() === 'whatsapp'">
            <h3 class="section-title">Preview</h3>
            <div class="phone-mockup">
              <div class="phone-notch"></div>
              <div class="phone-header-wa">
                <div class="phone-avatar"></div>
                <div class="phone-contact">
                  <span class="phone-name">Mereka</span>
                  <span class="phone-status">online</span>
                </div>
              </div>
              <div class="phone-body">
                <div class="wa-bubble" *ngIf="waHeaderText || waBody">
                  <p class="wa-bubble-header" *ngIf="waHeaderText">{{ waHeaderText }}</p>
                  <p class="wa-bubble-text">{{ waBody || 'Your message will appear here...' }}</p>
                  <p class="wa-bubble-footer" *ngIf="waFooter">{{ waFooter }}</p>
                  <span class="wa-bubble-time">10:30 AM</span>
                </div>
                <div class="wa-bubble-buttons" *ngIf="waButtons().length">
                  <button *ngFor="let btn of waButtons()" class="wa-cta-btn" [title]="btn.value">
                    {{ btn.name || 'Button' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer actions -->
          <div class="form-footer">
            <button class="btn-cancel" routerLink="/dashboard/broadcasts">Cancel</button>
            <button class="btn-continue" (click)="goToPreview()" *ngIf="channel() === 'email'">Preview &amp; Save</button>
            <button class="btn-submit" (click)="submitTemplate()" *ngIf="channel() === 'whatsapp'">
              Submit template
            </button>
          </div>
        </section>

        <!-- ═══ STEP 2: Email Preview ═══ -->
        <section class="card" *ngIf="step() === 'preview'">
          <div class="preview-top-bar">
            <h2 class="form-title" style="margin:0;">Preview</h2>
            <div class="device-toggle">
              <button class="device-btn" [class.device-btn-active]="previewDevice() === 'desktop'" (click)="previewDevice.set('desktop')" title="Desktop">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="10" rx="1" stroke="currentColor" stroke-width="1.2"/><path d="M5 14h6M8 12v2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
              </button>
              <button class="device-btn" [class.device-btn-active]="previewDevice() === 'mobile'" (click)="previewDevice.set('mobile')" title="Mobile">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="4" y="1" width="8" height="14" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M7 12.5h2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>

          <div class="email-preview-envelope" [class.preview-mobile]="previewDevice() === 'mobile'">
            <div class="email-preview-meta">
              <div class="email-preview-header"><strong>Subject:</strong> {{ emailSubject || '(no subject)' }}</div>
              <div class="email-preview-preheader"><strong>Preheader:</strong> {{ emailPreheader || '(none)' }}</div>
            </div>
            <div class="email-preview-rendered"
                 [style.fontFamily]="canvasStyles.fontFamily"
                 [style.color]="canvasStyles.textColor"
                 [style.backgroundColor]="canvasStyles.bgColor"
                 [style.borderColor]="canvasStyles.borderColor"
                 [style.borderRadius]="canvasStyles.borderRadius">
              <div *ngFor="let block of emailBlocks(); trackBy: trackBlock" class="preview-block">
                <!-- Heading -->
                <div *ngIf="block.type === 'heading'" [style.padding]="block.styles['padding']" [style.fontSize]="block.styles['fontSize']" [style.fontWeight]="block.styles['fontWeight']" [style.color]="block.styles['color']" [style.textAlign]="block.styles['textAlign']">{{ block.content }}</div>
                <!-- Text -->
                <div *ngIf="block.type === 'text'" [style.padding]="block.styles['padding']" [style.fontSize]="block.styles['fontSize']" [style.color]="block.styles['color']" [style.lineHeight]="block.styles['lineHeight']" [style.textAlign]="block.styles['textAlign']" [innerHTML]="block.content"></div>
                <!-- Button -->
                <div *ngIf="block.type === 'button'" [style.padding]="block.styles['padding']" [style.textAlign]="block.styles['buttonAlign']">
                  <a style="display:inline-block;text-decoration:none;" [style.backgroundColor]="block.styles['backgroundColor']" [style.color]="block.styles['color']" [style.fontSize]="block.styles['fontSize']" [style.fontWeight]="block.styles['fontWeight']" [style.borderRadius]="block.styles['borderRadius']" [style.padding]="block.styles['padding']">{{ block.content }}</a>
                </div>
                <!-- Image -->
                <div *ngIf="block.type === 'image'" [style.padding]="block.styles['padding']">
                  <img *ngIf="block.styles['src']" [src]="block.styles['src']" [alt]="block.styles['alt']" [style.width]="block.styles['width']" style="display:block;max-width:100%;height:auto;" />
                  <div *ngIf="!block.styles['src']" style="padding:20px;text-align:center;color:#999;border:1px dashed #ddd;border-radius:8px;">Image placeholder</div>
                </div>
                <!-- Divider -->
                <div *ngIf="block.type === 'divider'" [style.padding]="block.styles['padding']"><hr [style.borderColor]="block.styles['borderColor']" [style.borderWidth]="block.styles['borderWidth']" [style.borderStyle]="block.styles['borderStyle']" style="border-bottom:none;border-left:none;border-right:none;" /></div>
                <!-- Spacer -->
                <div *ngIf="block.type === 'spacer'" [style.height]="block.styles['height']"></div>
                <!-- Html -->
                <div *ngIf="block.type === 'html'" [style.padding]="block.styles['padding']" [innerHTML]="block.content"></div>
                <!-- Columns -->
                <div *ngIf="block.type === 'columns'" [style.padding]="block.styles['padding']" style="display:flex;" [style.gap]="block.styles['gap']">
                  <div *ngFor="let col of getColumnArray(block)" style="flex:1 1 0;padding:8px;background:#fafafa;border-radius:4px;text-align:center;color:#aaa;font-size:13px;">Column</div>
                </div>
                <!-- Container -->
                <div *ngIf="block.type === 'container'" [style.padding]="block.styles['padding']" [style.backgroundColor]="block.styles['backgroundColor']" [style.borderRadius]="block.styles['borderRadius']" [style.border]="block.styles['border']">
                  <p style="color:#aaa;text-align:center;font-size:13px;margin:0;">Container</p>
                </div>
              </div>
              <p *ngIf="emailBlocks().length === 0" style="text-align:center;color:#aaa;padding:40px;">No content blocks added</p>
            </div>
          </div>

          <div class="form-footer">
            <button class="btn-cancel" (click)="step.set('form')">Back to editor</button>
            <button class="btn-submit" (click)="submitTemplate()">Save template</button>
          </div>
        </section>
    </div>

    <style>
      /* ── layout ──────────────────────────── */
      .tpl-main { padding: 0; max-width: 1280px; }

      /* ── top bar ─────────────────────────── */
      .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      .back-link { display: flex; align-items: center; gap: 4px; color: #1B1F3B; text-decoration: none; font-size: 14px; font-weight: 500; }
      .top-actions { display: flex; gap: 8px; }
      .btn-save-draft { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid #E0E0E0; border-radius: 8px; background: #fff; font-size: 13px; color: #1B1F3B; cursor: pointer; }
      .btn-discard { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border: 1px solid #FFCDD2; border-radius: 8px; background: #fff; font-size: 13px; color: #E53935; cursor: pointer; }

      /* ── card ─────────────────────────────── */
      .card { background: #fff; border-radius: 12px; border: 1px solid #ECECEE; padding: 32px; }

      /* ── form ─────────────────────────────── */
      .form-title { font-size: 20px; font-weight: 700; color: #1B1F3B; margin: 0 0 28px; }
      .section-title { font-size: 15px; font-weight: 700; color: #1B1F3B; margin: 0 0 16px; }
      .field { margin-bottom: 20px; }
      .field-label { display: block; font-size: 13px; font-weight: 600; color: #1B1F3B; margin-bottom: 6px; }
      .field-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
      .field-input { width: 100%; padding: 10px 14px; border: 1px solid #E0E0E0; border-radius: 8px; font-size: 14px; color: #1B1F3B; background: #fff; outline: none; box-sizing: border-box; }
      .field-input:focus { border-color: #1B1F3B; }
      .field-select { width: 100%; padding: 10px 14px; border: 1px solid #E0E0E0; border-radius: 8px; font-size: 14px; color: #1B1F3B; background: #fff; outline: none; appearance: auto; box-sizing: border-box; }
      .field-textarea { width: 100%; padding: 12px 14px; border: 1px solid #E0E0E0; border-radius: 8px; font-size: 14px; color: #1B1F3B; background: #fff; outline: none; resize: vertical; font-family: inherit; box-sizing: border-box; }
      .field-textarea:focus { border-color: #1B1F3B; }

      /* ── variables ───────────────────────── */
      .btn-add-var { padding: 4px 12px; border: 1px solid #E0E0E0; border-radius: 6px; background: #fff; font-size: 12px; color: #1B1F3B; cursor: pointer; }
      .var-menu { display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap; }
      .var-item { padding: 4px 10px; border: 1px solid #E0E0E0; border-radius: 6px; background: #F6F6F8; font-size: 12px; font-family: monospace; cursor: pointer; color: #1B1F3B; }
      .var-item:hover { background: #ECECEE; }
      .var-hint { font-size: 12px; color: rgba(27,31,59,0.5); margin: 6px 0 0; }
      .var-hint code { font-family: monospace; background: #F6F6F8; padding: 1px 5px; border-radius: 3px; font-size: 11px; }

      /* ── channel selection ────────────────── */
      .channel-options { display: flex; flex-direction: column; gap: 8px; }
      .channel-option { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border: 1px solid #E0E0E0; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 500; color: #1B1F3B; }
      .channel-active { border-color: #1B1F3B; }
      .radio { width: 20px; height: 20px; border: 2px solid #ccc; border-radius: 50%; position: relative; }
      .radio-checked { border-color: #1B1F3B; }
      .radio-checked::after { content: ''; position: absolute; top: 3px; left: 3px; width: 10px; height: 10px; border-radius: 50%; background: #1B1F3B; }
      .channel-hint { font-size: 12px; color: rgba(27,31,59,0.5); margin: 0; }

      /* ── approval notice ──────────────────── */
      .approval-notice { background: #FFFDE7; border: 1px solid #FFF9C4; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px; }
      .approval-header { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #F57F17; margin-bottom: 4px; }
      .approval-text { font-size: 12px; color: rgba(27,31,59,0.6); margin: 0; }
      .message-content-section { margin-top: 8px; }

      /* ═══════════════════════════════════════════════ */
      /* EMAIL VISUAL BUILDER STYLES                     */
      /* ═══════════════════════════════════════════════ */
      .email-builder-section { margin-top: 8px; }

      /* ── Builder toolbar ──────────────────── */
      .builder-toolbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: #F6F6F8; border: 1px solid #ECECEE; border-radius: 10px 10px 0 0; margin-top: 8px; }
      .toolbar-left { display: flex; align-items: center; gap: 14px; }
      .toolbar-label { font-size: 13px; font-weight: 600; color: #1B1F3B; }
      .format-toggle { display: flex; border: 1px solid #E0E0E0; border-radius: 6px; overflow: hidden; }
      .format-btn { padding: 5px 14px; border: none; background: #fff; font-size: 12px; font-weight: 500; color: #1B1F3B; cursor: pointer; }
      .format-btn-active { background: #1B1F3B; color: #fff; }
      .toolbar-right { display: flex; align-items: center; gap: 8px; }
      .toolbar-icon-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid #E0E0E0; border-radius: 6px; background: #fff; cursor: pointer; color: #1B1F3B; }
      .toolbar-icon-btn:hover { background: #F0F0F2; }
      .device-toggle { display: flex; border: 1px solid #E0E0E0; border-radius: 6px; overflow: hidden; }
      .device-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: none; background: #fff; cursor: pointer; color: #888; }
      .device-btn-active { background: #1B1F3B; color: #fff; }

      /* ── Builder container (canvas + styles panel) ── */
      .builder-container { display: flex; gap: 0; border: 1px solid #ECECEE; border-top: none; border-radius: 0 0 10px 10px; min-height: 500px; overflow: hidden; }
      .builder-left { flex: 1; display: flex; flex-direction: column; position: relative; }

      /* ── Block palette ────────────────────── */
      .blocks-palette-trigger { padding: 12px 16px; border-bottom: 1px solid #ECECEE; background: #FAFAFA; }
      .btn-add-block { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: 1px dashed #BDBDBD; border-radius: 8px; background: #fff; font-size: 13px; font-weight: 500; color: #1B1F3B; cursor: pointer; width: 100%; justify-content: center; }
      .btn-add-block:hover { border-color: #1B1F3B; background: #F6F6F8; }
      .blocks-palette { position: absolute; top: 52px; left: 16px; right: 16px; z-index: 20; background: #fff; border: 1px solid #ECECEE; border-radius: 10px; padding: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
      .palette-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
      .palette-block { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 8px; border: 1px solid #ECECEE; border-radius: 8px; cursor: pointer; transition: all 0.15s; user-select: none; }
      .palette-block:hover { border-color: #1B1F3B; background: #F6F6F8; }
      .palette-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: #F0F0F2; font-size: 14px; font-weight: 700; color: #1B1F3B; }
      .palette-icon[data-type="html"] { font-size: 12px; font-family: monospace; }
      .palette-label { font-size: 11px; font-weight: 500; color: #555; }

      /* ── Canvas ───────────────────────────── */
      .email-canvas { flex: 1; padding: 24px; background: #F0F0F2; overflow-y: auto; display: flex; justify-content: center; }
      .email-canvas.canvas-mobile .canvas-inner { max-width: 375px; }
      .canvas-inner { width: 100%; max-width: 600px; background: #fff; border: 2px solid #ECECEE; border-radius: 8px; min-height: 400px; position: relative; transition: border-color 0.15s, border-radius 0.15s; }
      .canvas-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; gap: 12px; }
      .canvas-empty-text { font-size: 14px; color: #999; text-align: center; margin: 0; }

      /* ── Canvas blocks ────────────────────── */
      .canvas-block { position: relative; cursor: pointer; transition: outline 0.1s; }
      .canvas-block:hover { outline: 2px solid #B0BEC5; outline-offset: -2px; }
      .canvas-block-selected { outline: 2px solid #1B1F3B !important; outline-offset: -2px; }
      .block-content { position: relative; min-height: 20px; }

      /* ── Inline editing ───────────────────── */
      .inline-edit { outline: none; cursor: text; min-height: 1em; }
      .inline-edit:focus { background: rgba(27,31,59,0.03); }
      .heading-edit { font-size: 28px; }

      /* ── Block toolbar ────────────────────── */
      .block-toolbar { position: absolute; top: -32px; right: 8px; display: flex; gap: 2px; z-index: 10; background: #1B1F3B; border-radius: 6px; padding: 2px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
      .block-toolbar-btn { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border: none; background: transparent; border-radius: 4px; cursor: pointer; color: #fff; }
      .block-toolbar-btn:hover { background: rgba(255,255,255,0.15); }
      .block-toolbar-delete:hover { background: #E53935; }

      /* ── Drop indicator ───────────────────── */
      .drop-indicator { height: 3px; background: #1B1F3B; border-radius: 2px; margin: 0 20px; }

      /* ── Image block ──────────────────────── */
      .image-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 28px; border: 2px dashed #E0E0E0; border-radius: 8px; color: #999; }
      .image-placeholder p { margin: 0; font-size: 13px; }
      .image-url-input { width: 260px; padding: 6px 10px; border: 1px solid #E0E0E0; border-radius: 6px; font-size: 12px; text-align: center; }

      /* ── Spacer block ─────────────────────── */
      .spacer-block { background: repeating-linear-gradient(45deg, transparent, transparent 4px, #F0F0F2 4px, #F0F0F2 8px); display: flex; align-items: center; justify-content: center; }
      .spacer-label { font-size: 11px; color: #999; background: #fff; padding: 2px 8px; border-radius: 4px; }

      /* ── HTML block ───────────────────────── */
      .html-block-content { min-height: 20px; }
      .html-edit-area { width: 100%; padding: 8px; border: 1px solid #E0E0E0; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 12px; margin-top: 8px; resize: vertical; box-sizing: border-box; }

      /* ── Columns block ────────────────────── */
      .columns-block { display: flex !important; }
      .column-cell { min-height: 60px; border: 1px dashed #E0E0E0; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
      .column-placeholder { font-size: 12px; color: #bbb; }

      /* ── Container block ──────────────────── */
      .container-placeholder { font-size: 12px; color: #bbb; text-align: center; padding: 20px; }

      /* ── Email button ─────────────────────── */
      .email-button { display: inline-block; text-decoration: none; cursor: text; outline: none; }

      /* ═══ STYLES PANEL ═══════════════════════ */
      .styles-panel { width: 260px; border-left: 1px solid #ECECEE; background: #FAFAFA; flex-shrink: 0; display: flex; flex-direction: column; }
      .styles-tabs { display: flex; border-bottom: 1px solid #ECECEE; }
      .styles-tab { flex: 1; padding: 10px; border: none; background: transparent; font-size: 13px; font-weight: 500; color: #888; cursor: pointer; text-align: center; }
      .styles-tab-active { color: #1B1F3B; font-weight: 600; border-bottom: 2px solid #1B1F3B; }
      .styles-body { padding: 16px; overflow-y: auto; flex: 1; }
      .styles-section-title { font-size: 12px; font-weight: 700; color: #1B1F3B; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 14px; }

      .style-field { margin-bottom: 14px; }
      .style-label { display: block; font-size: 12px; font-weight: 500; color: #555; margin-bottom: 5px; }
      .color-input-row { display: flex; gap: 6px; align-items: center; }
      .color-swatch { width: 32px; height: 32px; border: 1px solid #E0E0E0; border-radius: 6px; padding: 2px; cursor: pointer; background: #fff; }
      .style-text-input { flex: 1; padding: 7px 10px; border: 1px solid #E0E0E0; border-radius: 6px; font-size: 12px; color: #1B1F3B; outline: none; }
      .style-text-input.full { width: 100%; box-sizing: border-box; }
      .style-text-input:focus { border-color: #1B1F3B; }
      .style-select { width: 100%; padding: 7px 10px; border: 1px solid #E0E0E0; border-radius: 6px; font-size: 12px; color: #1B1F3B; background: #fff; outline: none; }
      .style-range { width: 100%; margin: 4px 0; }
      .range-value { font-size: 11px; color: #888; }
      .align-buttons { display: flex; gap: 2px; }
      .align-btn { width: 32px; height: 30px; border: 1px solid #E0E0E0; background: #fff; border-radius: 5px; font-size: 12px; font-weight: 600; cursor: pointer; color: #555; }
      .align-btn-active { background: #1B1F3B; color: #fff; border-color: #1B1F3B; }

      /* ── Inspect tab ──────────────────────── */
      .inspect-tree { display: flex; flex-direction: column; gap: 2px; }
      .inspect-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 13px; color: #555; }
      .inspect-item:hover { background: #ECECEE; }
      .inspect-item-active { background: #E8EAF6; color: #1B1F3B; font-weight: 600; }
      .inspect-icon { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: #F0F0F2; border-radius: 4px; font-size: 10px; font-weight: 700; color: #1B1F3B; }
      .inspect-name { flex: 1; }
      .inspect-empty { font-size: 13px; color: #999; margin: 8px 0; }

      /* ── HTML editor mode ─────────────────── */
      .html-editor-container { border: 1px solid #ECECEE; border-top: none; border-radius: 0 0 10px 10px; overflow: hidden; }
      .html-code-editor { width: 100%; padding: 20px; border: none; font-family: 'Courier New', 'Fira Code', monospace; font-size: 13px; color: #1B1F3B; background: #FAFAFA; outline: none; resize: vertical; box-sizing: border-box; line-height: 1.6; tab-size: 2; }

      /* ═══ PREVIEW ═══════════════════════════ */
      .preview-top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      .email-preview-envelope { max-width: 680px; margin: 0 auto; transition: max-width 0.3s; }
      .email-preview-envelope.preview-mobile { max-width: 375px; }
      .email-preview-meta { margin-bottom: 16px; }
      .email-preview-header { font-size: 14px; color: #1B1F3B; margin-bottom: 4px; }
      .email-preview-preheader { font-size: 13px; color: rgba(27,31,59,0.5); }
      .email-preview-rendered { border: 1px solid #ECECEE; border-radius: 8px; min-height: 300px; overflow: hidden; }
      .preview-block { /* rendered inline with styles */ }

      /* ── WhatsApp optional content ───────── */
      .optional-block { border: 1px solid #ECECEE; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
      .optional-block-top { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
      .optional-label { font-size: 14px; font-weight: 600; color: #1B1F3B; }
      .header-types { display: flex; gap: 6px; margin-bottom: 12px; }
      .header-type-btn { padding: 5px 14px; border: 1px solid #E0E0E0; border-radius: 6px; background: #fff; font-size: 12px; color: #1B1F3B; cursor: pointer; }
      .header-type-btn:hover { background: #F6F6F8; }
      .header-type-active { background: #1B1F3B; color: #fff; border-color: #1B1F3B; }
      .upload-area { border: 2px dashed #E0E0E0; border-radius: 8px; padding: 20px; text-align: center; }
      .upload-text { font-size: 13px; color: rgba(27,31,59,0.5); margin: 0; }
      .btn-type-tab { padding: 6px 16px; border: 1px solid #E0E0E0; border-radius: 6px; background: #fff; font-size: 12px; color: #1B1F3B; cursor: pointer; }
      .btn-type-tab-active { background: #1B1F3B; color: #fff; border-color: #1B1F3B; }
      .button-type-tabs { display: flex; gap: 6px; margin-bottom: 14px; }
      .button-row { display: flex; gap: 8px; align-items: center; margin-bottom: 10px; }
      .btn-name-input { width: 120px; flex-shrink: 0; }
      .btn-row-arrow { color: #bbb; font-size: 16px; }
      .btn-type-select { width: 140px; flex-shrink: 0; }
      .btn-add-button { border: none; background: none; color: #1B1F3B; font-size: 13px; font-weight: 600; cursor: pointer; padding: 6px 0; }

      /* ── WhatsApp phone preview ───────────── */
      .wa-preview-panel { margin-top: 28px; }
      .phone-mockup { width: 280px; background: #EDEDED; border-radius: 24px; overflow: hidden; border: 2px solid #D4D4D4; }
      .phone-notch { height: 24px; background: #1B1F3B; border-radius: 0 0 16px 16px; margin: 0 60px; }
      .phone-header-wa { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #075E54; }
      .phone-avatar { width: 32px; height: 32px; border-radius: 50%; background: #25D366; }
      .phone-contact { display: flex; flex-direction: column; }
      .phone-name { font-size: 14px; font-weight: 600; color: #fff; }
      .phone-status { font-size: 11px; color: rgba(255,255,255,0.7); }
      .phone-body { padding: 14px; min-height: 200px; background: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='60' height='60' fill='%23ECE5DD'/%3E%3C/svg%3E"); }
      .wa-bubble { background: #fff; border-radius: 0 8px 8px 8px; padding: 8px 10px; max-width: 220px; position: relative; box-shadow: 0 1px 2px rgba(0,0,0,0.08); }
      .wa-bubble-header { font-size: 13px; font-weight: 700; color: #1B1F3B; margin: 0 0 4px; }
      .wa-bubble-text { font-size: 12px; color: #303030; margin: 0; line-height: 1.4; white-space: pre-wrap; word-break: break-word; }
      .wa-bubble-footer { font-size: 11px; color: #888; margin: 6px 0 0; }
      .wa-bubble-time { font-size: 10px; color: #999; float: right; margin-top: 4px; }
      .wa-bubble-buttons { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; max-width: 220px; }
      .wa-cta-btn { padding: 7px; border: none; border-radius: 6px; background: #fff; font-size: 12px; color: #00A5F4; font-weight: 500; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.06); cursor: default; }

      /* ── footer ──────────────────────────── */
      .form-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 28px; padding-top: 24px; border-top: 1px solid #ECECEE; }
      .btn-cancel { padding: 10px 24px; border: 1px solid #E0E0E0; border-radius: 8px; background: #fff; font-size: 14px; color: #1B1F3B; cursor: pointer; }
      .btn-continue, .btn-submit { padding: 10px 28px; border: none; border-radius: 8px; background: #1B1F3B; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; }
      .btn-continue:hover, .btn-submit:hover { background: #2d3258; }
    </style>
  `,
})
export class BroadcastCreateTemplatePage {
  constructor(private router: Router) {}

  readonly step = signal<'form' | 'preview'>('form');
  readonly channel = signal<'email' | 'whatsapp'>('email');
  readonly showVarMenu = signal(false);

  /* ── form fields ─────────────────────── */
  templateName = '';
  category = '';
  language = '';
  label = '';

  readonly categories = ['Onboarding', 'Marketing', 'Reminder', 'Programme', 'Notification'];
  readonly languages = ['English', 'Bahasa Malaysia', 'Mandarin'];
  readonly variables = ['name', 'email', 'program_name'];

  /* ── email fields ────────────────────── */
  emailSubject = '';
  emailPreheader = '';

  /* ── email visual builder ────────────── */
  readonly emailMode = signal<'visual' | 'html'>('visual');
  readonly previewDevice = signal<'desktop' | 'mobile'>('desktop');
  readonly showBlockPalette = signal(false);
  readonly emailBlocks = signal<EmailBlock[]>([]);
  readonly selectedBlockId = signal<string | null>(null);
  readonly stylesTab = signal<'styles' | 'inspect'>('styles');
  readonly dragSource = signal<'palette' | 'reorder' | null>(null);
  readonly dropTargetIndex = signal<number | null>(null);

  rawHtmlContent = '';
  private draggedBlockType = '';
  private draggedBlockIndex = -1;

  canvasStyles = {
    borderColor: '#ECECEE',
    borderRadius: '8px',
    borderRadiusNum: 8,
    fontFamily: 'Arial, sans-serif',
    textColor: '#333333',
    bgColor: '#ffffff',
  };

  readonly fontFamilies = [
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Verdana, sans-serif',
    'Tahoma, sans-serif',
    'Trebuchet MS, sans-serif',
    'Courier New, monospace',
  ];

  readonly blockTypes = ['heading', 'text', 'button', 'image', 'divider', 'spacer', 'html', 'columns', 'container'];
  readonly blockIcons = BLOCK_ICONS;
  readonly blockLabels = BLOCK_LABELS;

  selectedBlock = computed(() => {
    const id = this.selectedBlockId();
    if (!id) return null;
    return this.emailBlocks().find(b => b.id === id) || null;
  });

  /* ── drag & drop from palette ────────── */
  onPaletteDragStart(event: DragEvent, type: string): void {
    this.draggedBlockType = type;
    this.dragSource.set('palette');
    event.dataTransfer?.setData('text/plain', type);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy';
  }

  onCanvasDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = this.dragSource() === 'palette' ? 'copy' : 'move';
  }

  onCanvasDragLeave(event: DragEvent): void {
    this.dropTargetIndex.set(null);
  }

  onCanvasDrop(event: DragEvent): void {
    event.preventDefault();
    if (this.dragSource() === 'palette' && this.draggedBlockType) {
      const block = createBlock(this.draggedBlockType);
      const idx = this.dropTargetIndex() ?? this.emailBlocks().length;
      const blocks = [...this.emailBlocks()];
      blocks.splice(idx, 0, block);
      this.emailBlocks.set(blocks);
      this.selectedBlockId.set(block.id);
      this.showBlockPalette.set(false);
    }
    this.dragSource.set(null);
    this.dropTargetIndex.set(null);
    this.draggedBlockType = '';
  }

  /* ── drag & drop reorder ─────────────── */
  onBlockDragStart(event: DragEvent, index: number): void {
    this.draggedBlockIndex = index;
    this.dragSource.set('reorder');
    event.dataTransfer?.setData('text/plain', String(index));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  onBlockDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    if (this.dragSource() === 'reorder') {
      this.dropTargetIndex.set(index);
    } else if (this.dragSource() === 'palette') {
      this.dropTargetIndex.set(index);
    }
  }

  onBlockDrop(event: DragEvent, index: number): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.dragSource() === 'reorder' && this.draggedBlockIndex >= 0) {
      const blocks = [...this.emailBlocks()];
      const [moved] = blocks.splice(this.draggedBlockIndex, 1);
      const targetIndex = index > this.draggedBlockIndex ? index - 1 : index;
      blocks.splice(targetIndex, 0, moved);
      this.emailBlocks.set(blocks);
    } else if (this.dragSource() === 'palette' && this.draggedBlockType) {
      const block = createBlock(this.draggedBlockType);
      const blocks = [...this.emailBlocks()];
      blocks.splice(index, 0, block);
      this.emailBlocks.set(blocks);
      this.selectedBlockId.set(block.id);
      this.showBlockPalette.set(false);
    }

    this.dragSource.set(null);
    this.dropTargetIndex.set(null);
    this.draggedBlockIndex = -1;
    this.draggedBlockType = '';
  }

  onBlockDragEnd(): void {
    this.dragSource.set(null);
    this.dropTargetIndex.set(null);
    this.draggedBlockIndex = -1;
  }

  /* ── block operations ────────────────── */
  addBlockToCanvas(type: string): void {
    const block = createBlock(type);
    this.emailBlocks.update(blocks => [...blocks, block]);
    this.selectedBlockId.set(block.id);
    this.showBlockPalette.set(false);
  }

  selectBlock(id: string, event: Event): void {
    event.stopPropagation();
    this.selectedBlockId.set(id);
    this.stylesTab.set('styles');
  }

  moveBlock(index: number, direction: number): void {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= this.emailBlocks().length) return;
    const blocks = [...this.emailBlocks()];
    [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
    this.emailBlocks.set(blocks);
  }

  duplicateBlock(index: number): void {
    const original = this.emailBlocks()[index];
    const copy: EmailBlock = {
      ...original,
      id: `block_${++_blockIdCounter}_${Date.now()}`,
      styles: { ...original.styles },
      children: original.children ? [...original.children] : undefined,
    };
    const blocks = [...this.emailBlocks()];
    blocks.splice(index + 1, 0, copy);
    this.emailBlocks.set(blocks);
    this.selectedBlockId.set(copy.id);
  }

  deleteBlock(index: number): void {
    const blocks = [...this.emailBlocks()];
    blocks.splice(index, 1);
    this.emailBlocks.set(blocks);
    this.selectedBlockId.set(null);
  }

  onContentEdit(event: Event, block: EmailBlock): void {
    const el = event.target as HTMLElement;
    block.content = el.innerText || el.textContent || '';
  }

  onImageUrl(event: Event, block: EmailBlock): void {
    const input = event.target as HTMLInputElement;
    block.styles['src'] = input.value;
  }

  trackBlock(index: number, block: EmailBlock): string {
    return block.id;
  }

  getColumnArray(block: EmailBlock): number[] {
    return Array.from({ length: block.columnCount || 2 }, (_, i) => i);
  }

  insertVariableToBlock(v: string): void {
    const sel = this.selectedBlock();
    if (sel && (sel.type === 'heading' || sel.type === 'text')) {
      sel.content += `{{${v}}}`;
    }
    this.showVarMenu.set(false);
  }

  /* ── HTML mode ───────────────────────── */
  switchToHtml(): void {
    // Generate HTML from blocks
    this.rawHtmlContent = this.blocksToHtml();
    this.emailMode.set('html');
  }

  private blocksToHtml(): string {
    return this.emailBlocks().map(block => {
      switch (block.type) {
        case 'heading':
          return `<h1 style="font-size:${block.styles['fontSize']};font-weight:${block.styles['fontWeight']};color:${block.styles['color']};text-align:${block.styles['textAlign']};padding:${block.styles['padding']};margin:0;">${block.content}</h1>`;
        case 'text':
          return `<p style="font-size:${block.styles['fontSize']};color:${block.styles['color']};line-height:${block.styles['lineHeight']};text-align:${block.styles['textAlign']};padding:${block.styles['padding']};margin:0;">${block.content}</p>`;
        case 'button':
          return `<div style="text-align:${block.styles['buttonAlign']};padding:${block.styles['padding']};"><a href="${block.styles['url'] || '#'}" style="display:inline-block;background:${block.styles['backgroundColor']};color:${block.styles['color']};font-size:${block.styles['fontSize']};font-weight:${block.styles['fontWeight']};padding:${block.styles['padding']};border-radius:${block.styles['borderRadius']};text-decoration:none;">${block.content}</a></div>`;
        case 'image':
          return block.styles['src']
            ? `<div style="padding:${block.styles['padding']};"><img src="${block.styles['src']}" alt="${block.styles['alt']}" style="width:${block.styles['width']};max-width:100%;height:auto;display:block;" /></div>`
            : `<!-- Image placeholder -->`;
        case 'divider':
          return `<hr style="border:none;border-top:${block.styles['borderWidth']} ${block.styles['borderStyle']} ${block.styles['borderColor']};margin:0;padding:${block.styles['padding']};" />`;
        case 'spacer':
          return `<div style="height:${block.styles['height']};"></div>`;
        case 'html':
          return block.content;
        case 'columns':
          const cols = Array.from({ length: block.columnCount || 2 }, (_, i) =>
            `<td style="width:${100 / (block.columnCount || 2)}%;padding:8px;">Column ${i + 1}</td>`
          ).join('');
          return `<table style="width:100%;padding:${block.styles['padding']};"><tr>${cols}</tr></table>`;
        case 'container':
          return `<div style="background:${block.styles['backgroundColor']};border-radius:${block.styles['borderRadius']};padding:${block.styles['padding']};border:${block.styles['border']};">Container</div>`;
        default:
          return '';
      }
    }).join('\n');
  }

  /* ── whatsapp fields ─────────────────── */
  waBody = '';
  waHeaderText = '';
  waHeaderLocation = '';
  waFooter = '';

  readonly headerTypes = ['Text', 'Image', 'Video', 'Document', 'Location'] as const;
  readonly waHeaderType = signal<string>('Text');
  readonly waButtonMode = signal<'cta' | 'quick'>('cta');
  readonly waButtons = signal<Array<{ name: string; actionType: string; value: string }>>([
    { name: '', actionType: '', value: '' },
    { name: '', actionType: '', value: '' },
  ]);

  addButton(): void {
    this.waButtons.update((b) => [...b, { name: '', actionType: '', value: '' }]);
  }

  insertVariable(v: string): void {
    const tag = `{{${v}}}`;
    if (this.channel() === 'email') {
      // In email mode, try to add to selected block
      this.insertVariableToBlock(v);
    } else {
      this.waBody += tag;
    }
    this.showVarMenu.set(false);
  }

  goToPreview(): void {
    this.step.set('preview');
  }

  saveDraft(): void {
    alert('Template saved as draft.');
  }

  discard(): void {
    this.router.navigate(['/dashboard/broadcasts']);
  }

  submitTemplate(): void {
    alert(this.channel() === 'whatsapp'
      ? 'WhatsApp template submitted for approval!'
      : 'Email template saved successfully!');
    this.router.navigate(['/dashboard/broadcasts']);
  }
}
