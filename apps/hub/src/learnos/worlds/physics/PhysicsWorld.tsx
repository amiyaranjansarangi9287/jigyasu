// src/worlds/physics/PhysicsWorld.tsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { LoadingScreen } from '@/shared/ui';
import { useLearnerStore } from '@/store';
import { useTranslation } from 'react-i18next';

const Home = lazy(() => import('./components/Home'));
const PhysicsDailyChallenge = lazy(() => import('./components/PhysicsDailyChallenge'));
const ProjectileMotion = lazy(() => import('./components/ProjectileMotion'));
const NewtonsLaws = lazy(() => import('./components/NewtonsLaws'));
const PendulumLab = lazy(() => import('./components/PendulumLab'));
const CollisionSim = lazy(() => import('./components/CollisionSim'));
const EnergySkate = lazy(() => import('./components/EnergySkate'));
const InclinedPlane = lazy(() => import('./components/InclinedPlane'));
const WaveInterference = lazy(() => import('./components/WaveInterference'));
const SoundWaves = lazy(() => import('./components/SoundWaves'));
const DopplerEffect = lazy(() => import('./components/DopplerEffect'));
const StandingWaves = lazy(() => import('./components/StandingWaves'));
const ResonanceLab = lazy(() => import('./components/ResonanceLab'));
const CircuitBuilder = lazy(() => import('./components/CircuitBuilder'));
const MagneticFields = lazy(() => import('./components/MagneticFields'));
const OhmsLaw = lazy(() => import('./components/OhmsLaw'));
const EmInduction = lazy(() => import('./components/EmInduction'));
const MotorGenerator = lazy(() => import('./components/MotorGenerator'));
const HeatTransfer = lazy(() => import('./components/HeatTransfer'));
const GasLaws = lazy(() => import('./components/GasLaws'));
const HeatEngine = lazy(() => import('./components/HeatEngine'));
const PhaseChange = lazy(() => import('./components/PhaseChange'));
const LensSim = lazy(() => import('./components/LensSim'));
const MirrorLab = lazy(() => import('./components/MirrorLab'));
const PrismDispersion = lazy(() => import('./components/PrismDispersion'));
const HumanEye = lazy(() => import('./components/HumanEye'));
const InterferencePatterns = lazy(() => import('./components/InterferencePatterns'));
const AtomicStructure = lazy(() => import('./components/AtomicStructure'));
const Photoelectric = lazy(() => import('./components/Photoelectric'));
const QuantumTunneling = lazy(() => import('./components/QuantumTunneling'));
const NuclearDecay = lazy(() => import('./components/NuclearDecay'));
const BuoyancyLab = lazy(() => import('./components/BuoyancyLab'));
const Bernoulli = lazy(() => import('./components/Bernoulli'));
const Viscosity = lazy(() => import('./components/Viscosity'));
const SurfaceTension = lazy(() => import('./components/SurfaceTension'));
const OrbitalMechanics = lazy(() => import('./components/OrbitalMechanics'));
const BlackHole = lazy(() => import('./components/BlackHole'));
const PlanetaryMotion = lazy(() => import('./components/PlanetaryMotion'));
const GravityWells = lazy(() => import('./components/GravityWells'));
const ParticleAccelerator = lazy(() => import('./components/ParticleAccelerator'));

export default function PhysicsWorld() {
  const { t } = useTranslation();
  const location = useLocation();
  const { enterModule } = useLearnerStore();

  const moduleId = location.pathname.replace(/^\/physics\/?/, '') || 'home';
  useEffect(() => {
    if (moduleId !== 'home') {
      enterModule(moduleId, moduleId, 'physics');
    }
  }, [moduleId, enterModule]);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route index element={<Home onNavigate={(id) => window.location.href = `/physics/${id}`} />} />
        <Route path="daily" element={<PhysicsDailyChallenge />} />
        <Route path="projectile-motion" element={<ProjectileMotion />} />
        <Route path="newtons-laws" element={<NewtonsLaws />} />
        <Route path="pendulum-lab" element={<PendulumLab />} />
        <Route path="collision-sim" element={<CollisionSim />} />
        <Route path="energy-skate" element={<EnergySkate />} />
        <Route path="inclined-plane" element={<InclinedPlane />} />
        <Route path="wave-interference" element={<WaveInterference />} />
        <Route path="sound-waves" element={<SoundWaves />} />
        <Route path="doppler-effect" element={<DopplerEffect />} />
        <Route path="standing-waves" element={<StandingWaves />} />
        <Route path="resonance-lab" element={<ResonanceLab />} />
        <Route path="circuit-builder" element={<CircuitBuilder />} />
        <Route path="magnetic-fields" element={<MagneticFields />} />
        <Route path="ohms-law" element={<OhmsLaw />} />
        <Route path="em-induction" element={<EmInduction />} />
        <Route path="motor-generator" element={<MotorGenerator />} />
        <Route path="heat-transfer" element={<HeatTransfer />} />
        <Route path="gas-laws" element={<GasLaws />} />
        <Route path="heat-engine" element={<HeatEngine />} />
        <Route path="phase-change" element={<PhaseChange />} />
        <Route path="lens-sim" element={<LensSim />} />
        <Route path="mirror-lab" element={<MirrorLab />} />
        <Route path="prism-dispersion" element={<PrismDispersion />} />
        <Route path="human-eye" element={<HumanEye />} />
        <Route path="interference-patterns" element={<InterferencePatterns />} />
        <Route path="atomic-structure" element={<AtomicStructure />} />
        <Route path="photoelectric" element={<Photoelectric />} />
        <Route path="quantum-tunneling" element={<QuantumTunneling />} />
        <Route path="nuclear-decay" element={<NuclearDecay />} />
        <Route path="buoyancy-lab" element={<BuoyancyLab />} />
        <Route path="bernoulli" element={<Bernoulli />} />
        <Route path="viscosity" element={<Viscosity />} />
        <Route path="surface-tension" element={<SurfaceTension />} />
        <Route path="orbital-mechanics" element={<OrbitalMechanics />} />
        <Route path="black-hole" element={<BlackHole />} />
        <Route path="planetary-motion" element={<PlanetaryMotion />} />
        <Route path="gravity-wells" element={<GravityWells />} />
        <Route path="particle-accelerator" element={<ParticleAccelerator />} />
      </Routes>
    </Suspense>
  );
}
