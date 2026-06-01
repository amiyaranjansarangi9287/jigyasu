// src/worlds/academy/index.tsx
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingScreen } from '@/shared/ui';
import AcademyHome from './AcademyHome';

const TrigonometryCircle = lazy(() => import('./modules/TrigonometryCircle'));
const ProjectileMotion = lazy(() => import('./modules/ProjectileMotion'));
const WaveInterference = lazy(() => import('./modules/WaveInterference'));
const DerivativesVisual = lazy(() => import('./modules/DerivativesVisual'));
const RedoxReactions = lazy(() => import('./modules/RedoxReactions'));
const DNASynthesis = lazy(() => import('./modules/DNASynthesis'));
const Electrolysis = lazy(() => import('./modules/Electrolysis'));
const NaturalSelection = lazy(() => import('./modules/NaturalSelection'));
const EssayArchitect = lazy(() => import('./modules/EssayArchitect'));
const EconomicIndicators = lazy(() => import('./modules/EconomicIndicators'));
const TrigIdentities = lazy(() => import('./modules/TrigIdentities'));
const ClimateSystems = lazy(() => import('./modules/ClimateSystems'));

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
