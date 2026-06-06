// src/worlds/early/index.tsx

import { Routes, Route } from 'react-router-dom';
import EarlyHome from './EarlyHome';
import StoryBuilderModule from './modules/StoryBuilder';
import NumberLineAdventuresModule from './modules/NumberLineAdventures';
import AlphabetForestModule from './modules/AlphabetForest';
import MiniChefModule from './modules/MiniChef';
import PatternPatrolModule from './modules/PatternPatrol';
import WordScrambleModule from './modules/WordScramble';
import PlantGrowthExplorerModule from './modules/PlantGrowthExplorer';
import WaterCycleJourneyModule from './modules/WaterCycleJourney';
import HabitatHeroesModule from './modules/HabitatHeroes';
import ShadowDetectiveModule from './modules/ShadowDetective';
import MagnetExplorerModule from './modules/MagnetExplorer';
import CoinCounterModule from './modules/CoinCounter';
import withWonderFirst from '../../core/modules/withWonderFirst';

const StoryBuilder = withWonderFirst(StoryBuilderModule, 'early', 'story-builder');
const NumberLineAdventures = withWonderFirst(NumberLineAdventuresModule, 'early', 'number-line');
const AlphabetForest = withWonderFirst(AlphabetForestModule, 'early', 'alphabet-forest');
const MiniChef = withWonderFirst(MiniChefModule, 'early', 'mini-chef');
const PatternPatrol = withWonderFirst(PatternPatrolModule, 'early', 'pattern-patrol');
const WordScramble = withWonderFirst(WordScrambleModule, 'early', 'word-scramble');
const PlantGrowthExplorer = withWonderFirst(PlantGrowthExplorerModule, 'early', 'plant-growth');
const WaterCycleJourney = withWonderFirst(WaterCycleJourneyModule, 'early', 'water-cycle');
const HabitatHeroes = withWonderFirst(HabitatHeroesModule, 'early', 'habitat-heroes');
const ShadowDetective = withWonderFirst(ShadowDetectiveModule, 'early', 'shadow-detective');
const MagnetExplorer = withWonderFirst(MagnetExplorerModule, 'early', 'magnet-explorer');
const CoinCounter = withWonderFirst(CoinCounterModule, 'early', 'coin-counter');

export default function EarlyWorld() {
  return (
    <Routes>
      <Route index element={<EarlyHome />} />
      <Route path="story-builder" element={<StoryBuilder />} />
      <Route path="number-line" element={<NumberLineAdventures />} />
      <Route path="alphabet-forest" element={<AlphabetForest />} />
      <Route path="mini-chef" element={<MiniChef />} />
      <Route path="pattern-patrol" element={<PatternPatrol />} />
      <Route path="word-scramble" element={<WordScramble />} />
      <Route path="plant-growth" element={<PlantGrowthExplorer />} />
      <Route path="water-cycle" element={<WaterCycleJourney />} />
      <Route path="habitat-heroes" element={<HabitatHeroes />} />
      <Route path="shadow-detective" element={<ShadowDetective />} />
      <Route path="magnet-explorer" element={<MagnetExplorer />} />
      <Route path="coin-counter" element={<CoinCounter />} />
    </Routes>
  );
}
