// src/services/api/client.ts
// API client that routes to stubs in development, real backend in production

import type { LearningEvent } from '../../types/events';
import {
  stubAnalyticsBatch,
  stubAnalyticsSummary,
  stubSyncProgress,
  type AnalyticsBatchResponse,
  type AnalyticsSummaryResponse,
  type SyncProgressRequest,
  type SyncProgressResponse,
} from './stubs';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';
const USE_STUBS = import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL;

/**
 * POST /api/analytics/batch
 * Send batch of telemetry events to the server.
 */
export async function sendAnalyticsBatch(
  events: LearningEvent[]
): Promise<AnalyticsBatchResponse> {
  if (USE_STUBS) {
    return stubAnalyticsBatch({ events });
  }

  const response = await fetch(`${API_BASE}/analytics/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events }),
  });

  if (!response.ok) {
    throw new Error(`Oops! We couldn't save your progress right now 🙈 (${response.status})`);
  }

  return response.json();
}

/**
 * GET /api/analytics/summary
 * Get aggregated analytics summary.
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummaryResponse> {
  if (USE_STUBS) {
    return stubAnalyticsSummary();
  }

  const response = await fetch(`${API_BASE}/analytics/summary`);

  if (!response.ok) {
    throw new Error(`Oops! We couldn't fetch your progress 🙈 (${response.status})`);
  }

  return response.json();
}

/**
 * POST /api/sync/progress
 * Sync local progress with server.
 */
export async function syncProgress(
  progress: SyncProgressRequest['progress']
): Promise<SyncProgressResponse> {
  if (USE_STUBS) {
    return stubSyncProgress({ progress });
  }

  const response = await fetch(`${API_BASE}/sync/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ progress }),
  });

  if (!response.ok) {
    throw new Error(`Oops! We couldn't sync your magic progress 🙈 (${response.status})`);
  }

  return response.json();
}

/**
 * Health check endpoint
 */
export async function checkApiHealth(): Promise<boolean> {
  if (USE_STUBS) {
    return true;
  }

  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
