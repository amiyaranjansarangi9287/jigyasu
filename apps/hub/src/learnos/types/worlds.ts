// src/types/worlds.ts
// World-specific base types

import type { AgeGroup } from './shared';

export type LumoVariant = 'none' | 'pip' | 'owl' | 'sage' | 'ancient' | 'peer';

export type LabSubject =
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'math'
  | 'earth-science'
  | 'computer-science';

/**
 * Phases that each concept goes through.
 * hook → wonder → interact → discover → reflect → extend → quiz → complete
 */
export type ConceptPhase =
  | 'hook'      // 15-30s wonder video/animation
  | 'wonder'    // Thought-provoking question
  | 'interact'  // Canvas-based exploration
  | 'discover'  // Guided realization
  | 'reflect'   // Personal connection
  | 'extend'    // Rabbit holes / wonder moments
  | 'quiz'      // Gamified assessment (no fail state)
  | 'complete'; // Celebration + garden growth

export interface WorldConfig {
  id: AgeGroup;
  label: string;
  ageRange: string;
  route: string;
  color: string;
  bgColor: string;
  lumoVariant: LumoVariant;
  maxSessionMinutes: number;
  minTouchTarget: number;
}

export interface ModuleConfig {
  id: string;
  worldId: AgeGroup;
  title: string;
  description: string;
  iconEmoji: string;
  order: number;
  estimatedMinutes: number;
  prerequisiteIds: string[];
  conceptIds: string[];
}

export interface ConceptConfig {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  phases: ConceptPhaseConfig[];
}

export interface ConceptPhaseConfig {
  type: 'hook' | 'wonder' | 'interact' | 'discover' | 'reflect' | 'extend' | 'quiz' | 'complete';
  component: string;
  estimatedSeconds: number;
  optional: boolean;
}

export interface WorldTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: string;
  shadowStyle: string;
}

export interface WorldNavigation {
  showProgress: boolean;
  showTimer: boolean;
  showLumo: boolean;
  showParentCorner: boolean;
  backBehavior: 'confirm' | 'immediate' | 'disabled';
}
