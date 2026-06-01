// src/worlds/tiny/index.tsx
// Tiny World entry point — routes to home and all 8 modules.

import { Routes, Route } from 'react-router-dom';
import TinyHome from './TinyHome';
import TapWorld from './modules/TapWorld';
import ColorMixer from './modules/ColorMixer';
import ShapeSorter from './modules/ShapeSorter';
import AnimalOrchestra from './modules/AnimalOrchestra';
import BubbleWorld from './modules/BubbleWorld';
import WeatherMaker from './modules/WeatherMaker';
import FarmFriends from './modules/FarmFriends';
import DayAndNight from './modules/DayAndNight';

export default function TinyWorld() {
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
