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
    { name: 'Website Development', color: 'bg-green-100', image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=300&h=200&fit=crop' },
    { name: 'Logo & Branding', color: 'bg-rose-100', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&h=200&fit=crop' },
    { name: 'Content Writing', color: 'bg-pink-100', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop' },
    { name: 'Social Media Marketing', color: 'bg-teal-100', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop' },
    { name: 'Voice Over', color: 'bg-orange-100', image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=200&fit=crop' },
    { name: 'Interior Design & Architecture', color: 'bg-neutral-800 text-white', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&h=200&fit=crop' },
    { name: 'Data Science & ML', color: 'bg-amber-100', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
  ];

  readonly featuredExperts = [
    {
      name: 'Diana Che',
      title: 'Presentation Specialist, Consulting Beauty',
      tags: ['Graphic Design', 'Slide/Pitch Design', 'Data/Info Management'],
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana&backgroundColor=b6e3f4',
      rating: 5.0,
      reviews: 12,
    },
    {
      name: 'Rauf Hantie',
      title: 'Pricing Brighter Futures, Life Mentor, Marketing & Communications Expert',
      tags: ['Graphic Design', 'Content/Portfolio Manage...', 'Photo Production/Editing'],
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rauf&backgroundColor=c0aede',
      rating: 4.9,
      reviews: 8,
    },
    {
      name: 'Nur Diana Sukhrani',
      title: 'Sustainability strategist across media, Communications specialist',
      tags: ['Graphic Design', 'Slide/Pitch Design', 'Photo Production/Editing'],
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nur&backgroundColor=d1d4f9',
      rating: 5.0,
      reviews: 15,
    },
    {
      name: 'Taaeen Sofean',
      title: 'Pioneering Green Fashion, Practitioner of AI in Sustainability',
      tags: ['Graphic Design', 'Slide/Pitch Design', 'Photo Production/Editing'],
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taaeen&backgroundColor=ffd5dc',
      rating: 4.8,
      reviews: 6,
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
