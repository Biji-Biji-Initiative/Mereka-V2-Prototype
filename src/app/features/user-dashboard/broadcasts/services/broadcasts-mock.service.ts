import { Injectable, signal } from '@angular/core';
import {
  BroadcastSummary,
  Cohort,
  EmailTemplate,
  Recipient,
  WhatsappTemplate,
} from './broadcasts.types';

@Injectable({ providedIn: 'root' })
export class BroadcastsMockService {
  readonly cohorts = signal<Cohort[]>([
    { id: 'c1', name: 'AI ACCELERATOR (AI4U)',       serviceCategory: 'programme',  cohortLabel: 'Cohort APR 2026', memberCount: 28 },
    { id: 'c2', name: 'GENERATIVE AI WORKSHOP',      serviceCategory: 'experience', cohortLabel: 'Cohort APR 2026', memberCount: 12 },
    { id: 'c3', name: 'CLIMATE INNOVATORS',          serviceCategory: 'programme',  cohortLabel: 'Cohort JUN 2026', memberCount: 45 },
    { id: 'c4', name: 'UX DESIGN BOOTCAMP',          serviceCategory: 'experience', cohortLabel: 'Cohort APR 2026', memberCount: 50 },
    { id: 'c5', name: 'INTRO TO DATA ANALYTICS',     serviceCategory: 'course',     cohortLabel: 'Self-paced',      memberCount: 380 },
  ]);

  readonly recipients = signal<Recipient[]>(
    [
      'young.zheng@uxagents.com', 'nicholashon@uxagents.com', 'faiz@mereka.my',
      'florencejones@gmail.com', 'natalie123a@gmail.com', 'james.smith@outlook.com',
      'samantha.jones@yahoo.com', 'michael.brown@gmail.com', 'emily.davis@hotmail.com',
      'chris.wilson@icloud.com', 'olivia.johnson@fakemail.com', 'daniel.miller@live.com',
    ].flatMap((e, i) => Array.from({ length: 4 }, (_, j) => ({ id: `r${i}-${j}`, email: e }))),
  );

  readonly broadcasts = signal<BroadcastSummary[]>([
    { id: 'b1', name: 'Welcome to AI Accelerator (Cohort APR 2026)', channel: 'email',    category: 'onboarding',  status: 'sent',      recipientCount: 28,  openRate: 86, clickRate: 41, sentAt: '2026-04-12T09:00:00Z', templateId: 't-welcome' },
    { id: 'b2', name: 'Reminder · Generative AI Workshop kickoff',  channel: 'whatsapp', category: 'reminder',    status: 'scheduled', recipientCount: 12,  scheduledFor: '2026-05-15T08:00:00Z', templateId: 'wa-kickoff' },
    { id: 'b3', name: 'May spotlight: new makers programme',         channel: 'email',    category: 'promotion',   status: 'draft',     recipientCount: 0,   templateId: 't-spotlight' },
    { id: 'b4', name: 'Climate Innovators · session 4 follow-up',    channel: 'email',    category: 'announcement',status: 'sent',      recipientCount: 45,  openRate: 72, clickRate: 28, sentAt: '2026-04-25T14:00:00Z', templateId: 't-followup' },
    { id: 'b5', name: 'UX Bootcamp · weekly digest',                 channel: 'in_app',   category: 'announcement',status: 'sent',      recipientCount: 50,  openRate: 64, clickRate: 22, sentAt: '2026-04-28T11:00:00Z' },
    { id: 'b6', name: 'WhatsApp pulse · feedback request',           channel: 'whatsapp', category: 'transactional',status: 'sending',  recipientCount: 380,                            templateId: 'wa-feedback' },
    { id: 'b7', name: 'Promotion · Soar plan early access',          channel: 'email',    category: 'promotion',   status: 'failed',    recipientCount: 1240,                             templateId: 't-soar' },
    { id: 'b8', name: 'Onboarding · finish your profile',            channel: 'in_app',   category: 'onboarding',  status: 'scheduled', recipientCount: 86,  scheduledFor: '2026-05-20T07:00:00Z' },
  ]);

  readonly emailTemplates = signal<EmailTemplate[]>([
    {
      id: 't-welcome',
      name: 'Welcome — Cohort kickoff',
      subject: 'Hi {{first_name}}, welcome to {{cohort_name}}',
      preheader: 'Your first session details, what to expect, and how to prepare.',
      pages: [
        {
          id: 'p1',
          name: 'Welcome screen',
          blocks: [
            { id: 'b1', type: 'image',     src: '',                                    alt: 'Cohort hero',           size: 'large',  align: 'center' },
            { id: 'b2', type: 'heading',   text: 'Hi! Welcome to {{cohort_name}}',     size: 'h1',                   align: 'center' },
            { id: 'b3', type: 'paragraph', text: 'We\'re thrilled to have you. Below is everything you need to get started.', align: 'center' },
            { id: 'b4', type: 'button',    label: 'Start',                              href: 'https://mereka.io',    align: 'center' },
          ],
        },
        {
          id: 'p2',
          name: 'What to expect',
          blocks: [
            { id: 'b5', type: 'heading',   text: 'What to expect',                      size: 'h2',                   align: 'left' },
            { id: 'b6', type: 'paragraph', text: 'Six live sessions, hands-on labs, and a final showcase. We meet every Thursday at 7pm KL.', align: 'left' },
            { id: 'b7', type: 'divider' },
            { id: 'b8', type: 'button',    label: 'View schedule',                      href: 'https://mereka.io',    align: 'left' },
          ],
        },
      ],
      design: {
        logoSize: 'small',
        logoAlign: 'left',
        buttonColor: '#1a1623',
        backgroundColor: '#ffffff',
      },
      integrations: [
        { id: 'clickup',  label: 'ClickUp Integration',        connected: true,  iconBg: '#e9d5ff' },
        { id: 'sheets',   label: 'Google Sheets Integration',  connected: false, iconBg: '#bbf7d0' },
        { id: 'zapier',   label: 'Zapier Integration',         connected: false, iconBg: '#fed7aa' },
        { id: 'webhook',  label: 'Webhook Integration',        connected: false, iconBg: '#bfdbfe' },
      ],
      updatedAt: '2026-04-30T12:00:00Z',
    },
    {
      id: 't-spotlight',
      name: 'Monthly spotlight',
      subject: 'May spotlight: new makers programme',
      preheader: 'Three new programmes, one new way to learn.',
      pages: [
        {
          id: 'p1',
          name: 'Spotlight',
          blocks: [
            { id: 'b1', type: 'heading',   text: 'May spotlight',                       size: 'h1', align: 'left' },
            { id: 'b2', type: 'paragraph', text: 'Three brand-new programmes, picked by our community team.', align: 'left' },
            { id: 'b3', type: 'spacer',    height: 16 },
            { id: 'b4', type: 'button',    label: 'Browse all',                          href: 'https://mereka.io',  align: 'left' },
          ],
        },
      ],
      design: { logoSize: 'medium', logoAlign: 'left', buttonColor: '#1a1623', backgroundColor: '#f9fafb' },
      integrations: [
        { id: 'clickup',  label: 'ClickUp Integration',        connected: false, iconBg: '#e9d5ff' },
        { id: 'sheets',   label: 'Google Sheets Integration',  connected: true,  iconBg: '#bbf7d0' },
      ],
      updatedAt: '2026-04-22T09:00:00Z',
    },
    {
      id: 't-followup',
      name: 'Session follow-up',
      subject: '{{cohort_name}} · session {{n}} follow-up',
      preheader: 'Replay link, key takeaways, and the next step.',
      pages: [
        {
          id: 'p1',
          name: 'Replay',
          blocks: [
            { id: 'b1', type: 'heading',   text: 'Thanks for joining', size: 'h1', align: 'left' },
            { id: 'b2', type: 'paragraph', text: 'Here\'s the replay and the key takeaways from session {{n}}.', align: 'left' },
            { id: 'b3', type: 'button',    label: 'Watch replay', href: 'https://mereka.io', align: 'left' },
          ],
        },
      ],
      design: { logoSize: 'small', logoAlign: 'left', buttonColor: '#1a1623', backgroundColor: '#ffffff' },
      integrations: [],
      updatedAt: '2026-04-26T10:00:00Z',
    },
    {
      id: 't-soar',
      name: 'Soar plan early access',
      subject: 'Be among the first on Soar',
      preheader: 'Early access opens this week.',
      pages: [
        {
          id: 'p1',
          name: 'Hero',
          blocks: [
            { id: 'b1', type: 'heading',   text: 'Soar is here',                         size: 'h1', align: 'center' },
            { id: 'b2', type: 'paragraph', text: 'Unlimited audiences, KPI builder, B40 reporting and more.', align: 'center' },
            { id: 'b3', type: 'button',    label: 'Claim early access',                  href: 'https://mereka.io', align: 'center' },
          ],
        },
      ],
      design: { logoSize: 'medium', logoAlign: 'center', buttonColor: '#9333ea', backgroundColor: '#faf5ff' },
      integrations: [],
      updatedAt: '2026-04-18T08:00:00Z',
    },
  ]);

  readonly whatsappTemplates = signal<WhatsappTemplate[]>([
    {
      id: 'wa-kickoff',
      name: 'cohort_kickoff_reminder',
      language: 'en_US',
      category: 'UTILITY',
      status: 'approved',
      headerType: 'text',
      headerText: 'Kickoff tomorrow — {{cohort_name}}',
      body: 'Hi {{1}}, this is a reminder that {{cohort_name}} kicks off tomorrow at {{time}}. We can\'t wait to see you there!',
      footer: 'You\'re receiving this from Mereka.',
      buttons: [
        { id: 'btn1', type: 'cta-url',     label: 'Join session', value: 'https://mereka.io/session' },
        { id: 'btn2', type: 'quick-reply', label: 'I\'ll be there' },
        { id: 'btn3', type: 'quick-reply', label: 'I need to reschedule' },
      ],
      variables: [
        { name: '1', sample: 'Aisha' },
        { name: 'cohort_name', sample: 'AI Accelerator' },
        { name: 'time', sample: '7pm MYT' },
      ],
      updatedAt: '2026-04-10T08:00:00Z',
    },
    {
      id: 'wa-feedback',
      name: 'feedback_request',
      language: 'en_US',
      category: 'UTILITY',
      status: 'approved',
      headerType: 'none',
      body: 'Hi {{1}}, mind sharing 2 mins of feedback on {{cohort_name}}? Your response shapes the next cohort.',
      footer: 'Reply STOP to opt out.',
      buttons: [
        { id: 'btn1', type: 'cta-url',     label: 'Give feedback', value: 'https://mereka.io/feedback' },
        { id: 'btn2', type: 'quick-reply', label: 'Maybe later' },
      ],
      variables: [
        { name: '1', sample: 'Daniel' },
        { name: 'cohort_name', sample: 'Climate Innovators' },
      ],
      updatedAt: '2026-04-28T14:00:00Z',
    },
    {
      id: 'wa-promo',
      name: 'soar_early_access',
      language: 'en_US',
      category: 'MARKETING',
      status: 'pending',
      headerType: 'image',
      body: 'Hi {{1}}, Soar early access is open. Reply or tap below to claim your slot.',
      buttons: [
        { id: 'btn1', type: 'cta-url',     label: 'Claim now', value: 'https://mereka.io/soar' },
        { id: 'btn2', type: 'quick-reply', label: 'Tell me more' },
      ],
      variables: [{ name: '1', sample: 'Nina' }],
      updatedAt: '2026-04-15T10:00:00Z',
    },
  ]);

  // ---- helpers used by pages ----

  emailTemplate(id: string) {
    return this.emailTemplates().find((t) => t.id === id);
  }
  whatsappTemplate(id: string) {
    return this.whatsappTemplates().find((t) => t.id === id);
  }
  broadcast(id: string) {
    return this.broadcasts().find((b) => b.id === id);
  }
}
