// src/worlds/discovery/index.tsx
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingScreen } from '@/shared/ui';
import DiscoveryHome from './DiscoveryHome';
import withWonderFirst from '../../core/modules/withWonderFirst';
import { useTranslation } from 'react-i18next';

const AlgebraScales = lazy(async () => { const m = await import('./modules/AlgebraScales'); return { default: withWonderFirst(m.default, 'discovery', 'algebra-scales') }; });
const CellCity = lazy(async () => { const m = await import('./modules/CellCity'); return { default: withWonderFirst(m.default, 'discovery', 'cell-city') }; });
const ChemicalBalancer = lazy(async () => { const m = await import('./modules/ChemicalBalancer'); return { default: withWonderFirst(m.default, 'discovery', 'chemical-balancer') }; });
const GeometryProofBuilder = lazy(async () => { const m = await import('./modules/GeometryProofBuilder'); return { default: withWonderFirst(m.default, 'discovery', 'geometry-proof') }; });
const SpeedDistanceTime = lazy(async () => { const m = await import('./modules/SpeedDistanceTime'); return { default: withWonderFirst(m.default, 'discovery', 'speed-distance') }; });
const GeneticsSimulator = lazy(async () => { const m = await import('./modules/GeneticsSimulator'); return { default: withWonderFirst(m.default, 'discovery', 'genetics-simulator') }; });
const PlateTectonics = lazy(async () => { const m = await import('./modules/PlateTectonics'); return { default: withWonderFirst(m.default, 'discovery', 'plate-tectonics') }; });
const LiteraryAnalysis = lazy(async () => { const m = await import('./modules/LiteraryAnalysis'); return { default: withWonderFirst(m.default, 'discovery', 'literary-analysis') }; });
const EconomicSimulation = lazy(async () => { const m = await import('./modules/EconomicSimulation'); return { default: withWonderFirst(m.default, 'discovery', 'economic-simulation') }; });
const PeriodicTableExplorer = lazy(async () => { const m = await import('./modules/PeriodicTableExplorer'); return { default: withWonderFirst(m.default, 'discovery', 'periodic-table') }; });
const ProbabilitySandbox = lazy(async () => { const m = await import('./modules/ProbabilitySandbox'); return { default: withWonderFirst(m.default, 'discovery', 'probability') }; });
const CarbonCycle = lazy(async () => { const m = await import('./modules/CarbonCycle'); return { default: withWonderFirst(m.default, 'discovery', 'carbon-cycle') }; });
const NumberSystems = lazy(async () => { const m = await import('./modules/NumberSystems'); return { default: withWonderFirst(m.default, 'discovery', 'number-systems') }; });
const FermiEstimation = lazy(async () => { const m = await import('./modules/FermiEstimation'); return { default: withWonderFirst(m.default, 'discovery', 'fermi-estimation') }; });

export default function DiscoveryWorld() {
  const { t } = useTranslation();
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
