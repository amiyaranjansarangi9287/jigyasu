import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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

const MODES: HubItem[] = [
  // Elementary
  { id: 'place', emoji: '🧱', label: 'Place Value', labelKey: 'auto.explorershub.place_value', color: 'from-purple-500 to-indigo-500', category: '🌱 Elementary', categoryKey: 'auto.explorershub.elementary' },
  { id: 'clock', emoji: '⏰', label: 'Clock', labelKey: 'auto.explorershub.clock', color: 'from-blue-500 to-cyan-500', category: '🌱 Elementary', categoryKey: 'auto.explorershub.elementary' },
  { id: 'measure', emoji: '📏', label: 'Measurement', labelKey: 'auto.explorershub.measurement', color: 'from-teal-500 to-cyan-500', category: '🌱 Elementary', categoryKey: 'auto.explorershub.elementary' },
  { id: 'coins', emoji: '🪙', label: 'Coins', labelKey: 'auto.explorershub.coins', color: 'from-yellow-500 to-amber-500', category: '🌱 Elementary', categoryKey: 'auto.explorershub.elementary' },
  { id: 'shapes', emoji: '🔷', label: 'Shapes', labelKey: 'auto.explorershub.shapes', color: 'from-sky-500 to-blue-500', category: '🌱 Elementary', categoryKey: 'auto.explorershub.elementary' },
  { id: 'words', emoji: '📖', label: 'Word Problems', labelKey: 'auto.explorershub.word_problems', color: 'from-amber-500 to-yellow-500', category: '🌱 Elementary', categoryKey: 'auto.explorershub.elementary' },
  // Middle School
  { id: 'ratios', emoji: '⚖️', label: 'Ratios', labelKey: 'auto.explorershub.ratios', color: 'from-lime-500 to-green-500', category: '📚 Middle School', categoryKey: 'auto.explorershub.middle_school' },
  { id: 'integers', emoji: '🔢', label: 'Integers', labelKey: 'auto.explorershub.integers', color: 'from-rose-500 to-red-500', category: '📚 Middle School', categoryKey: 'auto.explorershub.middle_school' },
  { id: 'graphs', emoji: '📊', label: 'Graph Creator', labelKey: 'auto.explorershub.graph_creator', color: 'from-indigo-500 to-blue-500', category: '📚 Middle School', categoryKey: 'auto.explorershub.middle_school' },
  { id: 'exponents', emoji: '⚡', label: 'Exponents', labelKey: 'auto.explorershub.exponents', color: 'from-orange-500 to-red-500', category: '📚 Middle School', categoryKey: 'auto.explorershub.middle_school' },
  { id: 'volume', emoji: '📦', label: '3D Volume', labelKey: 'auto.explorershub.3d_volume', color: 'from-green-500 to-emerald-500', category: '📚 Middle School', categoryKey: 'auto.explorershub.middle_school' },
  // High School
  { id: 'quadratic', emoji: '📈', label: 'Quadratics', labelKey: 'auto.explorershub.quadratics', color: 'from-red-500 to-orange-500', category: '🔥 High School', categoryKey: 'auto.explorershub.high_school' },
  { id: 'systems', emoji: '🔗', label: 'Systems', labelKey: 'auto.explorershub.systems', color: 'from-fuchsia-500 to-pink-500', category: '🔥 High School', categoryKey: 'auto.explorershub.high_school' },
  // Applied
  { id: 'coding', emoji: '💻', label: 'Coding', labelKey: 'auto.explorershub.coding', color: 'from-cyan-500 to-teal-500', category: '🎯 Applied', categoryKey: 'auto.explorershub.applied' },
  { id: 'art', emoji: '🎨', label: 'Math Art', labelKey: 'auto.explorershub.math_art', color: 'from-pink-500 to-purple-500', category: '🎯 Applied', categoryKey: 'auto.explorershub.applied' },
  { id: 'music', emoji: '🎵', label: 'Music', labelKey: 'auto.explorershub.music', color: 'from-violet-500 to-indigo-500', category: '🎯 Applied', categoryKey: 'auto.explorershub.applied' },
  { id: 'chess', emoji: '♟️', label: 'Chess', labelKey: 'auto.explorershub.chess', color: 'from-amber-600 to-yellow-500', category: '🎯 Applied', categoryKey: 'auto.explorershub.applied' },
  { id: 'logic', emoji: '🧩', label: 'Logic', labelKey: 'auto.explorershub.logic', color: 'from-blue-500 to-indigo-600', category: '🎯 Applied', categoryKey: 'auto.explorershub.applied' },
  { id: 'sports', emoji: '⚽', label: 'Sports', labelKey: 'auto.explorershub.sports', color: 'from-green-500 to-emerald-600', category: '🎯 Applied', categoryKey: 'auto.explorershub.applied' },
  { id: 'engineering', emoji: '🏗️', label: 'Engineering', labelKey: 'auto.explorershub.engineering', color: 'from-orange-600 to-red-500', category: '🎯 Applied', categoryKey: 'auto.explorershub.applied' },
];

const COMPONENTS: Record<string, React.FC> = {
  place: PlaceValueExplorer, clock: ClockMaster, measure: MeasurementLab, coins: CoinCounter,
  shapes: ShapeSafari, words: WordProblemStories, ratios: RatiosProportions, integers: IntegersNumberLine,
  graphs: GraphCreator, exponents: ExponentsPowers, volume: VolumeExplorer3D, quadratic: QuadraticSolver,
  systems: SystemsOfEquations, coding: CodingLogic, art: MathArtStudio, music: MathMusic,
  chess: ChessStrategy, logic: LogicPuzzles, sports: SportsStats, engineering: EngineeringMath,
};

export default function ExplorersHub() {
  const { t } = useTranslation();
  const [mode, setMode] = useState('place');
  const Comp = COMPONENTS[mode] || PlaceValueExplorer;

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">{t('math_modules.ExplorersHub.title', '🧭 Explorers Guild')}</h2>
        <p className="text-purple-300 text-lg">{t('math_modules.ExplorersHub.subtitle', '20 visual adventures — foundations through applied math.')}</p>
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
