// src/core/modules/DynamicRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, ComponentType } from 'react';
import { LoadingScreen } from '@/shared/ui';
import { moduleRegistry } from '../ModuleRegistry';
import withWonderFirst from './withWonderFirst';

// Module loader map: uses composite key `${worldId}:${moduleId}` to avoid conflicts
const moduleLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  // Biology modules
  'biology:cell-map': () => import('@/worlds/biology/components/CellExplorer'),
  'biology:dna-visualizer': () => import('@/worlds/biology/components/DNAVisualizer'),
  'biology:mitosis': () => import('@/worlds/biology/components/MitosisSimulator'),
  'biology:meiosis': () => import('@/worlds/biology/components/MeiosisSimulator'),
  'biology:respiration': () => import('@/worlds/biology/components/CellularRespiration'),
  'biology:photosynthesis': () => import('@/worlds/biology/components/PhotosynthesisLab'),
  'biology:punnett-square': () => import('@/worlds/biology/components/PunnettSquare'),
  'biology:crispr': () => import('@/worlds/biology/components/CrisprEditor'),
  'biology:evolution-tree': () => import('@/worlds/biology/components/EvolutionTree'),
  'biology:brain': () => import('@/worlds/biology/components/BrainExplorer'),
  'biology:heart': () => import('@/worlds/biology/components/HeartCirculation'),
  'biology:digestive': () => import('@/worlds/biology/components/DigestiveJourney'),
  'biology:immune-defense': () => import('@/worlds/biology/components/ImmuneDefense'),
  'biology:body-quiz': () => import('@/worlds/biology/components/BodyQuiz'),
  'biology:molecule-3d': () => import('@/worlds/biology/components/Molecule3D'),
  'biology:microscope': () => import('@/worlds/biology/components/MicroscopeSimulator'),
  'biology:enzyme-lab': () => import('@/worlds/biology/components/EnzymeLab'),
  'biology:plant-anatomy': () => import('@/worlds/biology/components/PlantAnatomy'),
  'biology:ecosystem': () => import('@/worlds/biology/components/EcosystemGame'),
  'biology:biomes': () => import('@/worlds/biology/components/BiomeExplorer'),
  'biology:carbon-cycle': () => import('@/worlds/biology/components/CarbonCycle'),
  'biology:water-cycle': () => import('@/worlds/biology/components/WaterCycle'),
  'biology:climate': () => import('@/worlds/biology/components/ClimateSimulator'),
  'biology:food-chain': () => import('@/worlds/biology/components/FoodChainDash'),
  'biology:metamorphosis': () => import('@/worlds/biology/components/Metamorphosis'),
  'biology:microbe-match': () => import('@/worlds/biology/components/MicrobeMatch'),

  // Physics modules
  'physics:daily': () => import('@/worlds/physics/components/PhysicsDailyChallenge'),
  'physics:projectile-motion': () => import('@/worlds/physics/components/ProjectileMotion'),
  'physics:newtons-laws': () => import('@/worlds/physics/components/NewtonsLaws'),
  'physics:pendulum-lab': () => import('@/worlds/physics/components/PendulumLab'),
  'physics:collision-sim': () => import('@/worlds/physics/components/CollisionSim'),
  'physics:energy-skate': () => import('@/worlds/physics/components/EnergySkate'),
  'physics:inclined-plane': () => import('@/worlds/physics/components/InclinedPlane'),
  'physics:wave-interference': () => import('@/worlds/physics/components/WaveInterference'),
  'physics:sound-waves': () => import('@/worlds/physics/components/SoundWaves'),
  'physics:doppler-effect': () => import('@/worlds/physics/components/DopplerEffect'),
  'physics:standing-waves': () => import('@/worlds/physics/components/StandingWaves'),
  'physics:resonance-lab': () => import('@/worlds/physics/components/ResonanceLab'),
  'physics:circuit-builder': () => import('@/worlds/physics/components/CircuitBuilder'),
  'physics:magnetic-fields': () => import('@/worlds/physics/components/MagneticFields'),
  'physics:ohms-law': () => import('@/worlds/physics/components/OhmsLaw'),
  'physics:em-induction': () => import('@/worlds/physics/components/EmInduction'),
  'physics:motor-generator': () => import('@/worlds/physics/components/MotorGenerator'),
  'physics:heat-transfer': () => import('@/worlds/physics/components/HeatTransfer'),
  'physics:gas-laws': () => import('@/worlds/physics/components/GasLaws'),
  'physics:heat-engine': () => import('@/worlds/physics/components/HeatEngine'),
  'physics:phase-change': () => import('@/worlds/physics/components/PhaseChange'),
  'physics:lens-sim': () => import('@/worlds/physics/components/LensSim'),
  'physics:mirror-lab': () => import('@/worlds/physics/components/MirrorLab'),
  'physics:prism-dispersion': () => import('@/worlds/physics/components/PrismDispersion'),
  'physics:human-eye': () => import('@/worlds/physics/components/HumanEye'),
  'physics:interference-patterns': () => import('@/worlds/physics/components/InterferencePatterns'),
  'physics:atomic-structure': () => import('@/worlds/physics/components/AtomicStructure'),
  'physics:photoelectric': () => import('@/worlds/physics/components/Photoelectric'),
  'physics:quantum-tunneling': () => import('@/worlds/physics/components/QuantumTunneling'),
  'physics:nuclear-decay': () => import('@/worlds/physics/components/NuclearDecay'),
  'physics:buoyancy-lab': () => import('@/worlds/physics/components/BuoyancyLab'),
  'physics:bernoulli': () => import('@/worlds/physics/components/Bernoulli'),
  'physics:viscosity': () => import('@/worlds/physics/components/Viscosity'),
  'physics:surface-tension': () => import('@/worlds/physics/components/SurfaceTension'),
  'physics:orbital-mechanics': () => import('@/worlds/physics/components/OrbitalMechanics'),
  'physics:black-hole': () => import('@/worlds/physics/components/BlackHole'),
  'physics:planetary-motion': () => import('@/worlds/physics/components/PlanetaryMotion'),
  'physics:gravity-wells': () => import('@/worlds/physics/components/GravityWells'),
  'physics:particle-accelerator': () => import('@/worlds/physics/components/ParticleAccelerator'),

  // Lab modules
  'lab:number-line': () => import('@/worlds/lab/modules/NumberLine'),
  'lab:shapes': () => import('@/worlds/lab/modules/Shapes'),
  'lab:fractions': () => import('@/worlds/lab/modules/Fractions'),
  'lab:multiplication': () => import('@/worlds/lab/modules/Multiplication'),
  'lab:states-of-matter': () => import('@/worlds/lab/modules/StatesOfMatter'),
  'lab:light-shadows': () => import('@/worlds/lab/modules/LightShadows'),
  'lab:float-sink': () => import('@/worlds/lab/modules/FloatSink'),
  'lab:day-night': () => import('@/worlds/lab/modules/DayNight'),
  'lab:solar-system': () => import('@/worlds/lab/modules/SolarSystem'),
  'lab:moon-phases': () => import('@/worlds/lab/modules/MoonPhases'),
  'lab:senses': () => import('@/worlds/lab/modules/Senses'),
  'lab:habitats': () => import('@/worlds/lab/modules/Habitats'),
  'lab:plant-growth': () => import('@/worlds/lab/modules/PlantGrowth'),
  'lab:digestive-system': () => import('@/worlds/lab/modules/DigestiveSystem'),
  'lab:simple-machines': () => import('@/worlds/lab/modules/SimpleMachines'),
  'lab:lever-explorer': () => import('@/worlds/lab/modules/LeverExplorer'),
  'lab:force-lab': () => import('@/worlds/lab/modules/ForceLab'),
  'lab:magnets': () => import('@/worlds/lab/modules/Magnets'),
  'lab:timeline-explorer': () => import('@/worlds/lab/modules/TimelineExplorer'),
  'lab:code-story': () => import('@/worlds/lab/modules/CodeStory'),
  'lab:panchabhutas': () => import('@/worlds/lab/modules/Panchabhutas'),
  'lab:multiplication-lab': () => import('@/worlds/lab/modules/MultiplicationLab'),
  'lab:fraction-kitchen': () => import('@/worlds/lab/modules/FractionKitchen'),
  'lab:pi': () => import('@/worlds/lab/modules/Pi'),
  'lab:electricity': () => import('@/worlds/lab/modules/Electricity'),
  'lab:atoms': () => import('@/worlds/lab/modules/Atoms'),
  'lab:blood-circulation': () => import('@/worlds/lab/modules/BloodCirculation'),
  'lab:cell-explorer': () => import('@/worlds/lab/modules/CellExplorer'),
  'lab:weather-station': () => import('@/worlds/lab/modules/WeatherStation'),
  'lab:ecosystem-sandbox': () => import('@/worlds/lab/modules/EcosystemSandbox'),
  'lab:gravity': () => import('@/worlds/lab/modules/Gravity'),
  'lab:pythagorean': () => import('@/worlds/lab/modules/Pythagorean'),
  'lab:statistics-playground': () => import('@/worlds/lab/modules/StatisticsPlayground'),
  'lab:buoyancy-lab': () => import('@/worlds/lab/modules/BuoyancyLab'),
  'lab:human-body': () => import('@/worlds/lab/modules/HumanBody'),
  'lab:newtons-laws': () => import('@/worlds/lab/modules/NewtonsLaws'),
  'lab:circuit-builder': () => import('@/worlds/lab/modules/CircuitBuilder'),
  'lab:water-cycle': () => import('@/worlds/lab/modules/WaterCycle'),
  'lab:photosynthesis': () => import('@/worlds/lab/modules/Photosynthesis'),
  'lab:sound-waves': () => import('@/worlds/lab/modules/SoundWaves'),
  'lab:food-chain': () => import('@/worlds/lab/modules/FoodChain'),
  // Wonder-First modules (Mission-aligned redesigns)
  'lab:gravity-wonder': () => import('@/worlds/lab/modules/GravityWonderFirst'),
  'lab:photosynthesis-wonder': () => import('@/worlds/lab/modules/PhotosynthesisWonderFirst'),
  'lab:fractions-wonder': () => import('@/worlds/lab/modules/FractionsWonderFirst'),
  'lab:solar-system-wonder': () => import('@/worlds/lab/modules/SolarSystemWonderFirst'),
  'lab:states-of-matter-wonder': () => import('@/worlds/lab/modules/StatesOfMatterWonderFirst'),
  'lab:light-shadows-wonder': () => import('@/worlds/lab/modules/LightShadowsWonderFirst'),
  'lab:multiplication-wonder': () => import('@/worlds/lab/modules/MultiplicationWonderFirst'),
  'lab:shapes-wonder': () => import('@/worlds/lab/modules/ShapesWonderFirst'),
  'lab:number-line-wonder': () => import('@/worlds/lab/modules/NumberLineWonderFirst'),
  'lab:water-cycle-wonder': () => import('@/worlds/lab/modules/WaterCycleWonderFirst'),
  'lab:simple-machines-wonder': () => import('@/worlds/lab/modules/SimpleMachinesWonderFirst'),
  'lab:float-sink-wonder': () => import('@/worlds/lab/modules/FloatSinkWonderFirst'),
  'lab:day-night-wonder': () => import('@/worlds/lab/modules/DayNightWonderFirst'),
  'lab:moon-phases-wonder': () => import('@/worlds/lab/modules/MoonPhasesWonderFirst'),
  'lab:senses-wonder': () => import('@/worlds/lab/modules/SensesWonderFirst'),
  'lab:habitats-wonder': () => import('@/worlds/lab/modules/HabitatsWonderFirst'),
  'lab:food-chain-wonder': () => import('@/worlds/lab/modules/FoodChainWonderFirst'),
  'lab:plant-growth-wonder': () => import('@/worlds/lab/modules/PlantGrowthWonderFirst'),
  'lab:digestive-system-wonder': () => import('@/worlds/lab/modules/DigestiveSystemWonderFirst'),
  'lab:magnets-wonder': () => import('@/worlds/lab/modules/MagnetsWonderFirst'),
  'lab:electricity-wonder': () => import('@/worlds/lab/modules/ElectricityWonderFirst'),

  // Math modules (MathApp handles internal routing, so we just load the main app)
  'math:math-adventure': () => import('@/worlds/math/components/MathApp'),
  'math:math-visualizer': () => import('@/worlds/math/components/MathApp'),
  'math:number-crunch': () => import('@/worlds/math/components/MathApp'),
  'math:pattern-hub': () => import('@/worlds/math/components/MathApp'),
  'math:skills-academy': () => import('@/worlds/math/components/MathApp'),
  'math:advanced-hub': () => import('@/worlds/math/components/MathApp'),
  'math:math-daily': () => import('@/worlds/math/components/MathApp'),
  'math:explorers-hub': () => import('@/worlds/math/components/MathApp'),
  'math:worksheet-gen': () => import('@/worlds/math/components/MathApp'),
};

// Hoist lazy modules to prevent remounting on every render
const lazyModules: Record<string, React.LazyExoticComponent<ComponentType<any>>> = Object.fromEntries(
  Object.entries(moduleLoaders).map(([key, loader]) => [
    key, 
    lazy(async () => {
      const mod = await loader();
      const isWonderFirst = key.endsWith('-wonder');
      const isMath = key.startsWith('math:');
      
      if (isWonderFirst || isMath) {
        return mod;
      }
      
      const [worldId, moduleId] = key.split(':');
      const WrappedComponent = withWonderFirst(mod.default, worldId, moduleId);
      return { default: WrappedComponent };
    })
  ])
);

/**
 * Generate routes for a specific world from the ModuleRegistry.
 */
export function WorldRoutes({ worldId }: { worldId: string }) {
  // Use visible modules (exclude hidden ones)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modules = moduleRegistry.getVisibleByWorld(worldId as any);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {modules.map((mod) => {
          const loaderKey = `${worldId}:${mod.id}`;
          const loader = moduleLoaders[loaderKey];
          if (!loader) {
            console.warn(`[DynamicRoutes] No loader for module: ${loaderKey}`);
            return null;
          }

          const Component = lazyModules[loaderKey];
          const pathSegment = mod.path.replace(`/${worldId}/`, '');

          return (
            <Route
              key={mod.id}
              path={pathSegment}
              element={<Component />}
            />
          );
        })}
      </Routes>
    </Suspense>
  );
}

/**
 * Generate all routes for all registered worlds.
 */
export function AllDynamicRoutes() {
  // Use visible modules (exclude hidden ones)
  const allModules = moduleRegistry.getAllVisible();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {allModules.map((mod) => {
          const loaderKey = `${mod.worldId}:${mod.id}`;
          const loader = moduleLoaders[loaderKey];
          if (!loader) return null;

          const Component = lazyModules[loaderKey];
          const routePath = mod.path.slice(1);

          return (
            <Route
              key={loaderKey}
              path={routePath}
              element={<Component />}
            />
          );
        })}
      </Routes>
    </Suspense>
  );
}
