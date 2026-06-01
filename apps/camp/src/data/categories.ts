// CampCraft - Pillar and Category Definitions

export interface Pillar {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
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
    description: 'Build amazing handcrafted toys from scratch'
  },
  {
    id: 'sciencelab',
    name: 'ScienceLab',
    icon: '🔬',
    color: '#6BCB77',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-500',
    description: 'Discover the magic of science with hands-on experiments'
  },
  {
    id: 'artstudio',
    name: 'ArtStudio',
    icon: '🎨',
    color: '#FF6B9D',
    gradientFrom: 'from-pink-400',
    gradientTo: 'to-rose-500',
    description: 'Express your creativity through art and crafts'
  },
  {
    id: 'outdoorquest',
    name: 'OutdoorQuest',
    icon: '🌿',
    color: '#4D96FF',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-cyan-500',
    description: 'Explore nature and outdoor adventures'
  }
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
  
  // ArtStudio categories
  { name: 'Painting', icon: '🖌️', pillar: 'artstudio' },
  { name: 'Crafts', icon: '✂️', pillar: 'artstudio' },
  { name: 'Sculpture', icon: '🏺', pillar: 'artstudio' },
  { name: 'Paper Art', icon: '📄', pillar: 'artstudio' },
  
  // OutdoorQuest categories
  { name: 'Nature', icon: '🍃', pillar: 'outdoorquest' },
  { name: 'Garden', icon: '🌻', pillar: 'outdoorquest' },
  { name: 'Adventure', icon: '🧭', pillar: 'outdoorquest' },
  { name: 'Wildlife', icon: '🦋', pillar: 'outdoorquest' }
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
  }
] as const;

export type AgeTier = '3-5' | '6-8' | '9-12';
export type AgeRange = '3-5' | '6-8' | '9-12' | '3-12' | '6-12' | '3-8';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type PillarId = 'toybox' | 'sciencelab' | 'artstudio' | 'outdoorquest';
