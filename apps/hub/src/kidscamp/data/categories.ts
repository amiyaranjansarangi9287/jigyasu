// CampCraft - Pillar and Category Definitions

export interface Pillar {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
  badgeClass: string;
  showcaseImage: string;
  showcasePreview: string[];
  colSpan: string;
}

export interface Category {
  name: string;
  icon: string;
  pillar: string;
}

export const pillars: Pillar[] = [
  {
    id: 'toybox',
    name: 'ToyBox',
    icon: '🧸',
    color: '#FFD93D',
    gradientFrom: 'from-yellow-400',
    gradientTo: 'to-orange-400',
    description: 'Build amazing handcrafted toys from scratch',
    badgeClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    showcaseImage: '/images/blocks.webp',
    showcasePreview: ['Wooden Cars', 'Puppets', 'Puzzles'],
    colSpan: 'md:col-span-1'
  },
  {
    id: 'sciencelab',
    name: 'Interactive Labs',
    icon: '🧪',
    color: '#6BCB77',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-500',
    description: 'Explore Jigyasu Labs: Physics, Chemistry, Biology and more!',
    badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    showcaseImage: '/images/sciencelab.webp',
    showcasePreview: ['Chemistry', 'Physics', 'Biology'],
    colSpan: 'md:col-span-1'
  },
];

export const categories: Category[] = [
  // ToyBox categories
  { name: 'Building', icon: '🏗️', pillar: 'toybox' },
  { name: 'Plush', icon: '🧵', pillar: 'toybox' },
  { name: 'Vehicles', icon: '🚗', pillar: 'toybox' },
  { name: 'Puzzles', icon: '🧩', pillar: 'toybox' },
  { name: 'Games', icon: '🎲', pillar: 'toybox' },
  { name: 'Musical', icon: '🎵', pillar: 'toybox' },
  { name: 'Puppets', icon: '🎭', pillar: 'toybox' },
  
  // ScienceLab categories
  { name: 'Chemistry', icon: '⚗️', pillar: 'sciencelab' },
  { name: 'Physics', icon: '🔋', pillar: 'sciencelab' },
  { name: 'Biology', icon: '🌱', pillar: 'sciencelab' },
  { name: 'Engineering', icon: '⚙️', pillar: 'sciencelab' },
  
];

export const ageTiers = [
  {
    id: '3-5',
    name: 'Little Explorers',
    icon: '🐣',
    ageRange: '3-5 years',
    description: 'Simple, sensory activities with parent guidance',
    color: 'from-pink-400 to-purple-400'
  },
  {
    id: '6-8',
    name: 'Junior Creators',
    icon: '🌟',
    ageRange: '6-8 years',
    description: 'Fun projects with clear step-by-step instructions',
    color: 'from-blue-400 to-indigo-400'
  },
  {
    id: '9-12',
    name: 'Adventure Builders',
    icon: '🚀',
    ageRange: '9-12 years',
    description: 'Complex projects for independent makers',
    color: 'from-orange-400 to-red-400'
  },
  {
    id: '13-17',
    name: 'Future Innovators',
    icon: '⚡',
    ageRange: '13-17 years',
    description: 'Advanced projects, coding, and real-world skills for teens',
    color: 'from-slate-600 to-zinc-800'
  },
  {
    id: '18+',
    name: 'Lifelong Learners',
    icon: '🎓',
    ageRange: '18+ years',
    description: 'Deep dives, professional skills, and advanced concepts',
    color: 'from-slate-800 to-zinc-950'
  }
] as const;

export type AgeTier = '3-5' | '6-8' | '9-12' | '13-17' | '18+';
export type AgeRange = '3-5' | '6-8' | '9-12' | '13-17' | '18+' | '3-12' | '6-12' | '3-8';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type PillarId = string;
