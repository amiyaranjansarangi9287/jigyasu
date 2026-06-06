// src/worlds/academy/index.tsx
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingScreen } from '@/shared/ui';
import AcademyHome from './AcademyHome';
import withWonderFirst from '../../core/modules/withWonderFirst';

const TrigonometryCircle = lazy(async () => { const m = await import('./modules/TrigonometryCircle'); return { default: withWonderFirst(m.default, 'academy', 'trigonometry') }; });
const ProjectileMotion = lazy(async () => { const m = await import('./modules/ProjectileMotion'); return { default: withWonderFirst(m.default, 'academy', 'projectile-motion') }; });
const WaveInterference = lazy(async () => { const m = await import('./modules/WaveInterference'); return { default: withWonderFirst(m.default, 'academy', 'wave-interference') }; });
const DerivativesVisual = lazy(async () => { const m = await import('./modules/DerivativesVisual'); return { default: withWonderFirst(m.default, 'academy', 'derivatives') }; });
const RedoxReactions = lazy(async () => { const m = await import('./modules/RedoxReactions'); return { default: withWonderFirst(m.default, 'academy', 'redox-reactions') }; });
const DNASynthesis = lazy(async () => { const m = await import('./modules/DNASynthesis'); return { default: withWonderFirst(m.default, 'academy', 'dna-synthesis') }; });
const Electrolysis = lazy(async () => { const m = await import('./modules/Electrolysis'); return { default: withWonderFirst(m.default, 'academy', 'electrolysis') }; });
const NaturalSelection = lazy(async () => { const m = await import('./modules/NaturalSelection'); return { default: withWonderFirst(m.default, 'academy', 'natural-selection') }; });
const EssayArchitect = lazy(async () => { const m = await import('./modules/EssayArchitect'); return { default: withWonderFirst(m.default, 'academy', 'essay-architect') }; });
const EconomicIndicators = lazy(async () => { const m = await import('./modules/EconomicIndicators'); return { default: withWonderFirst(m.default, 'academy', 'economic-indicators') }; });
const TrigIdentities = lazy(async () => { const m = await import('./modules/TrigIdentities'); return { default: withWonderFirst(m.default, 'academy', 'trig-identities') }; });
const ClimateSystems = lazy(async () => { const m = await import('./modules/ClimateSystems'); return { default: withWonderFirst(m.default, 'academy', 'climate-systems') }; });

export default function AcademyWorld() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route index element={<AcademyHome />} />
        <Route path="trigonometry" element={<TrigonometryCircle />} />
        <Route path="projectile-motion" element={<ProjectileMotion />} />
        <Route path="wave-interference" element={<WaveInterference />} />
        <Route path="derivatives" element={<DerivativesVisual />} />
        <Route path="redox-reactions" element={<RedoxReactions />} />
        <Route path="dna-synthesis" element={<DNASynthesis />} />
        <Route path="electrolysis" element={<Electrolysis />} />
        <Route path="natural-selection" element={<NaturalSelection />} />
        <Route path="essay-architect" element={<EssayArchitect />} />
        <Route path="economic-indicators" element={<EconomicIndicators />} />
        <Route path="trig-identities" element={<TrigIdentities />} />
        <Route path="climate-systems" element={<ClimateSystems />} />
      </Routes>
    </Suspense>
  );
}
