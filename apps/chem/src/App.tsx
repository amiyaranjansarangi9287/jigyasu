import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@jigyasu/ui';
import Home from './pages/Home'

// Class 2-6 concepts
import StatesOfMatter from './pages/concepts/StatesOfMatter'
import Fractions from './pages/concepts/Fractions'
import DayNight from './pages/concepts/DayNight'
import WaterCycle from './pages/concepts/WaterCycle'
import Magnets from './pages/concepts/Magnets'
import FloatSink from './pages/concepts/FloatSink'
import LightShadows from './pages/concepts/LightShadows'
import Photosynthesis from './pages/concepts/Photosynthesis'
import Shapes from './pages/concepts/Shapes'
import Multiplication from './pages/concepts/Multiplication'
import NumberLine from './pages/concepts/NumberLine'
import SoundWaves from './pages/concepts/SoundWaves'
import SolarSystem from './pages/concepts/SolarSystem'
import PlantGrowth from './pages/concepts/PlantGrowth'
import Senses from './pages/concepts/Senses'
import SimpleMachines from './pages/concepts/SimpleMachines'
import Habitats from './pages/concepts/Habitats'
import Pi from './pages/concepts/Pi'

// Class 6-10 concepts
import GravitySpacetime from './pages/concepts/GravitySpacetime'
import Atoms from './pages/concepts/Atoms'
import CellStructure from './pages/concepts/CellStructure'
import DigestiveSystem from './pages/concepts/DigestiveSystem'
import BloodCirculation from './pages/concepts/BloodCirculation'
import NewtonsLaws from './pages/concepts/NewtonsLaws'
import Electricity from './pages/concepts/Electricity'
import FoodChain from './pages/concepts/FoodChain'
import MoonPhases from './pages/concepts/MoonPhases'
import Pythagorean from './pages/concepts/Pythagorean'
import ChemistryReactions from './pages/concepts/ChemistryReactions'
import DnaReplication from './pages/concepts/DnaReplication'
import KineticEnergy from './pages/concepts/KineticEnergy'

// Class 6-10 concepts (new)
import PeriodicTable from './pages/concepts/PeriodicTable'
import LightWaves from './pages/concepts/LightWaves'
import Evolution from './pages/concepts/Evolution'
import PlateTectonics from './pages/concepts/PlateTectonics'
import AcidsBases from './pages/concepts/AcidsBases'
import Respiration from './pages/concepts/Respiration'
import Optics from './pages/concepts/Optics'

export default function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-2xl font-bold text-gray-500">Loading Module...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Class 2-6 */}
          <Route path="/concepts/states-of-matter" element={<StatesOfMatter />} />
          <Route path="/concepts/fractions" element={<Fractions />} />
          <Route path="/concepts/day-night" element={<DayNight />} />
          <Route path="/concepts/water-cycle" element={<WaterCycle />} />
          <Route path="/concepts/magnets" element={<Magnets />} />
          <Route path="/concepts/float-sink" element={<FloatSink />} />
          <Route path="/concepts/light-shadows" element={<LightShadows />} />
          <Route path="/concepts/photosynthesis" element={<Photosynthesis />} />
          <Route path="/concepts/shapes" element={<Shapes />} />
          <Route path="/concepts/multiplication" element={<Multiplication />} />
          <Route path="/concepts/number-line" element={<NumberLine />} />
          <Route path="/concepts/sound-waves" element={<SoundWaves />} />
          <Route path="/concepts/solar-system" element={<SolarSystem />} />
          <Route path="/concepts/plant-growth" element={<PlantGrowth />} />
          <Route path="/concepts/senses" element={<Senses />} />
          <Route path="/concepts/simple-machines" element={<SimpleMachines />} />
          <Route path="/concepts/habitats" element={<Habitats />} />
          <Route path="/concepts/pi" element={<Pi />} />

          {/* Class 6-10 */}
          <Route path="/concepts/gravity-spacetime" element={<GravitySpacetime />} />
          <Route path="/concepts/atoms" element={<Atoms />} />
          <Route path="/concepts/cell-structure" element={<CellStructure />} />
          <Route path="/concepts/digestive-system" element={<DigestiveSystem />} />
          <Route path="/concepts/blood-circulation" element={<BloodCirculation />} />
          <Route path="/concepts/newtons-laws" element={<NewtonsLaws />} />
          <Route path="/concepts/electricity" element={<Electricity />} />
          <Route path="/concepts/food-chain" element={<FoodChain />} />
          <Route path="/concepts/moon-phases" element={<MoonPhases />} />
          <Route path="/concepts/pythagorean" element={<Pythagorean />} />
          <Route path="/concepts/chemistry-reactions" element={<ChemistryReactions />} />
          <Route path="/concepts/dna-replication" element={<DnaReplication />} />
          <Route path="/concepts/kinetic-energy" element={<KineticEnergy />} />

          {/* Class 6-10 (new) */}
          <Route path="/concepts/periodic-table" element={<PeriodicTable />} />
          <Route path="/concepts/waves-light" element={<LightWaves />} />
          <Route path="/concepts/evolution" element={<Evolution />} />
          <Route path="/concepts/plate-tectonics" element={<PlateTectonics />} />
          <Route path="/concepts/acids-bases" element={<AcidsBases />} />
          <Route path="/concepts/respiration" element={<Respiration />} />
          <Route path="/concepts/optics" element={<Optics />} />
        </Routes>
      </Suspense>
      </Layout>
    </Router>
  )
}
