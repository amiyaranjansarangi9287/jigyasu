// HeritageWorld Unified Data Exports
import type { HeritageStory, StoryCollection } from '../types';

// Raw data imports
import { gitaStories } from './gitaData';
import { allRamayanaEpisodes } from './ramayanaData';
import { mergedSaints } from './mergedSaints';
import { odishaStories } from './odishaData';

// ==================== GITA ====================
const gitaMapped: HeritageStory[] = (gitaStories as any[]).map((story: any) => ({
  id: `gita-${story.id}`,
  collection: 'gita' as const,
  title: story.title,
  subtitle: story.subtitle,
  description: story.concept,
  coverImage: story.coverImage || '',
  ageRange: story.ageRange,
  category: 'Bhagavad Gita',
  categoryIcon: '📖',
  coreValue: story.concept,
  color: story.accentColor || '#f59e0b',
  gradient: story.accentGradient?.includes('linear-gradient') ? 'from-amber-400 to-orange-500' : (story.accentGradient || 'from-amber-400 to-orange-500'),
  icon: story.icon,
  emoji: story.icon,
  pages: (story.pages || []).map((p: any) => ({
    text: p.text,
    verse: p.verse,
    mood: 'peaceful' as const,
  })),
  hasImage: true,
}));

// ==================== RAMAYANA ====================
const ramayanaMapped: HeritageStory[] = (allRamayanaEpisodes as any[]).map((ep: any) => ({
  id: `ramayana-${ep.id}`,
  collection: 'ramayana' as const,
  title: ep.title,
  subtitle: ep.characterName || '',
  description: `${ep.characterTrait || ''} — ${ep.dharmaDilemma || ''}`,
  coverImage: `/images/heritage/stories/ramayana/cover-${(ep.value || '').toLowerCase()}.jpg`,
  ageRange: ep.ageGroup,
  category: ep.kandaName || ep.kanda || 'Ramayana',
  categoryIcon: '🏹',
  coreValue: ep.value,
  color: '#f97316',
  gradient: (ep.color && ep.color.includes('from-')) ? ep.color : 'from-orange-400 to-red-500',
  icon: ep.emoji,
  emoji: ep.emoji,
  pages: (ep.pages || []).map((p: any) => ({
    text: p.text,
    mood: p.mood,
    visualCue: p.visualCue,
  })),
  quiz: ep.quiz,
  hasImage: true,
}));

// ==================== SAINTS ====================
const saintsMapped: HeritageStory[] = (mergedSaints as any[]).map((s: any) => ({
  id: `saint-${s.id}`,
  collection: 'saints' as const,
  title: s.name,
  subtitle: s.subtitle,
  description: s.briefDescription || s.fullDescription || '',
  coverImage: s.imagePath || (s.hasImage !== false ? `/images/heritage/saints/platform/${s.id}.jpg` : ''),
  ageRange: s.ageRange || '6-12',
  category: s.category,
  categoryIcon: s.categoryIcon || s.categoryEmoji || '🙏',
  coreValue: s.coreValue || (Array.isArray(s.coreValues) ? s.coreValues[0] : 'Wisdom'),
  region: s.region,
  period: s.period,
  color: s.color?.includes('bg-') ? '#f43f5e' : (s.color || '#f43f5e'),
  gradient: s.gradient || 'from-rose-400 to-pink-500',
  emoji: s.emoji || s.categoryIcon || '🙏',
  pages: s.fullDescription || s.briefDescription || s.premise
    ? [{ text: s.fullDescription || s.briefDescription || s.premise, isTeachingMoment: true }]
    : [{ text: `The story of ${s.name}.`, isTeachingMoment: true }],
  hasImage: s.hasImage !== false,
}));

// ==================== ODISHA ====================
const odishaMapped: HeritageStory[] = (odishaStories as any[]).map((s: any) => ({
  id: `odisha-${s.id}`,
  collection: 'odisha' as const,
  title: s.title,
  subtitle: s.coreValue,
  description: s.premise,
  coverImage: s.coverImage || '',
  ageRange: s.ageRange || '6-8',
  category: s.category || 'Odisha Folklore',
  categoryIcon: '🪷',
  coreValue: s.coreValue,
  color: '#10b981',
  gradient: 'from-emerald-400 to-teal-500',
  emoji: '🪷',
  pages: s.premise ? [{ text: s.premise }] : [{ text: s.title }],
  hasImage: !!s.coverImage,
}));

// ==================== COMBINED ====================
export const allHeritageStories: HeritageStory[] = [
  ...gitaMapped,
  ...ramayanaMapped,
  ...saintsMapped,
  ...odishaMapped,
];

export const collections: StoryCollection[] = [
  {
    id: 'gita',
    name: 'Tales of the Gita',
    icon: '📖',
    description: 'Illustrated stories teaching the wisdom of the Bhagavad Gita',
    gradient: 'from-amber-400 to-yellow-500',
    color: '#f59e0b',
    count: gitaMapped.length,
  },
  {
    id: 'ramayana',
    name: 'Ramayana Stories',
    icon: '🏹',
    description: 'Moral values through the epic journey of Lord Rama',
    gradient: 'from-orange-400 to-red-500',
    color: '#f97316',
    count: ramayanaMapped.length,
  },
  {
    id: 'saints',
    name: 'Indian Saints',
    icon: '🙏',
    description: 'Stories of wisdom, courage, and love from India\'s greatest saints',
    gradient: 'from-rose-400 to-pink-500',
    color: '#f43f5e',
    count: saintsMapped.length,
  },
  {
    id: 'odisha',
    name: 'Epic Stories from Odisha',
    icon: '🪷',
    description: 'Folklore and legends from the land of Lord Jagannatha',
    gradient: 'from-emerald-400 to-teal-500',
    color: '#10b981',
    count: odishaMapped.length,
  },
];

export const getStoriesByCollection = (collectionId: string): HeritageStory[] => {
  return allHeritageStories.filter(s => s.collection === collectionId);
};

export const getStoryById = (id: string): HeritageStory | undefined => {
  return allHeritageStories.find(s => s.id === id);
};

export const getCategories = (): string[] => {
  const cats = new Set<string>();
  allHeritageStories.forEach(s => cats.add(s.category));
  return Array.from(cats);
};

export const getAgeRanges = (): string[] => {
  const ages = new Set<string>();
  allHeritageStories.forEach(s => ages.add(s.ageRange));
  return Array.from(ages);
};
