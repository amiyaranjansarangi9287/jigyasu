import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@jigyasu/ui';
import Home from './pages/Home';

import DayNight from './pages/concepts/DayNight';
import MoonPhases from './pages/concepts/MoonPhases';
import SolarSystem from './pages/concepts/SolarSystem';
import GravitySpacetime from './pages/concepts/GravitySpacetime';


export default function App() {
  return (
    <Router basename="/cosmos">
      <Layout>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-2xl font-bold text-gray-500">Loading Module...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
          <Route path="/concepts/day-night" element={<DayNight />} />
          <Route path="/concepts/moon-phases" element={<MoonPhases />} />
          <Route path="/concepts/solar-system" element={<SolarSystem />} />
          <Route path="/concepts/gravity-spacetime" element={<GravitySpacetime />} />

          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}
