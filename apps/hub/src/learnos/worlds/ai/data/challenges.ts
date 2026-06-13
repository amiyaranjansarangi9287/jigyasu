// Weekly Challenges System

export interface Challenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  target: number;
  type: 'complete_concepts' | 'earn_xp' | 'perfect_quiz' | 'play_games' | 'streak';
  xpReward: number;
}

// Pool of challenges to rotate from
export const challengePool: Challenge[] = [
  { id: 'complete-2', title: 'Double Down', description: 'Complete 2 concepts this week', emoji: '📚', target: 2, type: 'complete_concepts', xpReward: 200 },
  { id: 'complete-3', title: 'Triple Threat', description: 'Complete 3 concepts this week', emoji: '🎯', target: 3, type: 'complete_concepts', xpReward: 350 },
  { id: 'earn-500', title: 'XP Hunter', description: 'Earn 500 XP this week', emoji: '⚡', target: 500, type: 'earn_xp', xpReward: 150 },
  { id: 'earn-1000', title: 'XP Champion', description: 'Earn 1000 XP this week', emoji: '💎', target: 1000, type: 'earn_xp', xpReward: 300 },
  { id: 'perfect-1', title: 'Perfectionist', description: 'Get a perfect quiz score', emoji: '💯', target: 1, type: 'perfect_quiz', xpReward: 200 },
  { id: 'perfect-2', title: 'Flawless', description: 'Get 2 perfect quiz scores', emoji: '🌟', target: 2, type: 'perfect_quiz', xpReward: 350 },
  { id: 'games-3', title: 'Game On', description: 'Play 3 mini-games', emoji: '🎮', target: 3, type: 'play_games', xpReward: 150 },
  { id: 'streak-3', title: 'Consistent', description: 'Maintain a 3-day streak', emoji: '🔥', target: 3, type: 'streak', xpReward: 200 },
  { id: 'streak-5', title: 'Unstoppable', description: 'Maintain a 5-day streak', emoji: '🔥', target: 5, type: 'streak', xpReward: 350 },
];

// Get weekly challenges based on current week
export function getWeeklyChallenges(): Challenge[] {
  // Use week number as seed for consistent weekly selection
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  
  // Pick 3 challenges deterministically based on week
  const shuffled = [...challengePool].sort((a, b) => {
    const hashA = (weekNumber * 7 + a.id.length) % 100;
    const hashB = (weekNumber * 7 + b.id.length) % 100;
    return hashA - hashB;
  });
  
  // Ensure variety: pick from different types
  const types = new Set<string>();
  const selected: Challenge[] = [];
  
  for (const challenge of shuffled) {
    if (selected.length >= 3) break;
    if (!types.has(challenge.type)) {
      selected.push(challenge);
      types.add(challenge.type);
    }
  }
  
  // Fill remaining slots if needed
  while (selected.length < 3) {
    const remaining = shuffled.find(c => !selected.includes(c));
    if (remaining) selected.push(remaining);
    else break;
  }
  
  return selected;
}
