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
import CompetitiveMathPrep from './CompetitiveMathPrep';
import MathOlympiad from './MathOlympiad';

const MODES: HubItem[] = [
  // Core Math
  { id: 'algebra', emoji: '🧮', label: 'Algebra', labelKey: 'auto.advancedhub.algebra', color: 'from-blue-500 to-indigo-500', category: '🧮 Core Math', categoryKey: 'auto.advancedhub.core_math' },
  { id: 'geometry', emoji: '📐', label: 'Geometry', labelKey: 'auto.advancedhub.geometry', color: 'from-green-500 to-emerald-500', category: '🧮 Core Math', categoryKey: 'auto.advancedhub.core_math' },
  { id: 'graph', emoji: '📈', label: 'Graphs', labelKey: 'auto.advancedhub.graphs', color: 'from-cyan-500 to-blue-500', category: '🧮 Core Math', categoryKey: 'auto.advancedhub.core_math' },
  { id: 'trig', emoji: '📊', label: 'Trig', labelKey: 'auto.advancedhub.trig', color: 'from-violet-500 to-purple-500', category: '🧮 Core Math', categoryKey: 'auto.advancedhub.core_math' },
  { id: 'decimals', emoji: '🔢', label: 'Decimals', labelKey: 'auto.advancedhub.decimals', color: 'from-sky-500 to-blue-500', category: '🧮 Core Math', categoryKey: 'auto.advancedhub.core_math' },
  // Higher Math
  { id: 'vectors', emoji: '🏹', label: 'Vectors', labelKey: 'auto.advancedhub.vectors', color: 'from-rose-500 to-red-500', category: '🔬 Higher Math', categoryKey: 'auto.advancedhub.higher_math' },
  { id: 'matrices', emoji: '🧮', label: 'Matrices', labelKey: 'auto.advancedhub.matrices', color: 'from-fuchsia-500 to-pink-500', category: '🔬 Higher Math', categoryKey: 'auto.advancedhub.higher_math' },
  { id: 'logs', emoji: '📐', label: 'Logs', labelKey: 'auto.advancedhub.logs', color: 'from-lime-500 to-emerald-500', category: '🔬 Higher Math', categoryKey: 'auto.advancedhub.higher_math' },
  { id: 'sequences', emoji: '∑', label: 'Series', labelKey: 'auto.advancedhub.series', color: 'from-yellow-500 to-orange-500', category: '🔬 Higher Math', categoryKey: 'auto.advancedhub.higher_math' },
  { id: 'complex', emoji: 'ℂ', label: 'Complex', labelKey: 'auto.advancedhub.complex', color: 'from-emerald-500 to-green-500', category: '🔬 Higher Math', categoryKey: 'auto.advancedhub.higher_math' },
  { id: 'calculus', emoji: '∫', label: 'Calculus', labelKey: 'auto.advancedhub.calculus', color: 'from-red-500 to-rose-500', category: '🔬 Higher Math', categoryKey: 'auto.advancedhub.higher_math' },
  // Data & Applied
  { id: 'stats', emoji: '📉', label: 'Statistics', labelKey: 'auto.advancedhub.statistics', color: 'from-teal-500 to-cyan-500', category: '📊 Data & Applied', categoryKey: 'auto.advancedhub.data_applied' },
  { id: 'probability', emoji: '🎲', label: 'Probability', labelKey: 'auto.advancedhub.probability', color: 'from-pink-500 to-rose-500', category: '📊 Data & Applied', categoryKey: 'auto.advancedhub.data_applied' },
  { id: 'money', emoji: '💰', label: 'Money', labelKey: 'auto.advancedhub.money', color: 'from-green-500 to-lime-500', category: '📊 Data & Applied', categoryKey: 'auto.advancedhub.data_applied' },
  { id: 'mental', emoji: '🧠', label: 'Mental', labelKey: 'auto.advancedhub.mental', color: 'from-purple-500 to-pink-500', category: '📊 Data & Applied', categoryKey: 'auto.advancedhub.data_applied' },
  { id: 'theory', emoji: '🔬', label: 'Theory', labelKey: 'auto.advancedhub.theory', color: 'from-amber-500 to-orange-500', category: '📊 Data & Applied', categoryKey: 'auto.advancedhub.data_applied' },
  // Test Prep
  { id: 'competitive', emoji: '📋', label: 'Competitive Math', labelKey: 'auto.advancedhub.competitive_math', color: 'from-blue-600 to-indigo-600', category: '🏆 Test Prep', categoryKey: 'auto.advancedhub.test_prep' },
  { id: 'olympiad', emoji: '🏆', label: 'Olympiad', labelKey: 'auto.advancedhub.olympiad', color: 'from-yellow-500 to-amber-600', category: '🏆 Test Prep', categoryKey: 'auto.advancedhub.test_prep' },
];

const COMPONENTS: Record<string, React.FC> = {
  algebra: AlgebraArena, geometry: GeometryForge, graph: GraphQuest, trig: TrigonometryTower,
  decimals: DecimalsDeepDive, vectors: VectorsArena, matrices: MatrixOps, logs: LogarithmsLab,
  sequences: SequencesSeries, complex: ComplexNumbers, calculus: CalculusPreview,
  stats: StatisticsLab, probability: ProbabilityPlayground, money: MoneyMathMarket,
  mental: MentalMathBlitz, theory: NumberTheoryLab, competitive: CompetitiveMathPrep, olympiad: MathOlympiad,
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
