// src/services/index.ts
export { LearningService } from './LearningService';
export { SessionService } from './SessionService';
export {
  clearTeachingBridgeCache,
  getTeachingBridgeStatus,
  requestConceptMap,
  requestConceptMapCached,
  requestHint,
  requestHintCached,
  requestNextActivity,
} from './TeachingBridge';
export type {
  TeachingActivity,
  TeachingArtifact,
  TeachingBridgeConceptMap,
  TeachingBridgeFeatureStatus,
  TeachingBridgeHint,
  TeachingBridgeNextActivity,
  TeachingBridgeRequest,
} from './TeachingBridge';
export { buildLocalSummary, generateLocalSummary } from './LocalSummaryService';
export type {
  ConceptEnrichment,
  LocalProgressSummary,
  LocalSummaryOptions,
} from './LocalSummaryService';
