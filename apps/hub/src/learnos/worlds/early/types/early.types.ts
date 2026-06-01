// src/worlds/early/types/early.types.ts

export type EarlyModule =
  | 'story-builder'
  | 'number-line'
  | 'alphabet-forest'
  | 'mini-chef'
  | 'pattern-patrol'
  | 'word-scramble'
  | 'plant-growth'
  | 'water-cycle'
  | 'habitat-heroes'
  | 'shadow-detective'
  | 'magnet-explorer'
  | 'coin-counter';

export type PipEmotion =
  | 'idle'
  | 'excited'
  | 'celebrating'
  | 'curious'
  | 'thinking'
  | 'surprised'
  | 'sleepy'
  | 'encouraging';

export interface PipState {
  emotion: PipEmotion;
  speaking: boolean;
  currentMessage: string;
  muted: boolean;
}

export interface StoryCard {
  id: number;
  text: string;
  emoji: string;
  background: string;
}

export interface Story {
  id: string;
  title: string;
  cards: StoryCard[];
  character: string;
  place: string;
  problem: string;
  completed: boolean;
}

export interface RecipeIngredient {
  name: string;
  emoji: string;
  amount: number;
  unit: string;
  visualFraction?: string;
}

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  servings: number;
  ingredients: RecipeIngredient[];
  difficulty: 1 | 2 | 3;
  isIndian: boolean;
}

export interface PatternItem {
  emoji: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface Pattern {
  id: string;
  type: 'AB' | 'ABB' | 'ABC' | 'size' | 'color+shape';
  sequence: PatternItem[];
  missingIndex: number;
  difficulty: 1 | 2 | 3;
}

export interface WordSentence {
  id: string;
  words: string[];
  correctOrder: number[];
  animation: string;
  animationEmoji: string;
}

export interface EarlyProgress {
  storiesBuilt: number;
  storiesCompleted: number;
  storyChoices: string[];
  problemsSolved: number;
  highestNumber: number;
  negativeIntroduced: boolean;
  lettersExplored: string[];
  currentLetter: string;
  recipesAttempted: string[];
  recipesCompleted: string[];
  patternsCompleted: number;
  highestDifficulty: number;
  sentencesCompleted: number;
  // AA-B additions
  plantStagesCompleted: number;
  waterCycleCompleted: number;
  habitatsExplored: number;
  shadowChallengesSolved: number;
  magnetSortingCompleted: number;
  correctPurchases: number;
  totalPurchaseAttempts: number;
  // Session data
  totalSessions: number;
  totalMinutes: number;
  lastSessionAt: number;
  pipInteractions: number;
  hintsUsed: number;
  wrongAnswers: number;
  updatedAt: number;
}
