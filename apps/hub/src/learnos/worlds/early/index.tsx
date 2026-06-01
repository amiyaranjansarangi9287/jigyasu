// src/worlds/early/index.tsx

import { Routes, Route } from 'react-router-dom';
import EarlyHome from './EarlyHome';
import StoryBuilder from './modules/StoryBuilder';
import NumberLineAdventures from './modules/NumberLineAdventures';
import AlphabetForest from './modules/AlphabetForest';
import MiniChef from './modules/MiniChef';
import PatternPatrol from './modules/PatternPatrol';
import WordScramble from './modules/WordScramble';
import PlantGrowthExplorer from './modules/PlantGrowthExplorer';
import WaterCycleJourney from './modules/WaterCycleJourney';
import HabitatHeroes from './modules/HabitatHeroes';
import ShadowDetective from './modules/ShadowDetective';
import MagnetExplorer from './modules/MagnetExplorer';
import CoinCounter from './modules/CoinCounter';

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
