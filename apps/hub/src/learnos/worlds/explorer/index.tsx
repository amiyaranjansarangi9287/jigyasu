import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingScreen } from '@/shared/ui';
import ExplorerHome from './ExplorerHome';

// Lazy load all concepts
const GravityOrbits = lazy(() => import('./concepts/GravityOrbits'));
const StatesOfMatter = lazy(() => import('./concepts/StatesOfMatter'));
const PiVisual = lazy(() => import('./concepts/PiVisual'));
const PhotosynthesisAdult = lazy(() => import('./concepts/PhotosynthesisAdult'));
const FractionsSharing = lazy(() => import('./concepts/FractionsSharing'));
const WaterCycleAdult = lazy(() => import('./concepts/WaterCycleAdult'));
const MagnetsAdult = lazy(() => import('./concepts/MagnetsAdult'));
const FloatSinkAdult = lazy(() => import('./concepts/FloatSinkAdult'));
const DayNightAdult = lazy(() => import('./concepts/DayNightAdult'));
const FoodChainAdult = lazy(() => import('./concepts/FoodChainAdult'));
const ElectricityAdult = lazy(() => import('./concepts/ElectricityAdult'));
const EvolutionAdult = lazy(() => import('./concepts/EvolutionAdult'));
const ProbabilityAdult = lazy(() => import('./concepts/ProbabilityAdult'));
const DnaNatureAdult = lazy(() => import('./concepts/DnaNatureAdult'));
const ClimateAdult = lazy(() => import('./concepts/ClimateAdult'));

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
