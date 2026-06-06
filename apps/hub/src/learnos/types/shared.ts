// src/types/shared.ts

export type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'od';

export type AgeGroup =
  | 'tiny'       // Ages 2-5
  | 'early'      // Ages 5-8
  | 'lab'        // Ages 8-10
  | 'discovery'  // Ages 10-13
  | 'academy'    // Ages 13-15
  | 'explorer'   // Adults 25+
  | 'crosscutting' // Cross-age features
  | 'biology'    // Biology modules 10-18
  | 'math'       // Math Kingdom 5-18
  | 'physics';   // PhysicsVerse 10-18

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type ConnectionType = '2g' | '3g' | '4g' | 'wifi' | 'offline';

export type WonderLevel =
  | 'early_explorer'
  | 'growing_wonder'
  | 'high_wonder'
  | 'deep_wonder';

export type ConceptStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'mastered';

export type VideoType =
  | 'real_world_wonder'
  | 'real_scientist'
  | 'toybox_timelapse'
  | 'animated_hook';

export interface ChildProfile {
  id: string;                    // UUID
  name: string;
  ageGroup: AgeGroup;
  language: Language;
  avatarEmoji: string;
  lumoName: string;              // Default: "Lumo", child can rename
  lumoEnabled: boolean;          // Toggle on/off
  createdAt: number;             // Date.now()
  lastActiveAt: number;
  totalSessions: number;
  totalMinutes: number;
  wonderLevel: WonderLevel;
  wonderScore: number;           // Raw score, calculated silently
}

export interface FamilyProfile {
  id: string;
  children: ChildProfile[];
  parentLanguage: Language;
  parentPinHash: string;         // Simple 4-digit PIN, hashed
  createdAt: number;
  supporterSince?: number;       // If Wonder Supporter
}

export interface Session {
  id: string;                    // UUID
  ageGroup: AgeGroup;
  startedAt: number;
  endedAt?: number;
  language: Language;
  deviceType: DeviceType;
  connectionType: ConnectionType;
  modulesVisited: string[];
  eventsCount: number;
  wonderMoments: number;
}

export interface ConceptProgress {
  conceptId: string;
  ageGroup: AgeGroup;
  status: ConceptStatus;
  startedAt?: number;
  completedAt?: number;
  masteredAt?: number;
  attemptsCount: number;
  hintsUsed: number;
  wrongAnswers: number;
  timeSpentSeconds: number;
  lumoInteractions: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  contentVersion?: string;
}

export interface Achievement {
  id: string;
  achievementType: string;
  unlockedAt: number;
  conceptId?: string;
  moduleId?: string;
}

export interface LumoTrigger {
  id?: number;                   // Auto-increment in IndexedDB
  type: 'after_mistake' | 'before_breakthrough' | 'after_discovery' | 'cross_concept';
  message: string;               // In current language
  conceptId: string;
  triggeredAt: number;
  actedOn: boolean;
}

export interface VideoMetadata {
  id: string;
  type: VideoType;
  conceptId: string;
  youtubeId?: string;            // Phase 1: YouTube
  cloudflareId?: string;         // Phase 2: Cloudflare Stream
  durationSeconds: number;
  language: Language;
  captioned: boolean;
  offlineCached: boolean;
}

export interface WonderGardenItem {
  id: string;
  childId: string;
  itemType: string;
  itemName: string;
  unlockedAt: number;
  ageGroup: AgeGroup;
  moduleId: string;
}
