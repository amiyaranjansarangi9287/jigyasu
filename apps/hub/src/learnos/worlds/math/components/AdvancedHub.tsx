import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HubNav, { type HubItem } from './shared/HubNav';
import AlgebraArena from './AlgebraArena';
import GeometryForge from './GeometryForge';
import GraphQuest from './GraphQuest';
import MentalMathBlitz from './MentalMathBlitz';
import NumberTheoryLab from './NumberTheoryLab';
import StatisticsLab from './StatisticsLab';
import MoneyMathMarket from './MoneyMathMarket';
import ProbabilityPlayground from './ProbabilityPlayground';
import TrigonometryTower from './TrigonometryTower';
import DecimalsDeepDive from './DecimalsDeepDive';
import VectorsArena from './VectorsArena';
import MatrixOps from './MatrixOps';
import LogarithmsLab from './LogarithmsLab';
import SequencesSeries from './SequencesSeries';
import ComplexNumbers from './ComplexNumbers';
import CalculusPreview from './CalculusPreview';
import SATACTPractice from './SATACTPractice';
import MathOlympiad from './MathOlympiad';

const MODES: HubItem[] = [
  // Core Math
  { id: 'algebra', emoji: '🧮', label: 'Algebra', color: 'from-blue-500 to-indigo-500', category: '🧮 Core Math' },
  { id: 'geometry', emoji: '📐', label: 'Geometry', color: 'from-green-500 to-emerald-500', category: '🧮 Core Math' },
  { id: 'graph', emoji: '📈', label: 'Graphs', color: 'from-cyan-500 to-blue-500', category: '🧮 Core Math' },
  { id: 'trig', emoji: '📊', label: 'Trig', color: 'from-violet-500 to-purple-500', category: '🧮 Core Math' },
  { id: 'decimals', emoji: '🔢', label: 'Decimals', color: 'from-sky-500 to-blue-500', category: '🧮 Core Math' },
  // Higher Math
  { id: 'vectors', emoji: '🏹', label: 'Vectors', color: 'from-rose-500 to-red-500', category: '🔬 Higher Math' },
  { id: 'matrices', emoji: '🧮', label: 'Matrices', color: 'from-fuchsia-500 to-pink-500', category: '🔬 Higher Math' },
  { id: 'logs', emoji: '📐', label: 'Logs', color: 'from-lime-500 to-emerald-500', category: '🔬 Higher Math' },
  { id: 'sequences', emoji: '∑', label: 'Series', color: 'from-yellow-500 to-orange-500', category: '🔬 Higher Math' },
  { id: 'complex', emoji: 'ℂ', label: 'Complex', color: 'from-emerald-500 to-green-500', category: '🔬 Higher Math' },
  { id: 'calculus', emoji: '∫', label: 'Calculus', color: 'from-red-500 to-rose-500', category: '🔬 Higher Math' },
  // Data & Applied
  { id: 'stats', emoji: '📉', label: 'Statistics', color: 'from-teal-500 to-cyan-500', category: '📊 Data & Applied' },
  { id: 'probability', emoji: '🎲', label: 'Probability', color: 'from-pink-500 to-rose-500', category: '📊 Data & Applied' },
  { id: 'money', emoji: '💰', label: 'Money', color: 'from-green-500 to-lime-500', category: '📊 Data & Applied' },
  { id: 'mental', emoji: '🧠', label: 'Mental', color: 'from-purple-500 to-pink-500', category: '📊 Data & Applied' },
  { id: 'theory', emoji: '🔬', label: 'Theory', color: 'from-amber-500 to-orange-500', category: '📊 Data & Applied' },
  // Test Prep
  { id: 'sat', emoji: '📋', label: 'SAT/ACT', color: 'from-blue-600 to-indigo-600', category: '🏆 Test Prep' },
  { id: 'olympiad', emoji: '🏆', label: 'Olympiad', color: 'from-yellow-500 to-amber-600', category: '🏆 Test Prep' },
];

const COMPONENTS: Record<string, React.FC> = {
  algebra: AlgebraArena, geometry: GeometryForge, graph: GraphQuest, trig: TrigonometryTower,
  decimals: DecimalsDeepDive, vectors: VectorsArena, matrices: MatrixOps, logs: LogarithmsLab,
  sequences: SequencesSeries, complex: ComplexNumbers, calculus: CalculusPreview,
  stats: StatisticsLab, probability: ProbabilityPlayground, money: MoneyMathMarket,
  mental: MentalMathBlitz, theory: NumberTheoryLab, sat: SATACTPractice, olympiad: MathOlympiad,
};

export default function AdvancedHub() {
  const [mode, setMode] = useState('algebra');
  const Comp = COMPONENTS[mode] || AlgebraArena;

  return (
    <div className="w-full">
      <HubNav items={MODES} active={mode} onSelect={setMode} layoutId="adv-mode" />

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Comp />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
