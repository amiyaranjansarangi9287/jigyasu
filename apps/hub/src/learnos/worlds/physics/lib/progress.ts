// src/worlds/physics/lib/progress.ts

export interface ModuleVisit {
  visited: boolean;
  completed: boolean;
  score?: number;
  lastVisitedAt: number;
  timeSpentSeconds: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  modulesVisited: Record<string, ModuleVisit>;
  badges: string[];
  totalSimulations: number;
  totalExperiments: number;
}

export const BADGE_INFO: Record<string, { name: string; emoji: string; description: string }> = {
  first_step: { name: 'First Step', emoji: '👟', description: 'Visit your first module' },
  mechanic: { name: 'Mechanic', emoji: '⚙️', description: 'Complete 3 mechanics modules' },
  wave_rider: { name: 'Wave Rider', emoji: '🌊', description: 'Complete 3 wave modules' },
  spark: { name: 'Spark', emoji: '⚡', description: 'Complete 3 electricity modules' },
  heat_seeker: { name: 'Heat Seeker', emoji: '🔥', description: 'Complete 3 thermodynamics modules' },
  light_bender: { name: 'Light Bender', emoji: '🔦', description: 'Complete 3 optics modules' },
  quantum_leap: { name: 'Quantum Leap', emoji: '⚛️', description: 'Complete 3 modern physics modules' },
  fluid_master: { name: 'Fluid Master', emoji: '💧', description: 'Complete 3 fluid modules' },
  space_explorer: { name: 'Space Explorer', emoji: '🚀', description: 'Complete 3 space modules' },
  perfectionist: { name: 'Perfectionist', emoji: '💯', description: 'Score 100% on any module' },
  speed_demon: { name: 'Speed Demon', emoji: '🏎️', description: 'Complete 5 modules in one day' },
  explorer: { name: 'Explorer', emoji: '🧭', description: 'Visit all 8 categories' },
  physicist: { name: 'Physicist', emoji: '🎓', description: 'Reach level 10' },
  einstein: { name: 'Einstein', emoji: '🧠', description: 'Reach level 20' },
  newton: { name: 'Newton', emoji: '🍎', description: 'Complete 20 modules' },
  maxwell: { name: 'Maxwell', emoji: '🌈', description: 'Complete all electricity modules' },
  bohr: { name: 'Bohr', emoji: '🔬', description: 'Complete all modern physics modules' },
  kepler: { name: 'Kepler', emoji: '🪐', description: 'Complete all space modules' },
};

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Curious Mind', 2: 'Curious Mind', 3: 'Curious Mind',
  4: 'Observer', 5: 'Observer',
  6: 'Experimenter', 7: 'Experimenter',
  8: 'Analyst', 9: 'Analyst',
  10: 'Physicist', 11: 'Physicist', 12: 'Physicist',
  13: 'Researcher', 14: 'Researcher',
  15: 'Professor', 16: 'Professor',
  17: 'Nobel Nominee', 18: 'Nobel Nominee',
  19: 'Einstein', 20: 'Einstein',
};

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, 20)] || 'Legend';
}

const STORAGE_KEY = 'physicsverse-progress';

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { xp: 0, level: 1, streak: 0, lastActiveDate: '', modulesVisited: {}, badges: [], totalSimulations: 0, totalExperiments: 0 };
}

export function saveProgress(progress: UserProgress) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch {}
}

export function visitModule(progress: UserProgress, moduleId: string): UserProgress {
  const existing = progress.modulesVisited[moduleId] || { visited: false, completed: false, lastVisitedAt: 0, timeSpentSeconds: 0 };
  const xpGain = existing.visited ? 5 : 15;
  const today = new Date().toISOString().split('T')[0];
  const updated: UserProgress = {
    ...progress,
    xp: progress.xp + xpGain,
    level: Math.floor((progress.xp + xpGain) / 100) + 1,
    modulesVisited: { ...progress.modulesVisited, [moduleId]: { ...existing, visited: true, lastVisitedAt: Date.now() } },
    totalSimulations: progress.totalSimulations + 1,
  };
  if (progress.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    updated.streak = progress.lastActiveDate === yesterday ? progress.streak + 1 : 1;
    updated.lastActiveDate = today;
  }
  return updated;
}

export function completeModule(progress: UserProgress, moduleId: string, score?: number): UserProgress {
  const existing = progress.modulesVisited[moduleId] || { visited: false, completed: false, lastVisitedAt: 0, timeSpentSeconds: 0 };
  const xpGain = 25 + (score || 0);
  const updated: UserProgress = {
    ...progress,
    xp: progress.xp + xpGain,
    level: Math.floor((progress.xp + xpGain) / 100) + 1,
    modulesVisited: { ...progress.modulesVisited, [moduleId]: { ...existing, visited: true, completed: true, score, lastVisitedAt: Date.now() } },
    totalExperiments: progress.totalExperiments + 1,
  };
  if (score === 100 && !updated.badges.includes('perfectionist')) updated.badges.push('perfectionist');
  const completedCount = Object.values(updated.modulesVisited).filter(m => m.completed).length;
  if (completedCount >= 20 && !updated.badges.includes('newton')) updated.badges.push('newton');
  if (updated.level >= 10 && !updated.badges.includes('physicist')) updated.badges.push('physicist');
  if (updated.level >= 20 && !updated.badges.includes('einstein')) updated.badges.push('einstein');
  return updated;
}

export const ALL_MODULE_IDS = [
  'projectile-motion', 'newtons-laws', 'pendulum-lab', 'collision-sim', 'energy-skate', 'inclined-plane',
  'wave-interference', 'sound-waves', 'doppler-effect', 'standing-waves', 'resonance-lab',
  'circuit-builder', 'magnetic-fields', 'ohms-law', 'em-induction', 'motor-generator',
  'heat-transfer', 'gas-laws', 'heat-engine', 'phase-change',
  'lens-sim', 'mirror-lab', 'prism-dispersion', 'human-eye', 'interference-patterns',
  'atomic-structure', 'photoelectric', 'quantum-tunneling', 'nuclear-decay',
  'buoyancy-lab', 'bernoulli', 'viscosity', 'surface-tension',
  'orbital-mechanics', 'black-hole', 'planetary-motion', 'gravity-wells',
];

export const MODULE_CONNECTIONS: Record<string, string[]> = {
  'projectile-motion': ['newtons-laws', 'energy-skate', 'inclined-plane'],
  'newtons-laws': ['projectile-motion', 'collision-sim', 'pendulum-lab'],
  'pendulum-lab': ['newtons-laws', 'energy-skate', 'resonance-lab'],
  'collision-sim': ['newtons-laws', 'projectile-motion', 'orbital-mechanics'],
  'energy-skate': ['projectile-motion', 'pendulum-lab', 'heat-transfer'],
  'inclined-plane': ['projectile-motion', 'newtons-laws', 'buoyancy-lab'],
  'wave-interference': ['sound-waves', 'standing-waves', 'interference-patterns'],
  'sound-waves': ['wave-interference', 'doppler-effect', 'resonance-lab'],
  'doppler-effect': ['sound-waves', 'wave-interference', 'orbital-mechanics'],
  'standing-waves': ['wave-interference', 'resonance-lab', 'sound-waves'],
  'resonance-lab': ['standing-waves', 'pendulum-lab', 'sound-waves'],
  'circuit-builder': ['ohms-law', 'magnetic-fields', 'em-induction'],
  'magnetic-fields': ['circuit-builder', 'em-induction', 'motor-generator'],
  'ohms-law': ['circuit-builder', 'heat-transfer', 'em-induction'],
  'em-induction': ['magnetic-fields', 'circuit-builder', 'motor-generator'],
  'motor-generator': ['magnetic-fields', 'em-induction', 'circuit-builder'],
  'heat-transfer': ['gas-laws', 'phase-change', 'heat-engine'],
  'gas-laws': ['heat-transfer', 'phase-change', 'buoyancy-lab'],
  'heat-engine': ['heat-transfer', 'gas-laws', 'phase-change'],
  'phase-change': ['heat-transfer', 'gas-laws', 'states-of-matter'],
  'lens-sim': ['mirror-lab', 'prism-dispersion', 'human-eye'],
  'mirror-lab': ['lens-sim', 'prism-dispersion', 'interference-patterns'],
  'prism-dispersion': ['lens-sim', 'mirror-lab', 'wave-interference'],
  'human-eye': ['lens-sim', 'prism-dispersion', 'mirror-lab'],
  'interference-patterns': ['wave-interference', 'lens-sim', 'standing-waves'],
  'atomic-structure': ['photoelectric', 'quantum-tunneling', 'nuclear-decay'],
  'photoelectric': ['atomic-structure', 'quantum-tunneling', 'prism-dispersion'],
  'quantum-tunneling': ['atomic-structure', 'photoelectric', 'nuclear-decay'],
  'nuclear-decay': ['atomic-structure', 'quantum-tunneling', 'black-hole'],
  'buoyancy-lab': ['gas-laws', 'inclined-plane', 'bernoulli'],
  'bernoulli': ['buoyancy-lab', 'viscosity', 'gas-laws'],
  'viscosity': ['bernoulli', 'surface-tension', 'heat-transfer'],
  'surface-tension': ['viscosity', 'buoyancy-lab', 'phase-change'],
  'orbital-mechanics': ['gravity-wells', 'planetary-motion', 'black-hole'],
  'black-hole': ['orbital-mechanics', 'nuclear-decay', 'gravity-wells'],
  'planetary-motion': ['orbital-mechanics', 'gravity-wells', 'collision-sim'],
  'gravity-wells': ['orbital-mechanics', 'black-hole', 'newtons-laws'],
};

export const MODULE_NAMES: Record<string, string> = {
  'projectile-motion': 'Projectile Motion', 'newtons-laws': "Newton's Laws", 'pendulum-lab': 'Pendulum Lab',
  'collision-sim': 'Collision Simulator', 'energy-skate': 'Energy Skate Park', 'inclined-plane': 'Inclined Plane',
  'wave-interference': 'Wave Interference', 'sound-waves': 'Sound Waves', 'doppler-effect': 'Doppler Effect',
  'standing-waves': 'Standing Waves', 'resonance-lab': 'Resonance Lab',
  'circuit-builder': 'Circuit Builder', 'magnetic-fields': 'Magnetic Fields', 'ohms-law': "Ohm's Law",
  'em-induction': 'EM Induction', 'motor-generator': 'Motor & Generator',
  'heat-transfer': 'Heat Transfer', 'gas-laws': 'Gas Laws', 'heat-engine': 'Heat Engine',
  'phase-change': 'Phase Change',
  'lens-sim': 'Lens Simulator', 'mirror-lab': 'Mirror Lab', 'prism-dispersion': 'Prism & Dispersion',
  'human-eye': 'Human Eye', 'interference-patterns': 'Interference Patterns',
  'atomic-structure': 'Atomic Structure', 'photoelectric': 'Photoelectric Effect',
  'quantum-tunneling': 'Quantum Tunneling', 'nuclear-decay': 'Nuclear Decay',
  'buoyancy-lab': 'Buoyancy Lab', 'bernoulli': "Bernoulli's Principle", 'viscosity': 'Viscosity',
  'surface-tension': 'Surface Tension',
  'orbital-mechanics': 'Orbital Mechanics', 'black-hole': 'Black Hole', 'planetary-motion': 'Planetary Motion',
  'gravity-wells': 'Gravity Wells',
};
