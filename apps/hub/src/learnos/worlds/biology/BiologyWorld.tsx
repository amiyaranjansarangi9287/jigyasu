// src/worlds/biology/BiologyWorld.tsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { LoadingScreen } from '@/shared/ui';
import { useLearnerStore } from '@/store';

const Home = lazy(() => import('./components/Home'));
const CellExplorer = lazy(() => import('./components/CellExplorer'));
const DNAVisualizer = lazy(() => import('./components/DNAVisualizer'));
const EcosystemGame = lazy(() => import('./components/EcosystemGame'));
const Molecule3D = lazy(() => import('./components/Molecule3D'));
const MitosisSimulator = lazy(() => import('./components/MitosisSimulator'));
const MicrobeMatch = lazy(() => import('./components/MicrobeMatch'));
const EvolutionTree = lazy(() => import('./components/EvolutionTree'));
const BodyQuiz = lazy(() => import('./components/BodyQuiz'));
const PhotosynthesisLab = lazy(() => import('./components/PhotosynthesisLab'));
const FoodChainDash = lazy(() => import('./components/FoodChainDash'));
const MicroscopeSimulator = lazy(() => import('./components/MicroscopeSimulator'));
const ImmuneDefense = lazy(() => import('./components/ImmuneDefense'));
const PunnettSquare = lazy(() => import('./components/PunnettSquare'));
const HeartCirculation = lazy(() => import('./components/HeartCirculation'));
const BiomeExplorer = lazy(() => import('./components/BiomeExplorer'));
const MeiosisSimulator = lazy(() => import('./components/MeiosisSimulator'));
const CellularRespiration = lazy(() => import('./components/CellularRespiration'));
const Metamorphosis = lazy(() => import('./components/Metamorphosis'));
const ClimateSimulator = lazy(() => import('./components/ClimateSimulator'));
const BrainExplorer = lazy(() => import('./components/BrainExplorer'));
const DigestiveJourney = lazy(() => import('./components/DigestiveJourney'));
const CarbonCycle = lazy(() => import('./components/CarbonCycle'));
const EnzymeLab = lazy(() => import('./components/EnzymeLab'));
const PlantAnatomy = lazy(() => import('./components/PlantAnatomy'));
const WaterCycle = lazy(() => import('./components/WaterCycle'));
const CrisprEditor = lazy(() => import('./components/CrisprEditor'));

export default function BiologyWorld() {
  const location = useLocation();
  const { enterModule } = useLearnerStore();

  const moduleId = location.pathname.replace(/^\/biology\/?/, '') || 'home';

  useEffect(() => {
    if (moduleId !== 'home') {
      enterModule(moduleId, moduleId, 'biology');
    }
  }, [moduleId, enterModule]);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route index element={<Home onNavigate={(id) => window.location.href = `/biology/${id}`} />} />
        <Route path="cell-map" element={<CellExplorer />} />
        <Route path="dna-visualizer" element={<DNAVisualizer />} />
        <Route path="ecosystem" element={<EcosystemGame />} />
        <Route path="molecule-3d" element={<Molecule3D />} />
        <Route path="mitosis" element={<MitosisSimulator />} />
        <Route path="microbe-match" element={<MicrobeMatch />} />
        <Route path="evolution-tree" element={<EvolutionTree />} />
        <Route path="body-quiz" element={<BodyQuiz />} />
        <Route path="photosynthesis" element={<PhotosynthesisLab />} />
        <Route path="food-chain" element={<FoodChainDash />} />
        <Route path="microscope" element={<MicroscopeSimulator />} />
        <Route path="immune-defense" element={<ImmuneDefense />} />
        <Route path="punnett-square" element={<PunnettSquare />} />
        <Route path="heart" element={<HeartCirculation />} />
        <Route path="biomes" element={<BiomeExplorer />} />
        <Route path="meiosis" element={<MeiosisSimulator />} />
        <Route path="respiration" element={<CellularRespiration />} />
        <Route path="metamorphosis" element={<Metamorphosis />} />
        <Route path="climate" element={<ClimateSimulator />} />
        <Route path="brain" element={<BrainExplorer />} />
        <Route path="digestive" element={<DigestiveJourney />} />
        <Route path="carbon-cycle" element={<CarbonCycle />} />
        <Route path="enzyme-lab" element={<EnzymeLab />} />
        <Route path="plant-anatomy" element={<PlantAnatomy />} />
        <Route path="water-cycle" element={<WaterCycle />} />
        <Route path="crispr" element={<CrisprEditor />} />
      </Routes>
    </Suspense>
  );
}
