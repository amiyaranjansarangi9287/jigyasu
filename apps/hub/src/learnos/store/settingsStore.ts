// src/store/settingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '../types/shared';

interface SettingsStore {
  defaultLanguage: Language;
  soundEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  dyslexiaFont: boolean;
  offlineMode: boolean;

  setDefaultLanguage: (lang: Language) => void;
  toggleSound: () => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  toggleDyslexiaFont: () => void;
  setOfflineMode: (offline: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      defaultLanguage: 'en',
      soundEnabled: true,
      reducedMotion: false,
      highContrast: false,
      dyslexiaFont: false,
      offlineMode: false,

      setDefaultLanguage: (lang) => set({ defaultLanguage: lang }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
      toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
      toggleDyslexiaFont: () => set((s) => ({ dyslexiaFont: !s.dyslexiaFont })),
      setOfflineMode: (offline) => set({ offlineMode: offline }),
    }),
    { name: 'learnos-settings', version: 1 }
  )
);
