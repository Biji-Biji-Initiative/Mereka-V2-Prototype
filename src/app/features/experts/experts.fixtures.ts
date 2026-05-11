export interface Expert {
  id: string; slug: string; name: string; tagline: string; bio: string;
  avatar: string; banner: string;
  location: { city: string; country: string };
  hubName: string; hubSlug: string;
  skills: string[];
  rating: { average: number; total: number };
  stats: { expertiseListings: number; experiencesHosted: number; gigsCompleted: number };
}

export const EXPERTS: Expert[] = [
  { id: 'exp_aisha', slug: 'aisha-rahman', name: 'Aisha Rahman', tagline: 'Senior AI PM · ex-Google · AI4U mentor', bio: 'I help non-engineers ship AI products. 8 years at Google PM-ing language models. Now leading AI products at a Series C startup and mentoring at AI4U.', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=AishaR', banner: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1400&q=70&auto=format&fit=crop', location: { city: 'Kuala Lumpur', country: 'Malaysia' }, hubName: 'AI4U Collective', hubSlug: 'ai4u', skills: ['AI Product', 'PRDs', 'Eval design', 'Roadmapping'], rating: { average: 4.9, total: 38 }, stats: { expertiseListings: 2, experiencesHosted: 4, gigsCompleted: 11 } },
  { id: 'exp_jonas', slug: 'jonas-lee', name: 'Jonas Lee', tagline: 'Design Manager · regional fintech', bio: 'I critique design files like I review code — tight, specific, no fluff. Best for early-stage designers shipping their first 0-1.', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=JonasL', banner: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1400&q=70&auto=format&fit=crop', location: { city: 'Kuala Lumpur', country: 'Malaysia' }, hubName: 'Bijibiji Initiative', hubSlug: 'bijibiji', skills: ['Product Design', 'Critique', 'Figma', 'UX writing'], rating: { average: 4.8, total: 56 }, stats: { expertiseListings: 1, experiencesHosted: 3, gigsCompleted: 6 } },
  { id: 'exp_marisa', slug: 'marisa-hassan', name: 'Marisa Hassan', tagline: 'Grant writer · USD 6M+ raised', bio: 'I help social enterprises raise grant money. Strong DFI and public-sector background; I have helped raise USD 6M+ for partners across SEA.', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=MarisaH', banner: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&q=70&auto=format&fit=crop', location: { city: 'Penang', country: 'Malaysia' }, hubName: 'Green School KL', hubSlug: 'green-school', skills: ['Grant writing', 'Funding', 'Climate', 'Public sector'], rating: { average: 4.7, total: 21 }, stats: { expertiseListings: 1, experiencesHosted: 2, gigsCompleted: 4 } },
];
