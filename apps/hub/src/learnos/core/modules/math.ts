// src/core/modules/math.ts
import type { ModuleDef } from '../ModuleRegistry';

export const mathModules: ModuleDef[] = [
  { id: 'math-adventure', worldId: 'math', title: 'Adventure Map', description: 'Explore math zones', emoji: '🗺️', color: 'from-green-500 to-emerald-600', bgColor: 'bg-green-50', path: '/math/map', estimatedMinutes: 30 },
  { id: 'math-visualizer', worldId: 'math', title: '3D Visualizer', description: 'See math in 3D', emoji: '📊', color: 'from-blue-500 to-cyan-600', bgColor: 'bg-blue-50', path: '/math/visualizer', estimatedMinutes: 20 },
  { id: 'number-crunch', worldId: 'math', title: 'Number Crunch', description: 'Race the clock game', emoji: '🎮', color: 'from-pink-500 to-rose-600', bgColor: 'bg-pink-50', path: '/math/game', estimatedMinutes: 15 },
  { id: 'pattern-hub', worldId: 'math', title: 'Pattern Hub', description: 'Find patterns', emoji: '🧩', color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50', path: '/math/pattern', estimatedMinutes: 20 },
  { id: 'skills-academy', worldId: 'math', title: 'Skills Academy', description: 'Build foundations', emoji: '🎓', color: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-50', path: '/math/skills', estimatedMinutes: 25 },
  { id: 'advanced-hub', worldId: 'math', title: 'Advanced Hub', description: 'Higher level math', emoji: '🔥', color: 'from-red-500 to-orange-600', bgColor: 'bg-red-50', path: '/math/advanced', estimatedMinutes: 30 },
  { id: 'math-daily', worldId: 'math', title: 'Daily Challenge', description: 'Daily math puzzle', emoji: '🎯', color: 'from-yellow-500 to-amber-600', bgColor: 'bg-yellow-50', path: '/math/daily', estimatedMinutes: 10 },
  { id: 'explorers-hub', worldId: 'math', title: 'Explorers Hub', description: 'Visual topics', emoji: '🧭', color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-50', path: '/math/explorers', estimatedMinutes: 25 },
  { id: 'worksheet-gen', worldId: 'math', title: 'Worksheet Generator', description: 'Print practice sheets', emoji: '📝', color: 'from-gray-500 to-slate-600', bgColor: 'bg-gray-50', path: '/math/worksheet', estimatedMinutes: 15 },
];
