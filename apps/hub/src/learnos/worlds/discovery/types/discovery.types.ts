// src/worlds/discovery/types/discovery.types.ts

export type DiscoveryModule =
  | 'algebra-scales'
  | 'cell-city'
  | 'chemical-balancer'
  | 'geometry-proof'
  | 'speed-distance-time'
  | 'genetics-simulator'
  | 'plate-tectonics'
  | 'literary-analysis'
  | 'economic-simulation'
  | 'periodic-table'
  | 'probability-sandbox'
  | 'carbon-cycle'
  | 'number-systems'
  | 'fermi-estimation';

export type DiscoverySubject =
  | 'math'
  | 'biology'
  | 'chemistry'
  | 'physics'
  | 'earth-science'
  | 'computer-science'
  | 'economics'
  | 'language';

export type PeacockSageEmotion =
  | 'idle'
  | 'observing'
  | 'questioning'
  | 'celebrating'
  | 'thinking'
  | 'connecting';

export type MasteryLevel =
  | 'aware'       // Engaged with the concept
  | 'understand'  // Passed the investigation
  | 'apply'       // Used in context
  | 'connect';    // Connected to other concepts

export interface ConceptNode {
  id: DiscoveryModule;
  title: string;
  subject: DiscoverySubject;
  x: number;   // 0-1 position on constellation map
  y: number;
  mastery: MasteryLevel | null;
  connections: DiscoveryModule[];
}

export interface DiscoveryProgress {
  equationsSolved: number;
  substitutionUsed: boolean;
  twoVariablesSolved: boolean;
  organellesPlaced: number;
  correctOrganelles: number;
  cellTypesCompared: string[];
  reactionsBalanced: number;
  realReactionsBalanced: string[];
  proofsCompleted: number;
  pythagorasVisualized: boolean;
  circleTheoremsFound: number;
  graphsInterpreted: number;
  slopeDiscovered: boolean;
  accelerationFound: boolean;
  crossesRun: number;
  dominanceUnderstood: boolean;
  probabilityConnectionMade: boolean;
  mastery: Record<DiscoveryModule, MasteryLevel | null>;
  connectionsFound: number;
  connectionIds: string[];
  rabbitHolesEntered: number;
  rabbitHoleIds: string[];
  unsolvedQuestionsViewed: number;
  // DE-B fields
  tectonicsInteractions: number;
  boundaryTypesFound: string[];
  literaryTextsAnalysed: string[];
  devicesIdentified: string[];
  economicSimsRun: number;
  eventsApplied: string[];
  elementsExplored: string[];
  periodicPatternsFound: number;
  experimentsRun: number;
  paradoxesDiscovered: string[];
  carbonFlowsTracked: string[];
  humanImpactUnderstood: boolean;
  numberSystemsConverted: string[];
  binaryUnderstood: boolean;
  fermiProblemsAttempted: number;
  fermiAccuracyScore: number;
  lumoInteractions: number;
  lumoActedOn: number;
  totalSessions: number;
  totalMinutes: number;
  lastSessionAt: number;
  updatedAt: number;
}

export interface ChemicalElement {
  symbol: string;
  name: string;
  color: string;
  count: number;
}

export interface ChemicalReaction {
  id: string;
  name: string;
  reactants: { formula: string; elements: ChemicalElement[]; count: number }[];
  products: { formula: string; elements: ChemicalElement[]; count: number }[];
  animation: 'explosion' | 'fizz' | 'glow' | 'smoke';
  realWorldContext: string;
  indianRelevance?: string;
}

export interface GeometryTheorem {
  id: string;
  name: string;
  statement: string;
  emoji: string;
  proofSteps: string[];
  interactiveType: 'triangle-angles' | 'pythagorean' | 'circle-theorem';
}

export interface GeneticTrait {
  id: string;
  name: string;
  emoji: string;
  dominantAllele: string;
  recessiveAllele: string;
  dominantPhenotype: string;
  recessivePhenotype: string;
  exampleContext: string;
}
