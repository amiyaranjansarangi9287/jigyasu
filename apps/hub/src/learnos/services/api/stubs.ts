// src/services/api/stubs.ts
// Backend API stubs for local development and testing
// Simulates server responses without requiring a real backend

import type { LearningEvent } from '../../types/events';

export interface AnalyticsBatchRequest {
  events: LearningEvent[];
}

export interface AnalyticsBatchResponse {
  success: boolean;
  received: number;
  timestamp: number;
}

export interface AnalyticsSummaryResponse {
  totalEvents: number;
  uniqueSessions: number;
  topModules: { moduleId: string; count: number }[];
  dateRange: { start: number; end: number };
}

export interface SyncProgressRequest {
  progress: Array<{
    conceptId: string;
    status: string;
    attemptsCount: number;
    timeSpentSeconds: number;
  }>;
}

export interface SyncProgressResponse {
  success: boolean;
  synced: number;
  conflicts: Array<{ conceptId: string; serverVersion: number; localVersion: number }>;
}

// In-memory store for stub data
const stubStore = {
  events: [] as LearningEvent[],
  sessions: new Set<string>(),
  moduleCounts: new Map<string, number>(),
};

/**
 * Stub for POST /api/analytics/batch
 * Accepts batch events and stores them in memory.
 */
export async function stubAnalyticsBatch(
  request: AnalyticsBatchRequest
): Promise<AnalyticsBatchResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 100));

  const events = request.events ?? [];

  // Process events
  for (const event of events) {
    stubStore.events.push(event);
    stubStore.sessions.add(event.sessionId);

    // Track module counts
    const count = stubStore.moduleCounts.get(event.moduleId) ?? 0;
    stubStore.moduleCounts.set(event.moduleId, count + 1);
  }

  // Cap stored events to prevent memory issues
  if (stubStore.events.length > 1000) {
    stubStore.events = stubStore.events.slice(-500);
  }

  return {
    success: true,
    received: events.length,
    timestamp: Date.now(),
  };
}

/**
 * Stub for GET /api/analytics/summary
 * Returns aggregated analytics data.
 */
export async function stubAnalyticsSummary(): Promise<AnalyticsSummaryResponse> {
  await new Promise((resolve) => setTimeout(resolve, 30 + Math.random() * 50));

  const topModules = Array.from(stubStore.moduleCounts.entries())
    .map(([moduleId, count]) => ({ moduleId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const timestamps = stubStore.events.map((e) => e.timestamp);
  const dateRange = {
    start: timestamps.length ? Math.min(...timestamps) : Date.now(),
    end: timestamps.length ? Math.max(...timestamps) : Date.now(),
  };

  return {
    totalEvents: stubStore.events.length,
    uniqueSessions: stubStore.sessions.size,
    topModules,
    dateRange,
  };
}

/**
 * Stub for POST /api/sync/progress
 * Simulates progress sync with conflict detection.
 */
export async function stubSyncProgress(
  request: SyncProgressRequest
): Promise<SyncProgressResponse> {
  await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200));

  // In a real backend, this would compare with server state
  // For stubs, we just acknowledge all progress
  return {
    success: true,
    synced: request.progress?.length ?? 0,
    conflicts: [],
  };
}

/**
 * Reset stub store (useful for testing)
 */
export function resetStubStore(): void {
  stubStore.events = [];
  stubStore.sessions.clear();
  stubStore.moduleCounts.clear();
}

/**
 * Get current stub state (useful for debugging)
 */
export function getStubState() {
  return {
    eventCount: stubStore.events.length,
    sessionCount: stubStore.sessions.size,
    moduleCount: stubStore.moduleCounts.size,
  };
}
