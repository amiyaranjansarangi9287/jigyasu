// src/worlds/academy/types/academy.types.ts

export type AcademyModule =
  | 'trigonometry-circle' | 'projectile-motion' | 'wave-interference'
  | 'derivatives-visual' | 'redox-reactions' | 'dna-synthesis'
  | 'electrolysis' | 'natural-selection' | 'essay-architect'
  | 'economic-indicators' | 'trig-identities' | 'climate-systems';

export type AcademySubject = 'mathematics' | 'physics' | 'chemistry' | 'biology' | 'economics' | 'english';
export type ExamBoard = 'CBSE' | 'ICSE' | 'JEE' | 'NEET' | 'IB';
export type PeacockAncientEmotion = 'absent' | 'glow' | 'question' | 'profound';
export type DepthLevel = 'surface' | 'mechanism' | 'principle' | 'frontier';

export interface ExamQuestion {
  id: string; board: ExamBoard; year?: number; question: string;
  options?: string[]; correctIndex?: number; markscheme: string; marks: number; topic: string;
}

export interface AcademyModuleMetadata {
  id: AcademyModule; title: string; emoji: string; subject: AcademySubject;
  color: string; path: string; hook: string; beauty: string; realFuture: string;
  examRelevance: string; examQuestions: ExamQuestion[];
}

export interface AcademyProgress {
  unitCircleExplored: boolean; wavesConnected: boolean; radiansMastered: boolean; phaseShiftFound: boolean;
  optimalAngleDiscovered: boolean; airResistanceCompared: boolean; trajectoryEquationFound: boolean;
  constructiveFound: boolean; destructiveFound: boolean; noiseCancellingUnderstood: boolean; youngDoubleSlitConnected: boolean;
  slopeAsDerivative: boolean; minMaxFound: boolean; positionVelocityAccel: boolean; chainRuleAttempted: boolean;
  oxidationStateBalanced: boolean; halfReactionsUsed: boolean; batteryChemistryUnderstood: boolean;
  basePairingMastered: boolean; mutationEffect: boolean; proteinSynthesisComplete: boolean; crisperMentioned: boolean;
  electrolysisSetupsDone: string[]; faradayCalculated: boolean; greenHydrogenUnderstood: boolean;
  selectionGenerationsRun: number; tippingPointConceptUnderstood: boolean; antibioticResistanceConnected: boolean;
  essayPromptsAttempted: string[]; counterArgStrengthened: boolean; structureScoreAvg: number;
  indicatorsExplored: string[]; policyDecisionsApplied: string[]; tradeOffUnderstood: boolean;
  identitiesProven: string[]; geometricProofCompleted: boolean; identitiesUsedInProblems: number;
  feedbackLoopsFound: string[]; tippingPointsIdentified: number; climateDataInterpreted: boolean;
  depth: Record<AcademyModule, DepthLevel | null>;
  examQuestionsAttempted: number; examQuestionsCorrect: number; examBoardsEngaged: ExamBoard[];
  connectionsFound: number;
  totalSessions: number; totalMinutes: number; lastSessionAt: number; longestSession: number;
  updatedAt: number;
}
