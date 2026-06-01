// src/types/events.ts
// This schema is IMMUTABLE.
// Never change field names once established.
// Backend depends on this exact shape.

import type { AgeGroup, Language, DeviceType, ConnectionType } from './shared';

export type LearningEventType =
  // Session events
  | 'session_started'
  | 'session_ended'
  | 'session_paused'
  | 'session_resumed'
  // Navigation events
  | 'world_entered'
  | 'world_exited'
  | 'module_opened'
  | 'module_closed'
  | 'concept_started'
  | 'concept_completed'
  | 'concept_mastered'
  | 'concept_phase_changed'
  // Interaction events
  | 'canvas_interaction'
  | 'correct_answer'
  | 'wrong_answer'
  | 'hint_requested'
  | 'hint_dismissed'
  // Lumo events
  | 'lumo_appeared'
  | 'lumo_dismissed'
  | 'lumo_acted_on'
  | 'lumo_renamed'
  | 'lumo_toggled'
  // Video events
  | 'video_started'
  | 'video_completed'
  | 'video_skipped'
  | 'video_replayed'
  // Wonder events
  | 'wonder_moment'              // Rabbit hole clicked
  | 'wonder_score_updated'
  // ToyBox events
  | 'toybox_started'
  | 'toybox_step_completed'
  | 'toybox_completed'
  // Teaching events
  | 'teach_me_started'
  | 'teach_me_completed'
  | 'time_capsule_created'
  | 'time_capsule_opened'
  // Language events
  | 'language_changed'
  // System events
  | 'offline_session_started'
  | 'offline_session_ended'
  | 'sync_completed'
  | 'error_occurred'
  // Lab-specific canvas interaction events
  | 'element_change'
  | 'speed_change'
  | 'chain_change'
  | 'numerator_change'
  | 'denominator_change'
  | 'habitat_change'
  | 'phase_change'
  | 'rows_change'
  | 'cols_change'
  | 'target_change'
  | 'precision_change'
  | 'stage_change'
  | 'water_change'
  | 'sun_change'
  | 'side_a_change'
  | 'side_b_change'
  | 'sense_change'
  | 'shape_change'
  | 'machine_change'
  | 'effort_change'
  | 'warmup-session';

export interface LearningEvent {
  id: string;                    // UUID — generated client side
  sessionId: string;
  ageGroup: AgeGroup;
  eventType: LearningEventType;
  moduleId: string;              // Which module/concept
  payload: Record<string, unknown>; // Event-specific data
  timestamp: number;             // Date.now()
  language: Language;
  deviceType: DeviceType;
  connectionType: ConnectionType;
}
