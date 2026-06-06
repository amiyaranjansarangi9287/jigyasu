import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingScreen } from '@/shared/ui';
import ExplorerHome from './ExplorerHome';
import withWonderFirst from '../../core/modules/withWonderFirst';

// Lazy load all concepts and wrap in Wonder-First pedagogy
const GravityOrbits = lazy(async () => { const m = await import('./concepts/GravityOrbits'); return { default: withWonderFirst(m.default, 'explorer', 'gravity-orbits') }; });
const StatesOfMatter = lazy(async () => { const m = await import('./concepts/StatesOfMatter'); return { default: withWonderFirst(m.default, 'explorer', 'states-of-matter') }; });
const PiVisual = lazy(async () => { const m = await import('./concepts/PiVisual'); return { default: withWonderFirst(m.default, 'explorer', 'pi-visual') }; });
const PhotosynthesisAdult = lazy(async () => { const m = await import('./concepts/PhotosynthesisAdult'); return { default: withWonderFirst(m.default, 'explorer', 'photosynthesis') }; });
const FractionsSharing = lazy(async () => { const m = await import('./concepts/FractionsSharing'); return { default: withWonderFirst(m.default, 'explorer', 'fractions-sharing') }; });
const WaterCycleAdult = lazy(async () => { const m = await import('./concepts/WaterCycleAdult'); return { default: withWonderFirst(m.default, 'explorer', 'water-cycle') }; });
const MagnetsAdult = lazy(async () => { const m = await import('./concepts/MagnetsAdult'); return { default: withWonderFirst(m.default, 'explorer', 'magnets') }; });
const FloatSinkAdult = lazy(async () => { const m = await import('./concepts/FloatSinkAdult'); return { default: withWonderFirst(m.default, 'explorer', 'float-sink') }; });
const DayNightAdult = lazy(async () => { const m = await import('./concepts/DayNightAdult'); return { default: withWonderFirst(m.default, 'explorer', 'day-night') }; });
const FoodChainAdult = lazy(async () => { const m = await import('./concepts/FoodChainAdult'); return { default: withWonderFirst(m.default, 'explorer', 'food-chain') }; });
const ElectricityAdult = lazy(async () => { const m = await import('./concepts/ElectricityAdult'); return { default: withWonderFirst(m.default, 'explorer', 'electricity') }; });
const EvolutionAdult = lazy(async () => { const m = await import('./concepts/EvolutionAdult'); return { default: withWonderFirst(m.default, 'explorer', 'evolution') }; });
const ProbabilityAdult = lazy(async () => { const m = await import('./concepts/ProbabilityAdult'); return { default: withWonderFirst(m.default, 'explorer', 'probability') }; });
const DnaNatureAdult = lazy(async () => { const m = await import('./concepts/DnaNatureAdult'); return { default: withWonderFirst(m.default, 'explorer', 'dna-nature') }; });
const ClimateAdult = lazy(async () => { const m = await import('./concepts/ClimateAdult'); return { default: withWonderFirst(m.default, 'explorer', 'climate') }; });

export default function ExplorerWorld() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route index element={<ExplorerHome />} />
        <Route path="gravity-orbits" element={<GravityOrbits />} />
        <Route path="states-of-matter" element={<StatesOfMatter />} />
        <Route path="pi-visual" element={<PiVisual />} />
        <Route path="photosynthesis" element={<PhotosynthesisAdult />} />
        <Route path="fractions-sharing" element={<FractionsSharing />} />
        <Route path="water-cycle" element={<WaterCycleAdult />} />
        <Route path="magnets" element={<MagnetsAdult />} />
        <Route path="float-sink" element={<FloatSinkAdult />} />
        <Route path="day-night" element={<DayNightAdult />} />
        <Route path="food-chain" element={<FoodChainAdult />} />
        <Route path="electricity" element={<ElectricityAdult />} />
        <Route path="evolution" element={<EvolutionAdult />} />
        <Route path="probability" element={<ProbabilityAdult />} />
        <Route path="dna-nature" element={<DnaNatureAdult />} />
        <Route path="climate" element={<ClimateAdult />} />
      </Routes>
    </Suspense>
  );
}
