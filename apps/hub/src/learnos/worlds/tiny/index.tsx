// src/worlds/tiny/index.tsx
// Tiny World entry point — routes to home and all 8 modules.

import { Routes, Route } from 'react-router-dom';
import TinyHome from './TinyHome';
import TapWorldModule from './modules/TapWorld';
import ColorMixerModule from './modules/ColorMixer';
import ShapeSorterModule from './modules/ShapeSorter';
import AnimalOrchestraModule from './modules/AnimalOrchestra';
import BubbleWorldModule from './modules/BubbleWorld';
import WeatherMakerModule from './modules/WeatherMaker';
import FarmFriendsModule from './modules/FarmFriends';
import DayAndNightModule from './modules/DayAndNight';
import withWonderFirst from '../../core/modules/withWonderFirst';
import { useTranslation } from 'react-i18next';

const TapWorld = withWonderFirst(TapWorldModule, 'tiny', 'tap-world');
const ColorMixer = withWonderFirst(ColorMixerModule, 'tiny', 'color-mixer');
const ShapeSorter = withWonderFirst(ShapeSorterModule, 'tiny', 'shape-sorter');
const AnimalOrchestra = withWonderFirst(AnimalOrchestraModule, 'tiny', 'animal-orchestra');
const BubbleWorld = withWonderFirst(BubbleWorldModule, 'tiny', 'bubble-world');
const WeatherMaker = withWonderFirst(WeatherMakerModule, 'tiny', 'weather-maker');
const FarmFriends = withWonderFirst(FarmFriendsModule, 'tiny', 'farm-friends');
const DayAndNight = withWonderFirst(DayAndNightModule, 'tiny', 'day-and-night');

export default function TinyWorld() {
  const { t } = useTranslation();
  return (
    <Routes>
      <Route index element={<TinyHome />} />
      <Route path="tap-world" element={<TapWorld />} />
      <Route path="color-mixer" element={<ColorMixer />} />
      <Route path="shape-sorter" element={<ShapeSorter />} />
      <Route path="animal-orchestra" element={<AnimalOrchestra />} />
      <Route path="bubble-world" element={<BubbleWorld />} />
      <Route path="weather-maker" element={<WeatherMaker />} />
      <Route path="farm-friends" element={<FarmFriends />} />
      <Route path="day-and-night" element={<DayAndNight />} />
    </Routes>
  );
}
