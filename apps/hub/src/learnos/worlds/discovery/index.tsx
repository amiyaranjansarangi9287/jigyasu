// src/worlds/discovery/index.tsx
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingScreen } from '@/shared/ui';
import DiscoveryHome from './DiscoveryHome';

const AlgebraScales = lazy(() => import('./modules/AlgebraScales'));
const CellCity = lazy(() => import('./modules/CellCity'));
const ChemicalBalancer = lazy(() => import('./modules/ChemicalBalancer'));
const GeometryProofBuilder = lazy(() => import('./modules/GeometryProofBuilder'));
const SpeedDistanceTime = lazy(() => import('./modules/SpeedDistanceTime'));
const GeneticsSimulator = lazy(() => import('./modules/GeneticsSimulator'));
const PlateTectonics = lazy(() => import('./modules/PlateTectonics'));
const LiteraryAnalysis = lazy(() => import('./modules/LiteraryAnalysis'));
const EconomicSimulation = lazy(() => import('./modules/EconomicSimulation'));
const PeriodicTableExplorer = lazy(() => import('./modules/PeriodicTableExplorer'));
const ProbabilitySandbox = lazy(() => import('./modules/ProbabilitySandbox'));
const CarbonCycle = lazy(() => import('./modules/CarbonCycle'));
const NumberSystems = lazy(() => import('./modules/NumberSystems'));
const FermiEstimation = lazy(() => import('./modules/FermiEstimation'));

export default function DiscoveryWorld() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route index element={<DiscoveryHome />} />
        <Route path="algebra-scales" element={<AlgebraScales />} />
        <Route path="cell-city" element={<CellCity />} />
        <Route path="chemical-balancer" element={<ChemicalBalancer />} />
        <Route path="geometry-proof" element={<GeometryProofBuilder />} />
        <Route path="speed-distance-time" element={<SpeedDistanceTime />} />
        <Route path="genetics-simulator" element={<GeneticsSimulator />} />
        <Route path="plate-tectonics" element={<PlateTectonics />} />
        <Route path="literary-analysis" element={<LiteraryAnalysis />} />
        <Route path="economic-simulation" element={<EconomicSimulation />} />
        <Route path="periodic-table" element={<PeriodicTableExplorer />} />
        <Route path="probability-sandbox" element={<ProbabilitySandbox />} />
        <Route path="carbon-cycle" element={<CarbonCycle />} />
        <Route path="number-systems" element={<NumberSystems />} />
        <Route path="fermi-estimation" element={<FermiEstimation />} />
      </Routes>
    </Suspense>
  );
}
