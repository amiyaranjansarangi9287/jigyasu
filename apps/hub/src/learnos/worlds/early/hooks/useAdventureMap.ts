// src/worlds/early/hooks/useAdventureMap.ts

import { useState, useEffect, useCallback } from 'react';
import type { EarlyProgress } from '../types/early.types';

export interface UnlockedAchievement {
  id: string;
  unlockedAt: number;
}

interface AchievementDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  locationOnMap: { x: number; y: number };
  mapEmoji: string;
}

const EARLY_ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first-story', name: 'Storyteller', emoji: '📖', description: 'Built your first story!', locationOnMap: { x: 0.15, y: 0.3 }, mapEmoji: '📚' },
  { id: 'number-hero', name: 'Number Hero', emoji: '🔢', description: 'Solved 5 number line problems!', locationOnMap: { x: 0.35, y: 0.45 }, mapEmoji: '🌉' },
  { id: 'letter-explorer', name: 'Letter Explorer', emoji: '🌳', description: 'Explored 10 letters!', locationOnMap: { x: 0.55, y: 0.3 }, mapEmoji: '🏕️' },
  { id: 'master-chef', name: 'Master Chef', emoji: '👨‍🍳', description: 'Completed 3 recipes!', locationOnMap: { x: 0.75, y: 0.45 }, mapEmoji: '🍳' },
  { id: 'pattern-detective', name: 'Pattern Detective', emoji: '🔍', description: 'Completed 10 patterns!', locationOnMap: { x: 0.25, y: 0.65 }, mapEmoji: '🏰' },
  { id: 'word-wizard', name: 'Word Wizard', emoji: '✏️', description: 'Completed 5 word scrambles!', locationOnMap: { x: 0.65, y: 0.65 }, mapEmoji: '📜' },
  { id: 'nature-friend', name: 'Nature Friend', emoji: '🌱', description: 'Grew your first plant!', locationOnMap: { x: 0.45, y: 0.20 }, mapEmoji: '🌿' },
  { id: 'water-explorer', name: 'Water Explorer', emoji: '💧', description: 'Followed the water cycle!', locationOnMap: { x: 0.85, y: 0.25 }, mapEmoji: '🌊' },
  { id: 'habitat-hero', name: 'Habitat Hero', emoji: '🌍', description: 'Explored all 4 habitats!', locationOnMap: { x: 0.15, y: 0.75 }, mapEmoji: '🗺️' },
  { id: 'shadow-master', name: 'Shadow Master', emoji: '🔦', description: 'Solved 4 shadow challenges!', locationOnMap: { x: 0.50, y: 0.80 }, mapEmoji: '⭐' },
  { id: 'magnet-scientist', name: 'Magnet Scientist', emoji: '🧲', description: 'Sorted all magnetic objects!', locationOnMap: { x: 0.80, y: 0.75 }, mapEmoji: '🔬' },
  { id: 'money-wise', name: 'Money Wise', emoji: '💰', description: 'Made 5 correct purchases!', locationOnMap: { x: 0.35, y: 0.85 }, mapEmoji: '🏪' },
  { id: 'all-rounder', name: 'All-Rounder', emoji: '🌟', description: 'Tried all 12 modules!', locationOnMap: { x: 0.50, y: 0.50 }, mapEmoji: '🏆' },
];

export { EARLY_ACHIEVEMENTS };

function checkCondition(id: string, p: EarlyProgress): boolean {
  switch (id) {
    case 'first-story': return p.storiesBuilt >= 1;
    case 'number-hero': return p.problemsSolved >= 5;
    case 'letter-explorer': return p.lettersExplored.length >= 10;
    case 'master-chef': return p.recipesCompleted.length >= 3;
    case 'pattern-detective': return p.patternsCompleted >= 10;
    case 'word-wizard': return p.sentencesCompleted >= 5;
    case 'nature-friend': return p.plantStagesCompleted >= 1;
    case 'water-explorer': return p.waterCycleCompleted >= 1;
    case 'habitat-hero': return p.habitatsExplored >= 4;
    case 'shadow-master': return p.shadowChallengesSolved >= 4;
    case 'magnet-scientist': return p.magnetSortingCompleted >= 1;
    case 'money-wise': return p.correctPurchases >= 5;
    case 'all-rounder': return (
      p.storiesBuilt >= 1 && p.problemsSolved >= 1 && p.lettersExplored.length >= 1 &&
      p.recipesCompleted.length >= 1 && p.patternsCompleted >= 1 && p.sentencesCompleted >= 1 &&
      p.plantStagesCompleted >= 1 && p.waterCycleCompleted >= 1 && p.habitatsExplored >= 1 &&
      p.shadowChallengesSolved >= 1 && p.magnetSortingCompleted >= 1 && p.correctPurchases >= 1
    );
    default: return false;
  }
}

const STORAGE_KEY = 'learnos-early-achievements';

export function useAdventureMap(progress: EarlyProgress | null) {
  const [unlocked, setUnlocked] = useState<UnlockedAchievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string | null>(null);

  // Load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUnlocked(JSON.parse(raw));
    } catch (_) {}
  }, []);

  // Check conditions
  useEffect(() => {
    if (!progress) return;

    for (const ach of EARLY_ACHIEVEMENTS) {
      if (unlocked.some(u => u.id === ach.id)) continue;
      if (checkCondition(ach.id, progress)) {
        const newUnlocked = [...unlocked, { id: ach.id, unlockedAt: Date.now() }];
        setUnlocked(newUnlocked);
        setNewlyUnlocked(ach.id);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newUnlocked)); } catch (_) {}
        setTimeout(() => setNewlyUnlocked(null), 4000);
        break;
      }
    }
  }, [progress, unlocked]);

  const isUnlocked = useCallback((achievementId: string) => unlocked.some(u => u.id === achievementId), [unlocked]);
  const getUnlockedCount = () => unlocked.length;
  const getTotalCount = () => EARLY_ACHIEVEMENTS.length;

  return { unlocked, newlyUnlocked, isUnlocked, getUnlockedCount, getTotalCount };
}
