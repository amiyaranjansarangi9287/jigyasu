// src/worlds/tiny/hooks/useTinyProgress.ts

import { useState, useCallback, useEffect } from 'react';
import type { TinyProgress, GardenItem, ColorName, ShapeType, WeatherType } from '../types/tiny.types';
import { FARM_ANIMALS } from '../data/tinyContent';

const STORAGE_KEY = 'learnos-tiny-progress';

const DEFAULT_PROGRESS: TinyProgress = {
  animalsDiscovered: [],
  totalTaps: 0,
  colorsMixed: [],
  shapesMatched: [],
  roundsCompleted: 0,
  animalsPlayed: [],
  groupPerformanceCount: 0,
  bubblesPopped: 0,
  lettersEncountered: [],
  numbersEncountered: [],
  weathersDiscovered: [],
  farmAnimalsFound: [],
  farmCompleted: false,
  nightDiscovered: false,
  fullCyclesCompleted: 0,
  lastSessionAt: 0,
  totalSessions: 0,
  totalPlayMinutes: 0,
  gardenItems: [],
  updatedAt: 0,
};

function loadProgress(): TinyProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as TinyProgress;
    }
  } catch (e) {
    console.warn('[TinyWorld] Progress load failed:', e);
  }
  return { ...DEFAULT_PROGRESS };
}

function persistProgress(progress: TinyProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('[TinyWorld] Progress save failed:', e);
  }
}

export function useTinyProgress() {
  const [progress, setProgress] = useState<TinyProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    setLoading(false);
  }, []);

  const saveProgress = useCallback((updated: TinyProgress) => {
    setProgress(updated);
    persistProgress(updated);
  }, []);

  const discoverAnimal = useCallback((animalLabel: string) => {
    if (!progress) return;
    const isNew = !progress.animalsDiscovered.includes(animalLabel);
    const updated: TinyProgress = {
      ...progress,
      animalsDiscovered: isNew
        ? [...progress.animalsDiscovered, animalLabel]
        : progress.animalsDiscovered,
      totalTaps: progress.totalTaps + 1,
      updatedAt: Date.now(),
    };
    saveProgress(updated);
    return isNew ? animalLabel : undefined;
  }, [progress, saveProgress]);

  const recordColorMix = useCallback((colorName: ColorName) => {
    if (!progress) return;
    if (progress.colorsMixed.includes(colorName)) return;
    const updated: TinyProgress = {
      ...progress,
      colorsMixed: [...progress.colorsMixed, colorName],
      updatedAt: Date.now(),
    };
    saveProgress(updated);
  }, [progress, saveProgress]);

  const recordShapeMatch = useCallback((shape: ShapeType) => {
    if (!progress) return;
    const updated: TinyProgress = {
      ...progress,
      shapesMatched: progress.shapesMatched.includes(shape)
        ? progress.shapesMatched
        : [...progress.shapesMatched, shape],
      updatedAt: Date.now(),
    };
    saveProgress(updated);
  }, [progress, saveProgress]);

  const recordAnimalPlayed = useCallback((animalLabel: string) => {
    if (!progress) return;
    const updated: TinyProgress = {
      ...progress,
      animalsPlayed: progress.animalsPlayed.includes(animalLabel)
        ? progress.animalsPlayed
        : [...progress.animalsPlayed, animalLabel],
      updatedAt: Date.now(),
    };
    saveProgress(updated);
  }, [progress, saveProgress]);

  const addGardenItem = useCallback((item: Omit<GardenItem, 'id'>) => {
    if (!progress) return;
    const newItem: GardenItem = {
      ...item,
      id: `garden-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };
    const updated: TinyProgress = {
      ...progress,
      gardenItems: [...progress.gardenItems, newItem],
      updatedAt: Date.now(),
    };
    saveProgress(updated);
  }, [progress, saveProgress]);

  const recordBubblePop = useCallback((
    type: 'animal' | 'number' | 'letter',
    value: string | number
  ) => {
    if (!progress) return;
    const updated: TinyProgress = {
      ...progress,
      bubblesPopped: progress.bubblesPopped + 1,
      lettersEncountered:
        type === 'letter' && !progress.lettersEncountered.includes(value as string)
          ? [...progress.lettersEncountered, value as string]
          : progress.lettersEncountered,
      numbersEncountered:
        type === 'number' && !progress.numbersEncountered.includes(value as number)
          ? [...progress.numbersEncountered, value as number]
          : progress.numbersEncountered,
      updatedAt: Date.now(),
    };
    saveProgress(updated);
  }, [progress, saveProgress]);

  const recordWeather = useCallback((weather: WeatherType) => {
    if (!progress) return;
    if (progress.weathersDiscovered.includes(weather)) return;
    const updated: TinyProgress = {
      ...progress,
      weathersDiscovered: [...progress.weathersDiscovered, weather],
      updatedAt: Date.now(),
    };
    saveProgress(updated);
  }, [progress, saveProgress]);

  const recordFarmAnimal = useCallback((animalLabel: string): boolean => {
    if (!progress) return false;
    if (progress.farmAnimalsFound.includes(animalLabel)) return false;
    const allFound = progress.farmAnimalsFound.length + 1 >= FARM_ANIMALS.length;
    const updated: TinyProgress = {
      ...progress,
      farmAnimalsFound: [...progress.farmAnimalsFound, animalLabel],
      farmCompleted: allFound,
      updatedAt: Date.now(),
    };
    saveProgress(updated);
    return allFound;
  }, [progress, saveProgress]);

  const recordNightDiscovery = useCallback(() => {
    if (!progress || progress.nightDiscovered) return;
    const updated: TinyProgress = {
      ...progress,
      nightDiscovered: true,
      updatedAt: Date.now(),
    };
    saveProgress(updated);
  }, [progress, saveProgress]);

  const recordFullCycle = useCallback(() => {
    if (!progress) return;
    const updated: TinyProgress = {
      ...progress,
      fullCyclesCompleted: progress.fullCyclesCompleted + 1,
      updatedAt: Date.now(),
    };
    saveProgress(updated);
  }, [progress, saveProgress]);

  return {
    progress,
    loading,
    discoverAnimal,
    recordColorMix,
    recordShapeMatch,
    recordAnimalPlayed,
    addGardenItem,
    saveProgress,
    recordBubblePop,
    recordWeather,
    recordFarmAnimal,
    recordNightDiscovery,
    recordFullCycle,
  };
}
