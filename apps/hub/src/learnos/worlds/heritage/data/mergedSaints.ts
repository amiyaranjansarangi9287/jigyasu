// Merged Indian Saints database
// Sources: indian-saint-storybook-platform (43 entries) + indian-saints-storybook-project (35 entries)

import { saints as platformSaints } from './sp_saints';
import { saints as projectSaints } from './sproj_saints';

export interface MergedSaint {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  categoryIcon: string;
  region: string;
  ageRange: string;
  coreValue: string;
  coreValues: string[];
  briefDescription: string;
  fullDescription: string;
  status: string;
  hasImage: boolean;
  pageCount: number;
  gradient: string;
  color: string;
  period?: string;
  emoji?: string;
  imagePath?: string;
}

function normalizeSaint(s: any): MergedSaint {
  return {
    id: s.id,
    name: s.name || s.title,
    subtitle: s.title || s.subtitle || '',
    category: s.category,
    categoryIcon: s.categoryIcon || s.categoryEmoji || '??',
    region: s.region || 'India',
    ageRange: s.ageRange || '6-12',
    coreValue: Array.isArray(s.coreValues) ? s.coreValues[0] : (s.coreValue || 'Wisdom'),
    coreValues: Array.isArray(s.coreValues) ? s.coreValues : [s.coreValue || 'Wisdom'],
    briefDescription: s.briefDescription || s.premise || '',
    fullDescription: s.fullDescription || s.premise || s.briefDescription || '',
    status: (s.status || 'draft').toLowerCase(),
    hasImage: s.hasImage !== false,
    pageCount: s.pageCount || s.pages || s.totalPages || 10,
    gradient: s.gradient || 'from-rose-400 to-pink-500',
    color: s.color || '#f43f5e',
    period: s.period,
    emoji: s.emoji || s.categoryIcon || s.categoryEmoji,
    imagePath: s.imagePath,
  };
}

const platformNormalized: MergedSaint[] = (platformSaints as any[]).map(normalizeSaint);
const projectNormalized: MergedSaint[] = (projectSaints as any[]).map(normalizeSaint);

// Merge by ID (project data wins on conflict as it's more refined)
const mergedMap = new Map<string, MergedSaint>();
platformNormalized.forEach(s => mergedMap.set(s.id, s));
projectNormalized.forEach(s => mergedMap.set(s.id, s));

export const mergedSaints: MergedSaint[] = Array.from(mergedMap.values());
export const saintCount = mergedSaints.length;