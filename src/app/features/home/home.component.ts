import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'mereka-home',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
})
export class HomeComponent {
  readonly popularServices = [
    { name: 'Website Development', image: 'img/home/service-1.png' },
    { name: 'Logo & Branding', image: 'img/home/service-2.png' },
    { name: 'Content Writing', image: 'img/home/service-3.png' },
    { name: 'Social Media Marketing', image: 'img/home/service-4.png' },
    { name: 'Voice Over', image: 'img/home/service-5.png' },
    { name: 'Interior Design & Architecture', image: 'img/home/service-6.png' },
    { name: 'Data Science & ML', image: 'img/home/service-7.png' },
  ];

  readonly featuredExperts = [
    {
      name: 'Debra Chia',
      title: 'Blockchain Innovator: Ensuring Secure Transactions for 100+ Fintech Clients, Decade at the Industry\'s Edge',
      tags: ['Project Management', 'Social Media Manager', 'Graphic Design', 'Video Production & Editing'],
      image: 'img/home/expert-1.png',
    },
    {
      name: 'Razif Hashim',
      title: 'Shaping Brighter Futures, 15+ Years Specializing in Adolescent Therapy with Compassionate Care',
      tags: ['Project Management', 'Social Media Manager', 'Graphic Design', 'Video Production & Editing'],
      image: 'img/home/expert-2.png',
    },
    {
      name: 'Nur Deena Syahirah',
      title: 'Successfully managed social media campaigns for diverse clients, driving engagement and growth for 7 years',
      tags: ['Project Management', 'Social Media Manager', 'Graphic Design', 'Video Production & Editing'],
      image: 'img/home/expert-3.png',
    },
    {
      name: 'Tauqeer Rafique',
      title: 'Pioneering Fusion Cuisine, Featured Chef in 20+ International Food Magazines, a Taste Revolution',
      tags: ['Project Management', 'Social Media Manager', 'Graphic Design', 'Video Production & Editing'],
      image: 'img/home/expert-4.png',
    },
  ];

  readonly testimonials = [
    {
      name: 'Nicholas Han',
      avatar: 'NH',
      rating: 5,
      text: "Mereka's milestone contract and payment feature helps me better manage my freelance finances.",
      role: 'Freelance, UX Designer',
      stat1: 'USD 1,500',
      stat1Label: '5 Orders',
    },
    {
      name: 'Microsoft',
      avatar: 'MS',
      rating: 5,
      text: '"One of the advantages of utilising freelancers is finding talent with different skills quickly as our needs change."',
      role: 'Donna Hidayat, Director of Human Resources',
      stat1: '1,500',
      stat1Label: '50%',
    },
    {
      name: 'Nicholas Han',
      avatar: 'NH',
      rating: 5,
      text: "Mereka's milestone contract and payment feature helps me better manage my freelance finances.",
      role: 'Freelance, UX Designer',
      stat1: 'USD 1,500',
      stat1Label: '5 Orders',
    },
  ];

  readonly recentGigs = [
    { title: 'Regulatory Reporting Expert - Transaction Reporting - EMIR and DDS', company: 'Client: Undisclosed', type: 'Project based', rate: 'Price: MYR 3000 - MYR 7700', posted: '7 days ago' },
    { title: 'Regulatory Reporting Expert - Transaction Reporting - EMIR and DDS', company: 'Client: Undisclosed', type: 'Project based', rate: 'Price: MYR 3000 - MYR 7700', posted: '7 days ago' },
    { title: 'Regulatory Reporting Expert - Transaction Reporting', company: 'Client: Undisclosed', type: 'Project based', rate: 'Price: MYR 3000 - MYR 7700', posted: '7 days ago' },
    { title: 'Regulatory Reporting Expert - Transaction Reporting', company: 'Client: Undisclosed', type: 'Project based', rate: 'Price: MYR 3000 - MYR 7700', posted: '7 days ago' },
  ];

  readonly talentSteps = [
    { icon: '💰', title: 'Offer up to what you earn', desc: 'Create a FREE account and start listing your services.' },
    { icon: '🔍', title: 'Browse and apply to open gigs', desc: 'Find remote work and apply for short-term contract work.' },
    { icon: '🔗', title: 'Create consultation slots', desc: 'Setup availability, mentorship programmes and attractive sessions.' },
  ];
}
