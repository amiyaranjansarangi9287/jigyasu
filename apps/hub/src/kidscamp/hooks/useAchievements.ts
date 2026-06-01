// CampCraft - Achievements Hook

import { useState, useEffect, useCallback } from 'react';
import { achievements, Achievement } from '../data/achievements';

interface UnlockedAchievement {
  id: string;
  unlockedAt: number;
}

const STORAGE_KEY = 'campcraft-achievements';

function loadUnlocked(): UnlockedAchievement[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useAchievements() {
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>(loadUnlocked);
  const [toastAchievement, setToastAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
  }, [unlocked]);

  const isUnlocked = useCallback((achievementId: string): boolean => {
    return unlocked.some(a => a.id === achievementId);
  }, [unlocked]);

  const unlock = useCallback((achievementId: string) => {
    if (unlocked.some(a => a.id === achievementId)) return;

    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return;

    setUnlocked(prev => [...prev, {
      id: achievementId,
      unlockedAt: Date.now()
    }]);

    // Trigger toast
    setToastAchievement(achievement);
  }, [unlocked]);

  const dismissToast = useCallback(() => {
    setToastAchievement(null);
  }, []);

  const getUnlockedAchievements = useCallback((): (Achievement & { unlockedAt: number })[] => {
    return unlocked.map(u => {
      const achievement = achievements.find(a => a.id === u.id);
      return achievement ? { ...achievement, unlockedAt: u.unlockedAt } : null;
    }).filter(Boolean) as (Achievement & { unlockedAt: number })[];
  }, [unlocked]);

  const getLockedAchievements = useCallback((): Achievement[] => {
    return achievements.filter(a => !isUnlocked(a.id));
  }, [isUnlocked]);

  const getProgress = useCallback(() => {
    return {
      unlocked: unlocked.length,
      total: achievements.length,
      percentage: Math.round((unlocked.length / achievements.length) * 100)
    };
  }, [unlocked]);

  return {
    unlocked,
    toastAchievement,
    isUnlocked,
    unlock,
    dismissToast,
    getUnlockedAchievements,
    getLockedAchievements,
    getProgress,
    allAchievements: achievements
  };
}
