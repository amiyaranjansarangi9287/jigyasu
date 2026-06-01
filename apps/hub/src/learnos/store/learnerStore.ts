// src/store/learnerStore.ts
// Anonymous learner state — no profiles, no auth, just local progress

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AgeGroup, Language, ConceptStatus } from '../types/shared';

interface ModuleProgress {
  moduleId: string;
  status: ConceptStatus;
  attemptsCount: number;
  hintsUsed: number;
  wrongAnswers: number;
  timeSpentSeconds: number;
  lastAccessedAt: number;
}

interface LearnerState {
  language: Language;
  currentWorld: AgeGroup | null;
  visitedWorlds: AgeGroup[];
  moduleProgress: Record<string, ModuleProgress>;
  lastModule: string | null;
  lastModulePath: string | null;
  lastModuleWorld: AgeGroup | null;
  totalSessions: number;
  totalMinutes: number;
  lastSessionAt: number;
  contentVersion: string;

  setLanguage: (lang: Language) => void;
  enterWorld: (world: AgeGroup) => void;
  enterModule: (moduleId: string, path: string, world: AgeGroup) => void;
  getLastModule: () => { moduleId: string; path: string; world: AgeGroup } | null;
  updateModuleProgress: (moduleId: string, updates: Partial<ModuleProgress>) => void;
  incrementSession: () => void;
  addTime: (minutes: number) => void;
  resetProgress: () => void;
}

function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem('learnos-language');
    if (stored && ['en', 'hi', 'ta', 'te', 'kn', 'od'].includes(stored)) {
      return stored as Language;
    }
  } catch {
    // Ignore
  }
  return 'en';
}

interface PersistedStateV1 {
  language: Language;
  currentWorld: AgeGroup | null;
  visitedWorlds: AgeGroup[];
  moduleProgress: Record<string, ModuleProgress>;
  totalSessions: number;
  totalMinutes: number;
  lastSessionAt: number;
  contentVersion: string;
}

interface PersistedStateV2 extends PersistedStateV1 {
  lastModule: string | null;
  lastModulePath: string | null;
  lastModuleWorld: AgeGroup | null;
}

type PersistedState = PersistedStateV1 | PersistedStateV2;

function migratePersistedState(persisted: PersistedState, version: number): LearnerState {
  const base = persisted as PersistedStateV1;

  if (version < 2) {
    // v1 → v2: Add continue learning fields
    return {
      ...base,
      lastModule: null,
      lastModulePath: null,
      lastModuleWorld: null,
      // Add methods (not persisted, recreated)
      setLanguage: () => {},
      enterWorld: () => {},
      enterModule: () => {},
      getLastModule: () => null,
      updateModuleProgress: () => {},
      incrementSession: () => {},
      addTime: () => {},
      resetProgress: () => {},
    } as unknown as LearnerState;
  }

  return persisted as LearnerState;
}

export const useLearnerStore = create<LearnerState>()(
  persist(
    (set, get) => ({
      language: getStoredLanguage(),
      currentWorld: null,
      visitedWorlds: [],
      moduleProgress: {},
      lastModule: null,
      lastModulePath: null,
      lastModuleWorld: null,
      totalSessions: 0,
      totalMinutes: 0,
      lastSessionAt: Date.now(),
      contentVersion: '1.0.0',

      setLanguage: (lang) => {
        try {
          localStorage.setItem('learnos-language', lang);
        } catch {
          // Ignore
        }
        set({ language: lang });
      },

      enterWorld: (world) => {
        set((state) => ({
          currentWorld: world,
          visitedWorlds: state.visitedWorlds.includes(world)
            ? state.visitedWorlds
            : [...state.visitedWorlds, world],
          lastSessionAt: Date.now(),
        }));
      },

      enterModule: (moduleId, path, world) => {
        set({
          lastModule: moduleId,
          lastModulePath: path,
          lastModuleWorld: world,
          currentWorld: world,
          lastSessionAt: Date.now(),
        });
      },

      getLastModule: () => {
        const state = get();
        if (!state.lastModule || !state.lastModulePath || !state.lastModuleWorld) {
          return null;
        }
        return {
          moduleId: state.lastModule,
          path: state.lastModulePath,
          world: state.lastModuleWorld,
        };
      },

      updateModuleProgress: (moduleId, updates) => {
        set((state) => {
          const existing = state.moduleProgress[moduleId] ?? {
            moduleId,
            status: 'not_started' as ConceptStatus,
            attemptsCount: 0,
            hintsUsed: 0,
            wrongAnswers: 0,
            timeSpentSeconds: 0,
            lastAccessedAt: Date.now(),
          };
          return {
            moduleProgress: {
              ...state.moduleProgress,
              [moduleId]: { ...existing, ...updates, lastAccessedAt: Date.now() },
            },
          };
        });
      },

      incrementSession: () => {
        set((state) => ({
          totalSessions: state.totalSessions + 1,
          lastSessionAt: Date.now(),
        }));
      },

      addTime: (minutes) => {
        set((state) => ({
          totalMinutes: state.totalMinutes + minutes,
        }));
      },

      resetProgress: () => {
        set({
          moduleProgress: {},
          lastModule: null,
          lastModulePath: null,
          lastModuleWorld: null,
          totalSessions: 0,
          totalMinutes: 0,
          lastSessionAt: Date.now(),
        });
      },
    }),
    {
      name: 'learnos-learner',
      version: 2,
      migrate: (persisted, version) => migratePersistedState(persisted as PersistedState, version),
    }
  )
);
