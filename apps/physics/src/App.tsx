import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@jigyasu/ui';
import Home from './pages/Home';

import Electricity from './pages/concepts/Electricity';
import FloatSink from './pages/concepts/FloatSink';
import KineticEnergy from './pages/concepts/KineticEnergy';
import LightShadows from './pages/concepts/LightShadows';
import LightWaves from './pages/concepts/LightWaves';
import Magnets from './pages/concepts/Magnets';
import NewtonsLaws from './pages/concepts/NewtonsLaws';
import Optics from './pages/concepts/Optics';
import SimpleMachines from './pages/concepts/SimpleMachines';
import SoundWaves from './pages/concepts/SoundWaves';
import WaterCycle from './pages/concepts/WaterCycle';
import PlateTectonics from './pages/concepts/PlateTectonics';


export default function App() {
  return (
    <Router basename="/physics">
      <Layout>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-2xl font-bold text-gray-500">Loading Module...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
          <Route path="/concepts/electricity" element={<Electricity />} />
          <Route path="/concepts/float-sink" element={<FloatSink />} />
          <Route path="/concepts/kinetic-energy" element={<KineticEnergy />} />
          <Route path="/concepts/light-shadows" element={<LightShadows />} />
          <Route path="/concepts/waves-light" element={<LightWaves />} />
          <Route path="/concepts/magnets" element={<Magnets />} />
          <Route path="/concepts/newtons-laws" element={<NewtonsLaws />} />
          <Route path="/concepts/optics" element={<Optics />} />
          <Route path="/concepts/simple-machines" element={<SimpleMachines />} />
          <Route path="/concepts/sound-waves" element={<SoundWaves />} />
          <Route path="/concepts/water-cycle" element={<WaterCycle />} />
          <Route path="/concepts/plate-tectonics" element={<PlateTectonics />} />

          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}
