// Global progress tracking system for BioVerse

export interface ModuleProgress {
  visited: boolean;
  visitCount: number;
  lastVisited: number;
  completed: boolean; // module-specific completion criteria
  score?: number;     // for quizzes/games
  bestScore?: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  modulesVisited: Record<string, ModuleProgress>;
  badges: string[];
  totalTimeSeconds: number;
}

const STORAGE_KEY = 'bioverse-progress';

const defaultProgress: UserProgress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: '',
  modulesVisited: {},
  badges: [],
  totalTimeSeconds: 0,
};

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress };
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return { ...defaultProgress };
  }
}

export function saveProgress(progress: UserProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch { /* ignore storage errors */ }
}

export function visitModule(progress: UserProgress, moduleId: string): UserProgress {
  const existing = progress.modulesVisited[moduleId] || {
    visited: false, visitCount: 0, lastVisited: 0, completed: false,
  };

  const isFirstVisit = !existing.visited;
  const xpGain = isFirstVisit ? 25 : 5;

  const updated: UserProgress = {
    ...progress,
    xp: progress.xp + xpGain,
    modulesVisited: {
      ...progress.modulesVisited,
      [moduleId]: {
        ...existing,
        visited: true,
        visitCount: existing.visitCount + 1,
        lastVisited: Date.now(),
      },
    },
  };

  // Check level ups (every 100 XP)
  updated.level = Math.floor(updated.xp / 100) + 1;

  // Check streak
  const today = new Date().toDateString();
  if (progress.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    updated.streak = progress.lastActiveDate === yesterday ? progress.streak + 1 : 1;
    updated.lastActiveDate = today;
  }

  // Badge checks
  const badges = new Set(updated.badges);
  const visitedCount = Object.values(updated.modulesVisited).filter(m => m.visited).length;
  if (visitedCount >= 1) badges.add('first-step');
  if (visitedCount >= 5) badges.add('explorer');
  if (visitedCount >= 10) badges.add('scholar');
  if (visitedCount >= 20) badges.add('master');
  if (visitedCount >= 27) badges.add('completionist');
  if (updated.streak >= 3) badges.add('streak-3');
  if (updated.streak >= 7) badges.add('streak-7');
  if (updated.xp >= 500) badges.add('xp-500');
  if (updated.xp >= 1000) badges.add('xp-1000');
  updated.badges = Array.from(badges);

  return updated;
}

export function completeModule(progress: UserProgress, moduleId: string, score?: number): UserProgress {
  const existing = progress.modulesVisited[moduleId] || {
    visited: true, visitCount: 1, lastVisited: Date.now(), completed: false,
  };

  const isFirstComplete = !existing.completed;
  const xpGain = isFirstComplete ? 50 : 10;

  const updated: UserProgress = {
    ...progress,
    xp: progress.xp + xpGain,
    modulesVisited: {
      ...progress.modulesVisited,
      [moduleId]: {
        ...existing,
        completed: true,
        score: score,
        bestScore: Math.max(score || 0, existing.bestScore || 0),
      },
    },
  };

  updated.level = Math.floor(updated.xp / 100) + 1;

  const completedCount = Object.values(updated.modulesVisited).filter(m => m.completed).length;
  const badges = new Set(updated.badges);
  if (completedCount >= 5) badges.add('5-complete');
  if (completedCount >= 15) badges.add('15-complete');
  if (completedCount >= 27) badges.add('all-complete');
  updated.badges = Array.from(badges);

  return updated;
}

export const BADGE_INFO: Record<string, { emoji: string; name: string; desc: string }> = {
  'first-step': { emoji: '👣', name: 'First Step', desc: 'Visit your first module' },
  'explorer': { emoji: '🧭', name: 'Explorer', desc: 'Visit 5 different modules' },
  'scholar': { emoji: '📚', name: 'Scholar', desc: 'Visit 10 different modules' },
  'master': { emoji: '🎓', name: 'Master', desc: 'Visit 20 different modules' },
  'completionist': { emoji: '👑', name: 'Completionist', desc: 'Visit all 27 modules' },
  'streak-3': { emoji: '🔥', name: '3-Day Streak', desc: 'Use BioVerse 3 days in a row' },
  'streak-7': { emoji: '💎', name: 'Week Warrior', desc: 'Use BioVerse 7 days in a row' },
  'xp-500': { emoji: '⭐', name: 'Rising Star', desc: 'Earn 500 XP' },
  'xp-1000': { emoji: '🌟', name: 'Superstar', desc: 'Earn 1000 XP' },
  '5-complete': { emoji: '🏅', name: 'Achiever', desc: 'Complete 5 modules' },
  '15-complete': { emoji: '🏆', name: 'Champion', desc: 'Complete 15 modules' },
  'all-complete': { emoji: '💯', name: 'Legend', desc: 'Complete all modules' },
};

export const XP_PER_LEVEL = 100;

export function getLevelTitle(level: number): string {
  if (level <= 2) return 'Beginner';
  if (level <= 5) return 'Student';
  if (level <= 8) return 'Scientist';
  if (level <= 12) return 'Professor';
  if (level <= 18) return 'Expert';
  return 'Biology Master';
}

// Suggested next modules based on current module
export const MODULE_CONNECTIONS: Record<string, { related: string[]; label: string }> = {
  'cell-map': { related: ['mitosis', 'meiosis', 'dna-visualizer', 'microscope'], label: 'After exploring the cell' },
  'dna-visualizer': { related: ['punnett-square', 'crispr', 'meiosis'], label: 'Dive deeper into genetics' },
  'mitosis': { related: ['meiosis', 'cell-map', 'respiration'], label: 'Related cell processes' },
  'meiosis': { related: ['mitosis', 'punnett-square', 'evolution-tree'], label: 'Continue with genetics' },
  'respiration': { related: ['photosynthesis', 'enzyme-lab', 'molecule-3d'], label: 'Related biochemistry' },
  'photosynthesis': { related: ['respiration', 'plant-anatomy', 'carbon-cycle'], label: 'Plant & energy' },
  'punnett-square': { related: ['crispr', 'meiosis', 'dna-visualizer'], label: 'More genetics' },
  'crispr': { related: ['dna-visualizer', 'punnett-square', 'evolution-tree'], label: 'Gene technology' },
  'evolution-tree': { related: ['metamorphosis', 'biomes', 'ecosystem'], label: 'Evolution & ecology' },
  'brain': { related: ['heart', 'digestive', 'body-quiz'], label: 'More human anatomy' },
  'heart': { related: ['brain', 'digestive', 'immune-defense'], label: 'Body systems' },
  'digestive': { related: ['enzyme-lab', 'brain', 'body-quiz'], label: 'Related body topics' },
  'immune-defense': { related: ['heart', 'body-quiz', 'microbe-match'], label: 'Health & defense' },
  'body-quiz': { related: ['brain', 'heart', 'digestive'], label: 'Study the body' },
  'molecule-3d': { related: ['enzyme-lab', 'respiration', 'microscope'], label: 'Chemistry tools' },
  'microscope': { related: ['cell-map', 'plant-anatomy', 'molecule-3d'], label: 'Explore structures' },
  'enzyme-lab': { related: ['respiration', 'digestive', 'molecule-3d'], label: 'Biochemistry' },
  'plant-anatomy': { related: ['photosynthesis', 'microscope', 'water-cycle'], label: 'Plant science' },
  'ecosystem': { related: ['biomes', 'food-chain', 'carbon-cycle'], label: 'Ecology modules' },
  'biomes': { related: ['ecosystem', 'climate', 'evolution-tree'], label: 'Earth science' },
  'carbon-cycle': { related: ['water-cycle', 'climate', 'photosynthesis'], label: 'Earth cycles' },
  'water-cycle': { related: ['carbon-cycle', 'climate', 'biomes'], label: 'More cycles' },
  'climate': { related: ['carbon-cycle', 'biomes', 'ecosystem'], label: 'Environmental science' },
  'food-chain': { related: ['ecosystem', 'biomes', 'metamorphosis'], label: 'Ecology & life' },
  'metamorphosis': { related: ['evolution-tree', 'ecosystem', 'microbe-match'], label: 'Life science' },
  'microbe-match': { related: ['microscope', 'immune-defense', 'ecosystem'], label: 'Micro-world' },
};

export const ALL_MODULE_IDS = [
  'cell-map', 'dna-visualizer', 'mitosis', 'meiosis', 'respiration', 'photosynthesis',
  'punnett-square', 'crispr', 'evolution-tree',
  'brain', 'heart', 'digestive', 'immune-defense', 'body-quiz',
  'molecule-3d', 'microscope', 'enzyme-lab',
  'plant-anatomy',
  'ecosystem', 'biomes', 'carbon-cycle', 'water-cycle', 'climate', 'food-chain',
  'metamorphosis', 'microbe-match',
];

export const MODULE_NAMES: Record<string, { emoji: string; name: string }> = {
  'cell-map': { emoji: '🗺️', name: 'Cell Explorer' },
  'dna-visualizer': { emoji: '🧬', name: 'DNA Visualizer' },
  'mitosis': { emoji: '🧪', name: 'Mitosis' },
  'meiosis': { emoji: '🔀', name: 'Meiosis' },
  'respiration': { emoji: '🔋', name: 'Cell Respiration' },
  'photosynthesis': { emoji: '🧫', name: 'Photosynthesis' },
  'punnett-square': { emoji: '🎲', name: 'Punnett Square' },
  'crispr': { emoji: '✂️', name: 'CRISPR Editor' },
  'evolution-tree': { emoji: '🌳', name: 'Evolution Tree' },
  'brain': { emoji: '🧠', name: 'Brain Explorer' },
  'heart': { emoji: '🫀', name: 'Heart & Blood' },
  'digestive': { emoji: '🦷', name: 'Digestive Journey' },
  'immune-defense': { emoji: '🛡️', name: 'Immune Defense' },
  'body-quiz': { emoji: '❤️', name: 'Body Quiz' },
  'molecule-3d': { emoji: '🔬', name: '3D Molecules' },
  'microscope': { emoji: '🔎', name: 'Microscope' },
  'enzyme-lab': { emoji: '⚗️', name: 'Enzyme Lab' },
  'plant-anatomy': { emoji: '🌻', name: 'Plant Anatomy' },
  'ecosystem': { emoji: '🌿', name: 'Ecosystem' },
  'biomes': { emoji: '🏔️', name: 'Biome Explorer' },
  'carbon-cycle': { emoji: '♻️', name: 'Carbon Cycle' },
  'water-cycle': { emoji: '💧', name: 'Water Cycle' },
  'climate': { emoji: '🌡️', name: 'Climate Sim' },
  'food-chain': { emoji: '🏊', name: 'Food Chain Dash' },
  'metamorphosis': { emoji: '🦋', name: 'Metamorphosis' },
  'microbe-match': { emoji: '🦠', name: 'Microbe Match' },
};
