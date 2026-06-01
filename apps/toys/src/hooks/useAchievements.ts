import { useState, useCallback, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'toybox-achievements';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlockedAt?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-build',
    name: 'First Creation',
    description: 'Complete your first toy build',
    icon: '🎉',
    condition: 'Complete 1 build',
  },
  {
    id: 'triple-threat',
    name: 'Triple Threat',
    description: 'Complete 3 different toy builds',
    icon: '🎯',
    condition: 'Complete 3 builds',
  },
  {
    id: 'master-builder',
    name: 'Master Builder',
    description: 'Complete all 24 toy builds',
    icon: '👑',
    condition: 'Complete all builds',
  },
  {
    id: 'halfway-there',
    name: 'Halfway There',
    description: 'Complete 12 different toy builds',
    icon: '🌟',
    condition: 'Complete 12 builds',
  },
  {
    id: 'speedster',
    name: 'Speedster',
    description: 'Complete a build in under 30 minutes',
    icon: '⚡',
    condition: 'Build time < 30 min',
  },
  {
    id: 'marathon',
    name: 'Marathon Builder',
    description: 'Spend over 2 hours total building',
    icon: '🏃',
    condition: 'Total time > 2 hours',
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'Save 5 toys to your favorites',
    icon: '💝',
    condition: '5+ favorites',
  },
  {
    id: 'easy-mode',
    name: 'Warming Up',
    description: 'Complete an Easy difficulty build',
    icon: '🌱',
    condition: 'Complete Easy build',
  },
  {
    id: 'medium-mode',
    name: 'Getting Serious',
    description: 'Complete a Medium difficulty build',
    icon: '🔥',
    condition: 'Complete Medium build',
  },
  {
    id: 'hard-mode',
    name: 'Challenge Accepted',
    description: 'Complete a Hard difficulty build',
    icon: '💪',
    condition: 'Complete Hard build',
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Add notes to all steps of a build',
    icon: '📝',
    condition: 'Notes on every step',
  },
  {
    id: 'photographer',
    name: 'Photographer',
    description: 'Add 5 photos to your builds',
    icon: '📸',
    condition: '5+ build photos',
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Start a build after 10 PM',
    icon: '🦉',
    condition: 'Build started at night',
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Start a build before 7 AM',
    icon: '🐦',
    condition: 'Build started early',
  },
  {
    id: 'weekly-challenger',
    name: 'Challenger',
    description: 'Complete a weekly challenge',
    icon: '🏆',
    condition: 'Complete challenge',
  },
];

interface UnlockedAchievement {
  id: string;
  unlockedAt: number;
}

export function useAchievements() {
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
    } catch {
      // ignore
    }
  }, [unlocked]);

  const unlock = useCallback((achievementId: string) => {
    setUnlocked((prev) => {
      if (prev.some((a) => a.id === achievementId)) return prev;
      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (achievement) {
        setNewlyUnlocked(achievement);
        setTimeout(() => setNewlyUnlocked(null), 4000);
      }
      return [...prev, { id: achievementId, unlockedAt: Date.now() }];
    });
  }, []);

  const isUnlocked = useCallback(
    (achievementId: string) => unlocked.some((a) => a.id === achievementId),
    [unlocked]
  );

  const getUnlockedAt = useCallback(
    (achievementId: string) => unlocked.find((a) => a.id === achievementId)?.unlockedAt,
    [unlocked]
  );

  const achievements = useMemo(() => {
    return ACHIEVEMENTS.map((a) => ({
      ...a,
      unlockedAt: getUnlockedAt(a.id),
    }));
  }, [getUnlockedAt]);

  const progress = useMemo(() => {
    return {
      unlocked: unlocked.length,
      total: ACHIEVEMENTS.length,
      percent: Math.round((unlocked.length / ACHIEVEMENTS.length) * 100),
    };
  }, [unlocked]);

  const dismissNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked(null);
  }, []);

  return {
    achievements,
    unlock,
    isUnlocked,
    progress,
    newlyUnlocked,
    dismissNewlyUnlocked,
  };
}
