// CampCraft - Archived Pillar and Category Definitions

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

export const archivedPillars: Pillar[] = [
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
    name: 'Outdoor Activity',
    icon: '🌿',
    color: '#4D96FF',
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-cyan-500',
    description: 'Explore nature and outdoor adventures'
  }
];

export const archivedCategories: Category[] = [
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

export type AgeTier = '3-5' | '6-8' | '9-12' | '13-17' | '18+';
export type AgeRange = '3-5' | '6-8' | '9-12' | '13-17' | '18+' | '3-12' | '6-12' | '3-8';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type PillarId = 'toybox' | 'sciencelab' | 'artstudio' | 'outdoorquest';
