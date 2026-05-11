import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Expert {
  name: string; role: string; image: string;
}

@Component({
  selector: 'mereka-program-landing',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './program-landing.page.html',
})
export class ProgramLandingPage {
  /* Hero collage photos */
  readonly heroPhotos = [
    { src: 'img/program-landing/hero-1.jpg', delta: 0 },
    { src: 'img/program-landing/hero-2.jpg', delta: -32 },
    { src: 'img/program-landing/hero-3.jpg', delta: 16 },
    { src: 'img/program-landing/hero-4.jpg', delta: -16 },
  ];

  /* Top brand bar */
  readonly partnerBrands = ['AVPN', 'mereka', 'AI4U', 'Google.org', 'KORIKA', 'ADB'];

  /* "By the end of the program, you learn to" outcomes — pill chips with check icons */
  readonly outcomes = [
    'Understand prompt basics',
    'Write clear, effective prompts',
    'Personalise prompts',
    'Use prompting techniques to save time',
    'Apply prompts for work, creativity, and problem-solving',
    'Automate simple tasks with AI tools',
    'Evaluate & refine AI responses',
  ];

  /* "AI4U Program Includes" 3-column grid */
  readonly includes = [
    { title: 'Course Modules', tag: '7',
      items: ['Explore Generative AI', 'Internet Search & Beyond', 'Explore Generative AI', 'Unlock Creative Potential', 'Transform Design Processes', 'Enhance User Engagement'],
    },
    { title: 'Experiences', tag: '3',
      items: ['Image Gen Crash Course', 'Advanced AI Prompting', 'Understanding AI Gen'],
    },
    { title: 'Expertise', tag: '3',
      items: ['Image Gen Crash Course', 'Advanced AI Prompting', 'Understanding AI Gen'],
    },
  ];

  readonly handsOn = [
    { icon: '🧑‍🏫', title: 'Live Webinars & Virtual Trainings', body: 'Master AI tools and prompt engineering with guided practice.' },
    { icon: '👥', title: 'In-Person Workshops', body: 'Learn face-to-face through hands-on projects and teamwork.' },
    { icon: '💬', title: 'WhatsApp Community Group', body: 'Stay connected with weekly AI hacks, discussions, and updates.' },
    { icon: '✨', title: 'AI Coaching Circles', body: 'Receive guidance and apply AI to real-world problems.' },
  ];

  readonly experts: Expert[] = [
    { name: 'Jey Bola', role: 'Chief Ecosystem Officer @ Mereka — Expert in sustainability and business transformation, trainer at Mereka and impacting 100k+ with innovative workshops.', image: 'img/program-landing/expert-1.jpg' },
    { name: 'Rashvin Pal Singh', role: 'Group CEO @ Mereka — Deeply passionate about inclusive & creative economies, social innovation, platforms business models, music, and people.', image: 'img/program-landing/expert-2.jpg' },
    { name: 'Mola K', role: 'Manager, Training & Mentorship — Advocate for free, equitable education, and trained hundreds and seeks to empower youth to pursue their passions and dreams.', image: 'img/program-landing/expert-3.jpg' },
    { name: 'Gurpreet T Singh', role: 'Space & Ecosystem Senior Associate — Seasoned Project Manager skilled in strategic leadership and adaptability, excels in guiding projects to success in dynamic environments.', image: 'img/program-landing/expert-4.jpg' },
  ];

  readonly faqs = [
    { q: 'What is AI4U?', a: 'AI4U is a FREE programme by Mereka × AVPN to equip 10,000 Malaysians and Indonesians with practical, real-world AI skills.' },
    { q: 'Is it free to join AI4U?', a: 'Yes. The full self-paced track is free. Optional 1-day add-ons (custom training, certificates) are paid.' },
    { q: 'When will the self-paced micro-learning courses be released?', a: 'Modules unlock weekly on Mondays at 9am MYT. The first 3 modules are available immediately on enrolment.' },
    { q: 'How can I get updates about upcoming events?', a: 'Join the WhatsApp community group — all live workshop announcements are posted there 48 hours in advance.' },
    { q: 'Are the courses relevant to me?', a: 'Yes — the modules are designed for non-engineers across marketing, ops, customer support, education and SMB owners.' },
    { q: 'Do I need a technical background to join?', a: "No. AI4U is beginner-friendly. We start from 'I've heard of ChatGPT' and end with you shipping a working prompt pack." },
    { q: 'How long will I have access to the courses?', a: 'Lifetime access to all videos, slides and your peer community channel.' },
    { q: 'What kind of AI tools will I learn about?', a: 'ChatGPT, Claude, Gemini, Midjourney, Microsoft Copilot, plus a handful of automation tools (Make, Zapier).' },
    { q: 'Will there be certificates for course completion?', a: 'Yes — 4 individual certificates per module + a Mereka × Google.org program certificate at the end.' },
    { q: 'How can I partner or collaborate with AI4U?', a: 'Email partnerships@mereka.io with a short brief and our team will be in touch within 3 working days.' },
  ];
  readonly openFaq = signal<number>(0);
  toggleFaq(i: number): void { this.openFaq.update((o) => (o === i ? -1 : i)); }
}
