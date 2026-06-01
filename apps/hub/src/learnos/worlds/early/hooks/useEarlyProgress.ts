// src/worlds/early/hooks/useEarlyProgress.ts

import { useState, useCallback, useEffect } from 'react';
import type { EarlyProgress } from '../types/early.types';

const STORAGE_KEY = 'learnos-early-progress';

const DEFAULT_PROGRESS: EarlyProgress = {
  storiesBuilt: 0, storiesCompleted: 0, storyChoices: [],
  problemsSolved: 0, highestNumber: 0, negativeIntroduced: false,
  lettersExplored: [], currentLetter: 'A',
  recipesAttempted: [], recipesCompleted: [],
  patternsCompleted: 0, highestDifficulty: 1,
  sentencesCompleted: 0,
  plantStagesCompleted: 0, waterCycleCompleted: 0,
  habitatsExplored: 0, shadowChallengesSolved: 0,
  magnetSortingCompleted: 0, correctPurchases: 0, totalPurchaseAttempts: 0,
  totalSessions: 0, totalMinutes: 0, lastSessionAt: 0,
  pipInteractions: 0, hintsUsed: 0, wrongAnswers: 0,
  updatedAt: 0,
};

function loadProgress(): EarlyProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as EarlyProgress;
  } catch (e) { console.warn('[EarlyWorld] Progress load failed:', e); }
  return { ...DEFAULT_PROGRESS };
}

function persistProgress(progress: EarlyProgress): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
  catch (e) { console.warn('[EarlyWorld] Progress save failed:', e); }
}

export function useEarlyProgress() {
  const [progress, setProgress] = useState<EarlyProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProgress(loadProgress());
    setLoading(false);
  }, []);

  const save = useCallback((updated: EarlyProgress) => { setProgress(updated); persistProgress(updated); }, []);

  const recordStoryBuilt = useCallback((character: string, place: string, problem: string, completed: boolean) => {
    if (!progress) return;
    save({ ...progress, storiesBuilt: progress.storiesBuilt + 1, storiesCompleted: completed ? progress.storiesCompleted + 1 : progress.storiesCompleted, storyChoices: [...progress.storyChoices, `${character}+${place}+${problem}`], updatedAt: Date.now() });
  }, [progress, save]);

  const recordProblemSolved = useCallback((number: number) => {
    if (!progress) return;
    save({ ...progress, problemsSolved: progress.problemsSolved + 1, highestNumber: Math.max(progress.highestNumber, number), updatedAt: Date.now() });
  }, [progress, save]);

  const recordLetterExplored = useCallback((letter: string) => {
    if (!progress || progress.lettersExplored.includes(letter)) return;
    save({ ...progress, lettersExplored: [...progress.lettersExplored, letter], currentLetter: letter, updatedAt: Date.now() });
  }, [progress, save]);

  const recordRecipeAttempt = useCallback((recipeId: string, completed: boolean) => {
    if (!progress) return;
    save({ ...progress,
      recipesAttempted: progress.recipesAttempted.includes(recipeId) ? progress.recipesAttempted : [...progress.recipesAttempted, recipeId],
      recipesCompleted: completed && !progress.recipesCompleted.includes(recipeId) ? [...progress.recipesCompleted, recipeId] : progress.recipesCompleted,
      updatedAt: Date.now() });
  }, [progress, save]);

  const recordPatternCompleted = useCallback((difficulty: number) => {
    if (!progress) return;
    save({ ...progress, patternsCompleted: progress.patternsCompleted + 1, highestDifficulty: Math.max(progress.highestDifficulty, difficulty), updatedAt: Date.now() });
  }, [progress, save]);

  const recordSentenceCompleted = useCallback(() => {
    if (!progress) return;
    save({ ...progress, sentencesCompleted: progress.sentencesCompleted + 1, updatedAt: Date.now() });
  }, [progress, save]);

  const recordHintUsed = useCallback(() => {
    if (!progress) return;
    save({ ...progress, hintsUsed: progress.hintsUsed + 1, pipInteractions: progress.pipInteractions + 1, updatedAt: Date.now() });
  }, [progress, save]);

  const recordWrongAnswer = useCallback(() => {
    if (!progress) return;
    save({ ...progress, wrongAnswers: progress.wrongAnswers + 1, updatedAt: Date.now() });
  }, [progress, save]);

  const recordPlantStage = useCallback(() => {
    if (!progress) return;
    save({ ...progress, plantStagesCompleted: progress.plantStagesCompleted + 1, updatedAt: Date.now() });
  }, [progress, save]);

  const recordWaterCycle = useCallback(() => {
    if (!progress) return;
    save({ ...progress, waterCycleCompleted: progress.waterCycleCompleted + 1, updatedAt: Date.now() });
  }, [progress, save]);

  const recordHabitatExplored = useCallback(() => {
    if (!progress) return;
    save({ ...progress, habitatsExplored: Math.min(4, progress.habitatsExplored + 1), updatedAt: Date.now() });
  }, [progress, save]);

  const recordShadowChallenge = useCallback(() => {
    if (!progress) return;
    save({ ...progress, shadowChallengesSolved: progress.shadowChallengesSolved + 1, updatedAt: Date.now() });
  }, [progress, save]);

  const recordMagnetSorting = useCallback(() => {
    if (!progress) return;
    save({ ...progress, magnetSortingCompleted: progress.magnetSortingCompleted + 1, updatedAt: Date.now() });
  }, [progress, save]);

  const recordPurchase = useCallback((correct: boolean) => {
    if (!progress) return;
    save({ ...progress, correctPurchases: correct ? progress.correctPurchases + 1 : progress.correctPurchases, totalPurchaseAttempts: progress.totalPurchaseAttempts + 1, updatedAt: Date.now() });
  }, [progress, save]);

  return { progress, loading, recordStoryBuilt, recordProblemSolved, recordLetterExplored, recordRecipeAttempt, recordPatternCompleted, recordSentenceCompleted, recordHintUsed, recordWrongAnswer, recordPlantStage, recordWaterCycle, recordHabitatExplored, recordShadowChallenge, recordMagnetSorting, recordPurchase, saveProgress: save };
}
