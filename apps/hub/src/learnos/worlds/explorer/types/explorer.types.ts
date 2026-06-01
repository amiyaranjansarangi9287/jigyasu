export type ExplorerConcept =
  | 'gravity-orbits'
  | 'states-of-matter'
  | 'pi-visual'
  | 'photosynthesis'
  | 'fractions-sharing'
  | 'water-cycle'
  | 'magnets'
  | 'float-sink'
  | 'day-night'
  | 'food-chain'
  | 'electricity'
  | 'evolution'
  | 'probability'
  | 'dna-nature'
  | 'climate';

export type ExplorerSubject =
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'mathematics'
  | 'earth'
  | 'everyday';

export type InterestLens =
  | 'always-wondered'
  | 'everyday-science'
  | 'my-children'
  | 'never-understood'
  | 'visual-math'
  | 'history-of-ideas';

export type PeacockPeerEmotion =
  | 'absent'
  | 'sharing'
  | 'questioning'
  | 'connecting';

export interface ExplorerConceptMetadata {
  id: ExplorerConcept;
  title: string;
  emoji: string;
  subject: ExplorerSubject;
  hook: string;
  everydayConnection: string;
  lenses: InterestLens[];
  path: string;
  lumoOpener: string;
  thinkingPrompt: string;
  indianContext: string;
  estimatedMinutes: number;
}

export interface ExplorerProgress {
  conceptsVisited: ExplorerConcept[];
  conceptsCompleted: ExplorerConcept[];
  thinkingPromptsEngaged: number;
  everydayConnectionsRead: number;
  lumoInteractions: number;
  totalMinutes: number;
  totalSessions: number;
  lastVisitedConcept?: ExplorerConcept;
  lastSessionAt: number;
  updatedAt: number;
}
