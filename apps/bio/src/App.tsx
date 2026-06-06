import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@jigyasu/ui';
import Home from './pages/Home';

import BloodCirculation from './pages/concepts/BloodCirculation';
import CellStructure from './pages/concepts/CellStructure';
import DigestiveSystem from './pages/concepts/DigestiveSystem';
import DnaReplication from './pages/concepts/DnaReplication';
import Evolution from './pages/concepts/Evolution';
import FoodChain from './pages/concepts/FoodChain';
import Habitats from './pages/concepts/Habitats';
import Photosynthesis from './pages/concepts/Photosynthesis';
import PlantGrowth from './pages/concepts/PlantGrowth';
import Respiration from './pages/concepts/Respiration';
import Senses from './pages/concepts/Senses';


export default function App() {
  return (
    <Router basename="/bio">
      <Layout>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-2xl font-bold text-gray-500">Loading Module...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
          <Route path="/concepts/blood-circulation" element={<BloodCirculation />} />
          <Route path="/concepts/cell-structure" element={<CellStructure />} />
          <Route path="/concepts/digestive-system" element={<DigestiveSystem />} />
          <Route path="/concepts/dna-replication" element={<DnaReplication />} />
          <Route path="/concepts/evolution" element={<Evolution />} />
          <Route path="/concepts/food-chain" element={<FoodChain />} />
          <Route path="/concepts/habitats" element={<Habitats />} />
          <Route path="/concepts/photosynthesis" element={<Photosynthesis />} />
          <Route path="/concepts/plant-growth" element={<PlantGrowth />} />
          <Route path="/concepts/respiration" element={<Respiration />} />
          <Route path="/concepts/senses" element={<Senses />} />

          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}
