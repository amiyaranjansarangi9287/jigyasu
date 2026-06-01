// Adaptive difficulty engine — shared across all modules
// Tracks performance per topic and adjusts difficulty automatically

export type DiffLevel = 1 | 2 | 3 | 4 | 5;

interface TopicState {
  level: DiffLevel;
  streak: number;
  correct: number;
  total: number;
  lastUpdated: number;
}

const STORAGE_KEY = 'mathkingdom_difficulty';

function loadState(): Record<string, TopicState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveState(state: Record<string, TopicState>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export function getTopicLevel(topic: string): DiffLevel {
  const state = loadState();
  return state[topic]?.level || 1;
}

export function getTopicStats(topic: string): TopicState {
  const state = loadState();
  return state[topic] || { level: 1, streak: 0, correct: 0, total: 0, lastUpdated: Date.now() };
}

export function recordAnswer(topic: string, correct: boolean): { level: DiffLevel; levelChanged: boolean; direction: 'up' | 'down' | 'same' } {
  const state = loadState();
  const prev = state[topic] || { level: 1 as DiffLevel, streak: 0, correct: 0, total: 0, lastUpdated: Date.now() };
  const oldLevel = prev.level;

  prev.total += 1;
  if (correct) {
    prev.correct += 1;
    prev.streak += 1;
    // Level up after 4 correct in a row
    if (prev.streak >= 4 && prev.level < 5) {
      prev.level = (prev.level + 1) as DiffLevel;
      prev.streak = 0;
    }
  } else {
    prev.streak = 0;
    // Level down after accuracy drops below 40% in last 10
    const recentAccuracy = prev.total > 0 ? prev.correct / prev.total : 1;
    if (recentAccuracy < 0.4 && prev.level > 1) {
      prev.level = (prev.level - 1) as DiffLevel;
    }
  }

  prev.lastUpdated = Date.now();
  state[topic] = prev;
  saveState(state);

  const direction = prev.level > oldLevel ? 'up' : prev.level < oldLevel ? 'down' : 'same';
  return { level: prev.level, levelChanged: direction !== 'same', direction };
}

export function getAllStats(): Record<string, TopicState> {
  return loadState();
}

export function getDifficultyLabel(level: DiffLevel): string {
  return ['', 'Beginner', 'Easy', 'Medium', 'Hard', 'Expert'][level];
}

export function getDifficultyColor(level: DiffLevel): string {
  return ['', 'text-green-400', 'text-blue-400', 'text-yellow-400', 'text-orange-400', 'text-red-400'][level];
}

export function getDifficultyEmoji(level: DiffLevel): string {
  return ['', '🌱', '📗', '📙', '📕', '🔥'][level];
}

export function getMasteryLevel(topic: string): number {
  const stats = getTopicStats(topic);
  if (stats.total < 5) return 0; // Not enough data
  const recentAccuracy = stats.correct / stats.total;
  
  if (stats.level >= 5 && recentAccuracy >= 0.8) return 3; // Mastered
  if (stats.level >= 4 && recentAccuracy >= 0.6) return 2; // Proficient
  if (stats.level >= 2 && recentAccuracy >= 0.5) return 1; // Familiar
  return 0; // Novice
}
