import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TutorialState {
  completedTutorials: Record<string, boolean>;
  markTutorialCompleted: (moduleId: string) => void;
  resetTutorial: (moduleId: string) => void;
  hasCompletedTutorial: (moduleId: string) => boolean;
}

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set, get) => ({
      completedTutorials: {},
      
      markTutorialCompleted: (moduleId: string) => set((state) => ({
        completedTutorials: {
          ...state.completedTutorials,
          [moduleId]: true
        }
      })),

      resetTutorial: (moduleId: string) => set((state) => {
        const newCompleted = { ...state.completedTutorials };
        delete newCompleted[moduleId];
        return { completedTutorials: newCompleted };
      }),

      hasCompletedTutorial: (moduleId: string) => {
        return !!get().completedTutorials[moduleId];
      }
    }),
    {
      name: 'jigyasu-tutorials',
    }
  )
);
