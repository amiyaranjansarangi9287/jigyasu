import Dexie, { Table } from 'dexie';

export interface UserProfile {
  id: string; // Typically 'default'
  name: string;
  avatar: string; // e.g., '🤖'
  language: string; // e.g., 'en', 'hi'
  createdAt: number;
  streakDays?: number;
  lastLoginDate?: string;
  xp?: number;
  dailyXP?: number;
  dailyGoalXP?: number;
  lastXPDate?: string;
  unlockedAvatars?: string[];
  ageTier?: string;
}

export interface ProgressRecord {
  id: string; // [appId, activityId].join(':')
  appId: string;
  activityId: string;
  completedSteps: number[];
  materialsChecked: number[];
  startedAt: number;
  elapsedSeconds: number;
  completedAt?: number; // timestamp
  score?: number;
  masteryLevel?: number; // 0 to 3 stars
  nextReviewDate?: number; // Timestamp for SRS
  srsInterval?: number; // Days between reviews
  srsFactor?: number; // Easiness factor for SRS
}

export interface FavoriteRecord {
  id: string; // [appId, activityId].join(':')
  appId: string;
  activityId: string;
  addedAt: number;
}

export interface TelemetryQueueRecord {
  id: string; // UUID
  eventType: string;
  payload: any;
  queuedAt: number;
  attempts: number;
}

export class JigyasuDB extends Dexie {
  progress!: Table<ProgressRecord, string>;
  favorites!: Table<FavoriteRecord, string>;
  telemetry_queue!: Table<TelemetryQueueRecord, string>;
  userProfile!: Table<UserProfile, string>;

  constructor() {
    super('JigyasuDB');
    this.version(4).stores({
      progress: 'id, appId, activityId, completedAt, nextReviewDate',
      favorites: 'id, appId, activityId, addedAt',
      telemetry_queue: 'id, eventType, queuedAt, attempts',
      userProfile: 'id'
    }).upgrade(_tx => {
      // Version 4 adds nextReviewDate index to progress
    });
  }
}

export const db = new JigyasuDB();
