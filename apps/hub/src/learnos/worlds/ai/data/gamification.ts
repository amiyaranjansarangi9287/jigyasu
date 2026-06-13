// Gamification Data: Badges, Levels, Achievements

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  conceptId?: string; // If tied to a specific concept
  requirement: 'complete_concept' | 'perfect_quiz' | 'streak' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Level {
  level: number;
  name: string;
  emoji: string;
  minXP: number;
  color: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

// XP rewards for different actions
export const XP_REWARDS = {
  COMPLETE_STORY: 50,
  COMPLETE_LEARN: 75,
  COMPLETE_EXPLORE: 100,
  COMPLETE_QUIZ: 150,
  PERFECT_QUIZ: 100, // Bonus for 100% score
  FIRST_CONCEPT: 200, // Bonus for first completion
  STREAK_DAY: 50, // Daily streak bonus
  ALL_CONCEPTS: 500, // Bonus for completing all
};

// Badges for each concept
export const conceptBadges: Badge[] = [
  {
    id: 'neural-navigator',
    name: 'Neural Navigator',
    description: 'Completed Neural Networks',
    emoji: '🧠',
    conceptId: 'neural-networks',
    requirement: 'complete_concept',
    tier: 'gold',
  },
  {
    id: 'word-wizard',
    name: 'Word Wizard',
    description: 'Completed Large Language Models',
    emoji: '💬',
    conceptId: 'llm',
    requirement: 'complete_concept',
    tier: 'gold',
  },
  {
    id: 'attention-master',
    name: 'Attention Master',
    description: 'Completed Transformers',
    emoji: '🤖',
    conceptId: 'transformers',
    requirement: 'complete_concept',
    tier: 'gold',
  },
  {
    id: 'research-hero',
    name: 'Research Hero',
    description: 'Completed RAG',
    emoji: '📚',
    conceptId: 'rag',
    requirement: 'complete_concept',
    tier: 'gold',
  },
  {
    id: 'meaning-mapper',
    name: 'Meaning Mapper',
    description: 'Completed Embeddings',
    emoji: '🗺️',
    conceptId: 'embeddings',
    requirement: 'complete_concept',
    tier: 'gold',
  },
  {
    id: 'vision-pro',
    name: 'Vision Pro',
    description: 'Completed Computer Vision',
    emoji: '👁️',
    conceptId: 'computer-vision',
    requirement: 'complete_concept',
    tier: 'gold',
  },
  {
    id: 'prompt-artist',
    name: 'Prompt Artist',
    description: 'Completed Prompt Engineering',
    emoji: '✨',
    conceptId: 'prompt-engineering',
    requirement: 'complete_concept',
    tier: 'gold',
  },
  {
    id: 'ethics-champion',
    name: 'Ethics Champion',
    description: 'Completed AI Ethics',
    emoji: '⚖️',
    conceptId: 'ai-ethics',
    requirement: 'complete_concept',
    tier: 'gold',
  },
  {
    id: 'reward-ranger',
    name: 'Reward Ranger',
    description: 'Completed Reinforcement Learning',
    emoji: '🎮',
    conceptId: 'reinforcement-learning',
    requirement: 'complete_concept',
    tier: 'gold',
  },
  {
    id: 'creative-genius',
    name: 'Creative Genius',
    description: 'Completed Generative AI',
    emoji: '🎨',
    conceptId: 'generative-ai',
    requirement: 'complete_concept',
    tier: 'gold',
  },
  {
    id: 'safety-guardian',
    name: 'Safety Guardian',
    description: 'Completed AI Safety',
    emoji: '🛡️',
    conceptId: 'ai-safety',
    requirement: 'complete_concept',
    tier: 'gold',
  },
];

// Special achievement badges
export const specialBadges: Badge[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Completed your first concept',
    emoji: '🎯',
    requirement: 'special',
    tier: 'bronze',
  },
  {
    id: 'halfway-hero',
    name: 'Halfway Hero',
    description: 'Completed 4 concepts',
    emoji: '🌟',
    requirement: 'special',
    tier: 'silver',
  },
  {
    id: 'ai-master',
    name: 'AI Master',
    description: 'Completed ALL concepts',
    emoji: '🏆',
    requirement: 'special',
    tier: 'platinum',
  },
  {
    id: 'quiz-whiz',
    name: 'Quiz Whiz',
    description: 'Got a perfect score on any quiz',
    emoji: '💯',
    requirement: 'perfect_quiz',
    tier: 'gold',
  },
  {
    id: 'streak-starter',
    name: 'Streak Starter',
    description: 'Learned 3 days in a row',
    emoji: '🔥',
    requirement: 'streak',
    tier: 'bronze',
  },
  {
    id: 'streak-keeper',
    name: 'Streak Keeper',
    description: 'Learned 7 days in a row',
    emoji: '🔥',
    requirement: 'streak',
    tier: 'silver',
  },
  {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Learned 14 days in a row',
    emoji: '🌈',
    requirement: 'streak',
    tier: 'gold',
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Started learning before 9 AM',
    emoji: '🌅',
    requirement: 'special',
    tier: 'bronze',
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Learned after 9 PM',
    emoji: '🦉',
    requirement: 'special',
    tier: 'bronze',
  },
  {
    id: 'curious-explorer',
    name: 'Curious Explorer',
    description: 'Visited all concept pages',
    emoji: '🔍',
    requirement: 'special',
    tier: 'silver',
  },
];

export const allBadges = [...conceptBadges, ...specialBadges];

// AI Explorer Levels
export const levels: Level[] = [
  { level: 1, name: 'Curious Beginner', emoji: '🌱', minXP: 0, color: 'from-gray-400 to-gray-500' },
  { level: 2, name: 'AI Apprentice', emoji: '📚', minXP: 200, color: 'from-green-400 to-green-500' },
  { level: 3, name: 'Rising Explorer', emoji: '🚀', minXP: 500, color: 'from-blue-400 to-blue-500' },
  { level: 4, name: 'AI Adventurer', emoji: '⭐', minXP: 1000, color: 'from-purple-400 to-purple-500' },
  { level: 5, name: 'Knowledge Seeker', emoji: '🔮', minXP: 1800, color: 'from-indigo-400 to-indigo-500' },
  { level: 6, name: 'AI Expert', emoji: '🎓', minXP: 2800, color: 'from-pink-400 to-pink-500' },
  { level: 7, name: 'AI Master', emoji: '👑', minXP: 4000, color: 'from-yellow-400 to-orange-500' },
  { level: 8, name: 'AI Legend', emoji: '🏆', minXP: 5500, color: 'from-amber-400 to-red-500' },
];

export function getLevelForXP(xp: number): Level {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXP) {
      return levels[i];
    }
  }
  return levels[0];
}

export function getNextLevel(currentLevel: Level): Level | null {
  const index = levels.findIndex(l => l.level === currentLevel.level);
  if (index < levels.length - 1) {
    return levels[index + 1];
  }
  return null;
}

export function getXPProgress(xp: number): { current: number; next: number; percentage: number } {
  const currentLevel = getLevelForXP(xp);
  const nextLevel = getNextLevel(currentLevel);
  
  if (!nextLevel) {
    return { current: xp, next: xp, percentage: 100 };
  }
  
  const xpInCurrentLevel = xp - currentLevel.minXP;
  const xpNeededForNext = nextLevel.minXP - currentLevel.minXP;
  const percentage = Math.min((xpInCurrentLevel / xpNeededForNext) * 100, 100);
  
  return { current: xpInCurrentLevel, next: xpNeededForNext, percentage };
}
