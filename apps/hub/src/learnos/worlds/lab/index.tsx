// src/worlds/lab/index.tsx
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingScreen } from '@/shared/ui';
import LabHome from './LabHome';
import { useTranslation } from 'react-i18next';

const CircuitBuilder = lazy(() => import('./modules/CircuitBuilder'));
const FractionKitchen = lazy(() => import('./modules/FractionKitchen'));
const EcosystemSandbox = lazy(() => import('./modules/EcosystemSandbox'));
const ForceLab = lazy(() => import('./modules/ForceLab'));
const WeatherStation = lazy(() => import('./modules/WeatherStation'));
const TimelineExplorer = lazy(() => import('./modules/TimelineExplorer'));
const CodeStory = lazy(() => import('./modules/CodeStory'));
const MultiplicationLab = lazy(() => import('./modules/MultiplicationLab'));
const BuoyancyLab = lazy(() => import('./modules/BuoyancyLab'));
const LeverExplorer = lazy(() => import('./modules/LeverExplorer'));
const StatisticsPlayground = lazy(() => import('./modules/StatisticsPlayground'));
const HumanBody = lazy(() => import('./modules/HumanBody'));
const Panchabhutas = lazy(() => import('./modules/Panchabhutas'));
const StatesOfMatter = lazy(() => import('./modules/StatesOfMatter'));
const Gravity = lazy(() => import('./modules/Gravity'));
const WaterCycle = lazy(() => import('./modules/WaterCycle'));
const Photosynthesis = lazy(() => import('./modules/Photosynthesis'));
const DigestiveSystem = lazy(() => import('./modules/DigestiveSystem'));
const SolarSystem = lazy(() => import('./modules/SolarSystem'));
const BloodCirculation = lazy(() => import('./modules/BloodCirculation'));
const CellExplorer = lazy(() => import('./modules/CellExplorer'));
const NewtonsLaws = lazy(() => import('./modules/NewtonsLaws'));
const Magnets = lazy(() => import('./modules/Magnets'));
const Electricity = lazy(() => import('./modules/Electricity'));
const LightShadows = lazy(() => import('./modules/LightShadows'));
const SoundWaves = lazy(() => import('./modules/SoundWaves'));
const FloatSink = lazy(() => import('./modules/FloatSink'));
const PlantGrowth = lazy(() => import('./modules/PlantGrowth'));
const DayNight = lazy(() => import('./modules/DayNight'));
const MoonPhases = lazy(() => import('./modules/MoonPhases'));
const Atoms = lazy(() => import('./modules/Atoms'));
const SimpleMachines = lazy(() => import('./modules/SimpleMachines'));
const Shapes = lazy(() => import('./modules/Shapes'));
const NumberLine = lazy(() => import('./modules/NumberLine'));
const Fractions = lazy(() => import('./modules/Fractions'));
const Multiplication = lazy(() => import('./modules/Multiplication'));
const Pi = lazy(() => import('./modules/Pi'));
const Pythagorean = lazy(() => import('./modules/Pythagorean'));
const Senses = lazy(() => import('./modules/Senses'));
const Habitats = lazy(() => import('./modules/Habitats'));
const FoodChain = lazy(() => import('./modules/FoodChain'));

export default function LabWorld() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route index element={<LabHome />} />
        <Route path="circuit-builder" element={<CircuitBuilder />} />
        <Route path="fraction-kitchen" element={<FractionKitchen />} />
        <Route path="ecosystem-sandbox" element={<EcosystemSandbox />} />
        <Route path="force-lab" element={<ForceLab />} />
        <Route path="weather-station" element={<WeatherStation />} />
        <Route path="timeline-explorer" element={<TimelineExplorer />} />
        <Route path="code-story" element={<CodeStory />} />
        <Route path="multiplication-lab" element={<MultiplicationLab />} />
        <Route path="buoyancy-lab" element={<BuoyancyLab />} />
        <Route path="lever-explorer" element={<LeverExplorer />} />
        <Route path="statistics-playground" element={<StatisticsPlayground />} />
        <Route path="human-body" element={<HumanBody />} />
        <Route path="panchabhutas" element={<Panchabhutas />} />
        <Route path="states-of-matter" element={<StatesOfMatter />} />
        <Route path="gravity" element={<Gravity />} />
        <Route path="water-cycle" element={<WaterCycle />} />
        <Route path="photosynthesis" element={<Photosynthesis />} />
        <Route path="digestive-system" element={<DigestiveSystem />} />
        <Route path="solar-system" element={<SolarSystem />} />
        <Route path="blood-circulation" element={<BloodCirculation />} />
        <Route path="cell-explorer" element={<CellExplorer />} />
        <Route path="newtons-laws" element={<NewtonsLaws />} />
        <Route path="magnets" element={<Magnets />} />
        <Route path="electricity" element={<Electricity />} />
        <Route path="light-shadows" element={<LightShadows />} />
        <Route path="sound-waves" element={<SoundWaves />} />
        <Route path="float-sink" element={<FloatSink />} />
        <Route path="plant-growth" element={<PlantGrowth />} />
        <Route path="day-night" element={<DayNight />} />
        <Route path="moon-phases" element={<MoonPhases />} />
        <Route path="atoms" element={<Atoms />} />
        <Route path="simple-machines" element={<SimpleMachines />} />
        <Route path="shapes" element={<Shapes />} />
        <Route path="number-line" element={<NumberLine />} />
        <Route path="fractions" element={<Fractions />} />
        <Route path="multiplication" element={<Multiplication />} />
        <Route path="pi" element={<Pi />} />
        <Route path="pythagorean" element={<Pythagorean />} />
        <Route path="senses" element={<Senses />} />
        <Route path="habitats" element={<Habitats />} />
        <Route path="food-chain" element={<FoodChain />} />
      </Routes>
    </Suspense>
  );
}
