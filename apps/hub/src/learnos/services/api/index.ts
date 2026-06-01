// src/services/api/index.ts
// API layer — stubs for development, real backend in production

export {
  sendAnalyticsBatch,
  getAnalyticsSummary,
  syncProgress,
  checkApiHealth,
} from './client';

export {
  stubAnalyticsBatch,
  stubAnalyticsSummary,
  stubSyncProgress,
  resetStubStore,
  getStubState,
} from './stubs';

export type {
  AnalyticsBatchRequest,
  AnalyticsBatchResponse,
  AnalyticsSummaryResponse,
  SyncProgressRequest,
  SyncProgressResponse,
} from './stubs';
