import os

client_ts_path = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/services/api/client.ts'

new_content = """// src/services/api/client.ts
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
 * Enhanced fetch with exponential backoff for network resilience.
 * Crucial for low-end devices and spotty internet connections.
 */
async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3): Promise<Response> {
  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, options);
      
      // If we get a 5xx error, we should retry. Otherwise, return the response.
      if (response.status >= 500 && response.status < 600) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      attempt++;
      
      if (attempt >= maxRetries) {
        break;
      }
      
      // Exponential backoff: 1s, 2s, 4s...
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Network request failed after multiple retries');
}

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

  const response = await fetchWithRetry(`${API_BASE}/analytics/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events }),
  });

  if (!response.ok) {
    throw new Error(`Oops! We couldn't save your progress right now dYT^ (${response.status})`);
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

  const response = await fetchWithRetry(`${API_BASE}/analytics/summary`);

  if (!response.ok) {
    throw new Error(`Oops! We couldn't fetch your progress dYT^ (${response.status})`);
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

  const response = await fetchWithRetry(`${API_BASE}/sync/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ progress }),
  });

  if (!response.ok) {
    throw new Error(`Oops! We couldn't sync your magic progress dYT^ (${response.status})`);
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
    // We don't retry health checks to fail fast.
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
"""

with open(client_ts_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Updated client.ts with exponential backoff!')
