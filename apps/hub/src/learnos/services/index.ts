// src/services/index.ts
export { LearningService } from './LearningService';
export { SessionService } from './SessionService';
export {
  getTeachingBridgeStatus,
  requestConceptMap,
  requestHint,
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
