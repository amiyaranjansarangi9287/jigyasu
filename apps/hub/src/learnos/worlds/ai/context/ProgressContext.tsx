import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  Badge, 
  allBadges, 
  conceptBadges,
  getLevelForXP,
  getXPProgress,
  XP_REWARDS,
} from '../data/gamification';
import { concepts } from '../data/concepts';
import { useTranslation } from 'react-i18next';

interface QuizScore {
  conceptId: string;
  score: number;
  total: number;
  date: string;
}

interface ProgressState {
  xp: number;
  completedConcepts: string[];
  earnedBadges: string[];
  quizScores: QuizScore[];
  streak: number;
  lastActiveDate: string | null;
  totalTimeSpent: number; // in minutes
  visitedConcepts: string[];
  perfectQuizzes: string[];
}

interface ProgressContextType extends ProgressState {
  // Actions
  completePhase: (conceptId: string, phase: 'story' | 'learn' | 'explore' | 'quiz', quizScore?: { score: number; total: number }) => void;
  completeConcept: (conceptId: string) => void;
  visitConcept: (conceptId: string) =>void;
  addXP: (amount: number) => void;
  
  // Computed values
  level: ReturnType<typeof getLevelForXP>;
  xpProgress: ReturnType<typeof getXPProgress>;
  unlockedBadges: Badge[];
  lockedBadges: Badge[];
  recentBadge: Badge | null;
  
  // Utilities
  getBadgeById: (id: string) => Badge | undefined;
  isConceptCompleted: (conceptId: string) => boolean;
  getQuizScore: (conceptId: string) => QuizScore | undefined;
  clearRecentBadge: () => void;
}

const defaultState: ProgressState = {
  xp: 0,
  completedConcepts: [],
  earnedBadges: [],
  quizScores: [],
  streak: 0,
  lastActiveDate: null,
  totalTimeSpent: 0,
  visitedConcepts: [],
  perfectQuizzes: [],
};

const STORAGE_KEY = 'ai-explorers-progress';

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultState, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not load progress from localStorage');
    }
    return defaultState;
  });

  const [recentBadge, setRecentBadge] = useState<Badge | null>(null);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save progress to localStorage');
    }
  }, [state]);

  // Check and update streak on mount
  useEffect(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (state.lastActiveDate === today) {
      // Already active today, do nothing
      return;
    }

    if (state.lastActiveDate === yesterday) {
      // Continue streak
      setState(prev => ({
        ...prev,
        streak: prev.streak + 1,
        lastActiveDate: today,
      }));
    } else if (state.lastActiveDate !== today) {
      // Streak broken or first visit
      setState(prev => ({
        ...prev,
        streak: prev.lastActiveDate ? 1 : 0,
        lastActiveDate: today,
      }));
    }
  }, []);

  // Check for new badges whenever state changes
  const checkForNewBadges = useCallback((newState: ProgressState): string[] => {
    const newBadges: string[] = [];

    // Check concept badges
    conceptBadges.forEach(badge => {
      if (
        badge.conceptId &&
        newState.completedConcepts.includes(badge.conceptId) &&
        !newState.earnedBadges.includes(badge.id)
      ) {
        newBadges.push(badge.id);
      }
    });

    // Check special badges
    // First Steps
    if (newState.completedConcepts.length >= 1 && !newState.earnedBadges.includes('first-steps')) {
      newBadges.push('first-steps');
    }

    // Halfway Hero
    if (newState.completedConcepts.length >= 4 && !newState.earnedBadges.includes('halfway-hero')) {
      newBadges.push('halfway-hero');
    }

    // AI Master
    if (newState.completedConcepts.length >= concepts.length && !newState.earnedBadges.includes('ai-master')) {
      newBadges.push('ai-master');
    }

    // Quiz Whiz
    if (newState.perfectQuizzes.length > 0 && !newState.earnedBadges.includes('quiz-whiz')) {
      newBadges.push('quiz-whiz');
    }

    // Streak badges
    if (newState.streak >= 3 && !newState.earnedBadges.includes('streak-starter')) {
      newBadges.push('streak-starter');
    }
    if (newState.streak >= 7 && !newState.earnedBadges.includes('streak-keeper')) {
      newBadges.push('streak-keeper');
    }
    if (newState.streak >= 14 && !newState.earnedBadges.includes('dedicated-learner')) {
      newBadges.push('dedicated-learner');
    }

    // Curious Explorer
    if (newState.visitedConcepts.length >= concepts.length && !newState.earnedBadges.includes('curious-explorer')) {
      newBadges.push('curious-explorer');
    }

    // Time-based badges
    const hour = new Date().getHours();
    if (hour < 9 && !newState.earnedBadges.includes('early-bird')) {
      newBadges.push('early-bird');
    }
    if (hour >= 21 && !newState.earnedBadges.includes('night-owl')) {
      newBadges.push('night-owl');
    }

    return newBadges;
  }, []);

  const addXP = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  }, []);

  const visitConcept = useCallback((conceptId: string) => {
    setState(prev => {
      if (prev.visitedConcepts.includes(conceptId)) {
        return prev;
      }
      const newState = {
        ...prev,
        visitedConcepts: [...prev.visitedConcepts, conceptId],
      };
      
      const newBadges = checkForNewBadges(newState);
      if (newBadges.length > 0) {
        newState.earnedBadges = [...prev.earnedBadges, ...newBadges];
        setRecentBadge(allBadges.find(b => b.id === newBadges[0]) || null);
      }
      
      return newState;
    });
  }, [checkForNewBadges]);

  const completePhase = useCallback((
    conceptId: string,
    phase: 'story' | 'learn' | 'explore' | 'quiz',
    quizScore?: { score: number; total: number }
  ) => {
    setState(prev => {
      let xpGain = 0;
      let newState = { ...prev };

      switch (phase) {
        case 'story':
          xpGain = XP_REWARDS.COMPLETE_STORY;
          break;
        case 'learn':
          xpGain = XP_REWARDS.COMPLETE_LEARN;
          break;
        case 'explore':
          xpGain = XP_REWARDS.COMPLETE_EXPLORE;
          break;
        case 'quiz':
          xpGain = XP_REWARDS.COMPLETE_QUIZ;
          if (quizScore) {
            // Record quiz score
            newState.quizScores = [
              ...prev.quizScores.filter(s => s.conceptId !== conceptId),
              { conceptId, ...quizScore, date: new Date().toISOString() },
            ];
            
            // Check for perfect quiz
            if (quizScore.score === quizScore.total) {
              xpGain += XP_REWARDS.PERFECT_QUIZ;
              if (!prev.perfectQuizzes.includes(conceptId)) {
                newState.perfectQuizzes = [...prev.perfectQuizzes, conceptId];
              }
            }
          }
          break;
      }

      newState.xp = prev.xp + xpGain;
      
      // Check for new badges
      const newBadges = checkForNewBadges(newState);
      if (newBadges.length > 0) {
        newState.earnedBadges = [...prev.earnedBadges, ...newBadges];
        setRecentBadge(allBadges.find(b => b.id === newBadges[0]) || null);
      }

      return newState;
    });
  }, [checkForNewBadges]);

  const completeConcept = useCallback((conceptId: string) => {
    setState(prev => {
      if (prev.completedConcepts.includes(conceptId)) {
        return prev;
      }

      let xpBonus = 0;
      
      // First concept bonus
      if (prev.completedConcepts.length === 0) {
        xpBonus += XP_REWARDS.FIRST_CONCEPT;
      }
      
      // All concepts bonus
      if (prev.completedConcepts.length === concepts.length - 1) {
        xpBonus += XP_REWARDS.ALL_CONCEPTS;
      }

      const newState = {
        ...prev,
        completedConcepts: [...prev.completedConcepts, conceptId],
        xp: prev.xp + xpBonus,
      };

      // Check for new badges
      const newBadges = checkForNewBadges(newState);
      if (newBadges.length > 0) {
        newState.earnedBadges = [...prev.earnedBadges, ...newBadges];
        setRecentBadge(allBadges.find(b => b.id === newBadges[0]) || null);
      }

      return newState;
    });
  }, [checkForNewBadges]);

  const clearRecentBadge = useCallback(() => {
    setRecentBadge(null);
  }, []);

  const getBadgeById = useCallback((id: string) => {
    return allBadges.find(b => b.id === id);
  }, []);

  const isConceptCompleted = useCallback((conceptId: string) => {
    return state.completedConcepts.includes(conceptId);
  }, [state.completedConcepts]);

  const getQuizScore = useCallback((conceptId: string) => {
    return state.quizScores.find(s => s.conceptId === conceptId);
  }, [state.quizScores]);

  const level = getLevelForXP(state.xp);
  const xpProgress = getXPProgress(state.xp);
  
  const unlockedBadges = allBadges.filter(b => state.earnedBadges.includes(b.id));
  const lockedBadges = allBadges.filter(b =>!state.earnedBadges.includes(b.id));

  return (<ProgressContext.Provider
      value={{
        ...state,
        completePhase,
        completeConcept,
        visitConcept,
        addXP,
        level,
        xpProgress,
        unlockedBadges,
        lockedBadges,
        recentBadge,
        getBadgeById,
        isConceptCompleted,
        getQuizScore,
        clearRecentBadge,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
