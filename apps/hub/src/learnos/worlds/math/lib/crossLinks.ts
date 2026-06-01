// Cross-module linking — suggests next modules based on the current one

export interface ModuleLink {
  id: string;
  emoji: string;
  name: string;
  reason: string;
  hub: 'explorers' | 'advanced' | 'skills' | 'game' | 'pattern';
}

const LINKS: Record<string, ModuleLink[]> = {
  'place-value': [
    { id: 'decimals', emoji: '🔢', name: 'Decimals Deep Dive', reason: 'Extend place value to the right of the decimal point', hub: 'advanced' },
    { id: 'coins', emoji: '🪙', name: 'Coin Counter', reason: 'Apply place value to money', hub: 'explorers' },
  ],
  'clock': [
    { id: 'measure', emoji: '📏', name: 'Measurement Lab', reason: 'Practice more unit conversions', hub: 'explorers' },
  ],
  'fractions': [
    { id: 'ratios', emoji: '⚖️', name: 'Ratios & Proportions', reason: 'Fractions are the foundation of ratios', hub: 'explorers' },
    { id: 'decimals', emoji: '🔢', name: 'Decimals Deep Dive', reason: 'Convert fractions to decimals', hub: 'advanced' },
  ],
  'times-tables': [
    { id: 'exponents', emoji: '⚡', name: 'Exponents & Powers', reason: 'Multiplication leads to repeated multiplication', hub: 'explorers' },
    { id: 'algebra', emoji: '🧮', name: 'Algebra Arena', reason: 'Use multiplication skills in equations', hub: 'advanced' },
  ],
  'number-bonds': [
    { id: 'integers', emoji: '🔢', name: 'Integers & Number Line', reason: 'Extend addition to negative numbers', hub: 'explorers' },
  ],
  'shapes': [
    { id: 'volume', emoji: '📦', name: '3D Volume Explorer', reason: 'Go from 2D shapes to 3D solids', hub: 'explorers' },
    { id: 'geometry', emoji: '📐', name: 'Geometry Forge', reason: 'Calculate areas and perimeters', hub: 'advanced' },
  ],
  'ratios': [
    { id: 'money', emoji: '💰', name: 'Money Math Market', reason: 'Apply proportional reasoning to discounts and interest', hub: 'advanced' },
  ],
  'integers': [
    { id: 'algebra', emoji: '🧮', name: 'Algebra Arena', reason: 'Solve equations with negative numbers', hub: 'advanced' },
  ],
  'exponents': [
    { id: 'logs', emoji: '📐', name: 'Logarithms Lab', reason: 'Logarithms are the inverse of exponents', hub: 'advanced' },
    { id: 'sequences', emoji: '∑', name: 'Sequences & Series', reason: 'Geometric sequences use exponent rules', hub: 'advanced' },
  ],
  'algebra': [
    { id: 'quadratic', emoji: '📈', name: 'Quadratic Solver', reason: 'Level up from linear to quadratic equations', hub: 'explorers' },
    { id: 'systems', emoji: '🔗', name: 'Systems of Equations', reason: 'Solve two equations simultaneously', hub: 'explorers' },
  ],
  'quadratic': [
    { id: 'calculus', emoji: '∫', name: 'Calculus Preview', reason: 'See how quadratics connect to derivatives and integrals', hub: 'advanced' },
    { id: 'complex', emoji: 'ℂ', name: 'Complex Numbers', reason: 'Some quadratics have complex roots', hub: 'advanced' },
  ],
  'graph': [
    { id: 'systems', emoji: '🔗', name: 'Systems of Equations', reason: 'Intersecting lines on a graph', hub: 'explorers' },
    { id: 'quadratic', emoji: '📈', name: 'Quadratic Solver', reason: 'Graph parabolas', hub: 'explorers' },
  ],
  'trig': [
    { id: 'vectors', emoji: '🏹', name: 'Vectors Arena', reason: 'Trig helps decompose vectors', hub: 'advanced' },
    { id: 'complex', emoji: 'ℂ', name: 'Complex Numbers', reason: 'Complex numbers use trig for polar form', hub: 'advanced' },
  ],
  'probability': [
    { id: 'stats', emoji: '📉', name: 'Statistics Lab', reason: 'Probability connects to data analysis', hub: 'advanced' },
    { id: 'chess', emoji: '♟️', name: 'Chess & Strategy', reason: 'Apply probability to game strategy', hub: 'explorers' },
  ],
  'stats': [
    { id: 'sports', emoji: '⚽', name: 'Sports Statistics', reason: 'Apply statistics to real sports data', hub: 'explorers' },
    { id: 'graphs', emoji: '📊', name: 'Graph Creator', reason: 'Visualize statistical data', hub: 'explorers' },
  ],
  'coding': [
    { id: 'logic', emoji: '🧩', name: 'Logic Puzzles', reason: 'Apply logical reasoning to Sudoku & KenKen', hub: 'explorers' },
    { id: 'matrices', emoji: '🧮', name: 'Matrix Operations', reason: 'Matrices are core to computer graphics', hub: 'advanced' },
  ],
  'word-problems': [
    { id: 'ratios', emoji: '⚖️', name: 'Ratios & Proportions', reason: 'Many word problems involve proportional reasoning', hub: 'explorers' },
    { id: 'money', emoji: '💰', name: 'Money Math Market', reason: 'Real-world word problems about money', hub: 'advanced' },
  ],
  'calculus': [
    { id: 'engineering', emoji: '🏗️', name: 'Engineering Math', reason: 'Calculus drives real-world engineering', hub: 'explorers' },
  ],
  'vectors': [
    { id: 'engineering', emoji: '🏗️', name: 'Engineering Math', reason: 'Vectors model forces in physics and engineering', hub: 'explorers' },
  ],
};

export function getLinksFor(moduleId: string): ModuleLink[] {
  return LINKS[moduleId] || [];
}

export function getAllModuleIds(): string[] {
  return Object.keys(LINKS);
}
