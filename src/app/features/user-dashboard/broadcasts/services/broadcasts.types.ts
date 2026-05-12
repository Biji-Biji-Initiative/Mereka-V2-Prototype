// Broadcast / messaging types. Designs: 64 frames anchored at 5208:166800 in
// the Mereka Onboarding UXA file. Covers list, compose wizard, email template
// builder (form-builder canvas pattern) and WhatsApp template builder.

export type BroadcastChannel = 'email' | 'whatsapp' | 'in_app';
export type BroadcastStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
export type BroadcastCategory = 'onboarding' | 'promotion' | 'reminder' | 'announcement' | 'transactional';

export interface Cohort {
  id: string;
  name: string;          // "AI ACCELERATOR (AI4U)"
  serviceCategory: 'programme' | 'experience' | 'course' | 'expertise' | 'gig';
  cohortLabel: string;   // "Cohort APR 2026"
  memberCount: number;
}

export interface Recipient {
  id: string;
  email: string;
  name?: string;
  phone?: string;        // for WhatsApp
}

export interface BroadcastSummary {
  id: string;
  name: string;
  channel: BroadcastChannel;
  category: BroadcastCategory;
  status: BroadcastStatus;
  recipientCount: number;
  openRate?: number;     // 0..100, only for sent
  clickRate?: number;
  sentAt?: string;       // ISO
  scheduledFor?: string; // ISO
  templateId?: string;
}

// -------- Email template (form-builder style, multi-page block layout) ---------

export type EmailBlockType = 'heading' | 'paragraph' | 'image' | 'button' | 'divider' | 'spacer' | 'columns';

export interface EmailBlockBase {
  id: string;
  type: EmailBlockType;
}
export interface EmailHeadingBlock extends EmailBlockBase {
  type: 'heading';
  text: string;
  size: 'h1' | 'h2' | 'h3';
  align: 'left' | 'center' | 'right';
}
export interface EmailParagraphBlock extends EmailBlockBase {
  type: 'paragraph';
  text: string;
  align: 'left' | 'center' | 'right';
}
export interface EmailImageBlock extends EmailBlockBase {
  type: 'image';
  src: string;            // data URL or remote URL
  alt: string;
  size: 'small' | 'medium' | 'large';
  align: 'left' | 'center' | 'right';
}
export interface EmailButtonBlock extends EmailBlockBase {
  type: 'button';
  label: string;
  href: string;
  align: 'left' | 'center' | 'right';
}
export interface EmailDividerBlock extends EmailBlockBase { type: 'divider'; }
export interface EmailSpacerBlock extends EmailBlockBase { type: 'spacer'; height: number; }
export interface EmailColumnsBlock extends EmailBlockBase { type: 'columns'; left: EmailBlock[]; right: EmailBlock[]; }

export type EmailBlock =
  | EmailHeadingBlock
  | EmailParagraphBlock
  | EmailImageBlock
  | EmailButtonBlock
  | EmailDividerBlock
  | EmailSpacerBlock
  | EmailColumnsBlock;

export interface EmailPage {
  id: string;
  name: string;           // "Welcome screen"
  blocks: EmailBlock[];
}

export interface EmailTemplate {
  id: string;
  name: string;           // "My New Form" in the design — Mereka calls these templates
  subject: string;
  preheader: string;
  pages: EmailPage[];
  design: {
    logoUrl?: string;
    logoSize: 'small' | 'medium' | 'large';
    logoAlign: 'left' | 'center' | 'right';
    buttonColor: string;
    backgroundColor: string;
  };
  integrations: { id: string; label: string; connected: boolean; iconBg: string }[];
  updatedAt: string;
}

// -------- WhatsApp template ---------

export type WaHeaderType = 'none' | 'text' | 'image' | 'video' | 'document';
export type WaButtonType = 'cta-url' | 'cta-phone' | 'quick-reply';

export interface WaButton {
  id: string;
  type: WaButtonType;
  label: string;
  value?: string;          // url / phone
}

export interface WhatsappTemplate {
  id: string;
  name: string;            // snake_case meta-template name
  language: string;        // 'en_US'
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  headerType: WaHeaderType;
  headerText?: string;
  headerMediaUrl?: string;
  body: string;            // supports {{1}}, {{2}} variables
  footer?: string;
  buttons: WaButton[];
  variables: { name: string; sample: string }[];
  updatedAt: string;
}
