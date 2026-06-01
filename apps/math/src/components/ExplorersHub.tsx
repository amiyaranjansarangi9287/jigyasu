import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HubNav, { type HubItem } from './shared/HubNav';
import PlaceValueExplorer from './PlaceValueExplorer';
import ClockMaster from './ClockMaster';
import VolumeExplorer3D from './VolumeExplorer3D';
import QuadraticSolver from './QuadraticSolver';
import MathArtStudio from './MathArtStudio';
import MeasurementLab from './MeasurementLab';
import CoinCounter from './CoinCounter';
import ShapeSafari from './ShapeSafari';
import RatiosProportions from './RatiosProportions';
import IntegersNumberLine from './IntegersNumberLine';
import WordProblemStories from './WordProblemStories';
import GraphCreator from './GraphCreator';
import ExponentsPowers from './ExponentsPowers';
import SystemsOfEquations from './SystemsOfEquations';
import CodingLogic from './CodingLogic';
import MathMusic from './MathMusic';
import ChessStrategy from './ChessStrategy';
import LogicPuzzles from './LogicPuzzles';
import SportsStats from './SportsStats';
import EngineeringMath from './EngineeringMath';
import GeometryArchitect from './GeometryArchitect';
import PatternDecipher from './PatternDecipher';
import ProbabilityCarnival from './ProbabilityCarnival';

const MODES: HubItem[] = [
  // Elementary
  { id: 'place', emoji: '🧱', label: 'Place Value', color: 'from-purple-500 to-indigo-500', category: '🌱 Elementary' },
  { id: 'clock', emoji: '⏰', label: 'Clock', color: 'from-blue-500 to-cyan-500', category: '🌱 Elementary' },
  { id: 'measure', emoji: '📏', label: 'Measurement', color: 'from-teal-500 to-cyan-500', category: '🌱 Elementary' },
  { id: 'coins', emoji: '🪙', label: 'Coins', color: 'from-yellow-500 to-amber-500', category: '🌱 Elementary' },
  { id: 'shapes', emoji: '🔷', label: 'Shapes', color: 'from-sky-500 to-blue-500', category: '🌱 Elementary' },
  { id: 'words', emoji: '📖', label: 'Word Problems', color: 'from-amber-500 to-yellow-500', category: '🌱 Elementary' },
  // Middle School
  { id: 'ratios', emoji: '⚖️', label: 'Ratios', color: 'from-lime-500 to-green-500', category: '📚 Middle School' },
  { id: 'integers', emoji: '🔢', label: 'Integers', color: 'from-rose-500 to-red-500', category: '📚 Middle School' },
  { id: 'graphs', emoji: '📊', label: 'Graph Creator', color: 'from-indigo-500 to-blue-500', category: '📚 Middle School' },
  { id: 'exponents', emoji: '⚡', label: 'Exponents', color: 'from-orange-500 to-red-500', category: '📚 Middle School' },
  { id: 'volume', emoji: '📦', label: '3D Volume', color: 'from-green-500 to-emerald-500', category: '📚 Middle School' },
  { id: 'architect', emoji: '🏛️', label: 'Geo Architect', color: 'from-blue-500 to-violet-500', category: '📚 Middle School' },
  { id: 'patterns', emoji: '🔍', label: 'Pattern Decipher', color: 'from-amber-500 to-yellow-500', category: '📚 Middle School' },
  { id: 'carnival', emoji: '🎪', label: 'Prob Carnival', color: 'from-pink-500 to-rose-500', category: '📚 Middle School' },
  // High School
  { id: 'quadratic', emoji: '📈', label: 'Quadratics', color: 'from-red-500 to-orange-500', category: '🔥 High School' },
  { id: 'systems', emoji: '🔗', label: 'Systems', color: 'from-fuchsia-500 to-pink-500', category: '🔥 High School' },
  // Applied
  { id: 'coding', emoji: '💻', label: 'Coding', color: 'from-cyan-500 to-teal-500', category: '🎯 Applied' },
  { id: 'art', emoji: '🎨', label: 'Math Art', color: 'from-pink-500 to-purple-500', category: '🎯 Applied' },
  { id: 'music', emoji: '🎵', label: 'Music', color: 'from-violet-500 to-indigo-500', category: '🎯 Applied' },
  { id: 'chess', emoji: '♟️', label: 'Chess', color: 'from-amber-600 to-yellow-500', category: '🎯 Applied' },
  { id: 'logic', emoji: '🧩', label: 'Logic', color: 'from-blue-500 to-indigo-600', category: '🎯 Applied' },
  { id: 'sports', emoji: '⚽', label: 'Sports', color: 'from-green-500 to-emerald-600', category: '🎯 Applied' },
  { id: 'engineering', emoji: '🏗️', label: 'Engineering', color: 'from-orange-600 to-red-500', category: '🎯 Applied' },
];

const COMPONENTS: Record<string, React.FC> = {
  place: PlaceValueExplorer, clock: ClockMaster, measure: MeasurementLab, coins: CoinCounter,
  shapes: ShapeSafari, words: WordProblemStories, ratios: RatiosProportions, integers: IntegersNumberLine,
  graphs: GraphCreator, exponents: ExponentsPowers, volume: VolumeExplorer3D,
  architect: GeometryArchitect, patterns: PatternDecipher, carnival: ProbabilityCarnival,
  quadratic: QuadraticSolver,
  systems: SystemsOfEquations, coding: CodingLogic, art: MathArtStudio, music: MathMusic,
  chess: ChessStrategy, logic: LogicPuzzles, sports: SportsStats, engineering: EngineeringMath,
};

export default function ExplorersHub() {
  const [mode, setMode] = useState('place');
  const Comp = COMPONENTS[mode] || PlaceValueExplorer;

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🧭 Explorers Guild</h2>
        <p className="text-purple-300 text-lg">23 visual adventures — foundations through applied math.</p>
      </div>

      <HubNav items={MODES} active={mode} onSelect={setMode} layoutId="explorer-mode" />

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.3 }}
        >
          <Comp />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
