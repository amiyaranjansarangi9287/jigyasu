import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@jigyasu/ui';
import Home from './pages/Home';

import Fractions from './pages/concepts/Fractions';
import Multiplication from './pages/concepts/Multiplication';
import NumberLine from './pages/concepts/NumberLine';
import Pi from './pages/concepts/Pi';
import Pythagorean from './pages/concepts/Pythagorean';
import Shapes from './pages/concepts/Shapes';


export default function App() {
  return (
    <Router basename="/math">
      <Layout>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-2xl font-bold text-gray-500">Loading Module...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
          <Route path="/concepts/fractions" element={<Fractions />} />
          <Route path="/concepts/multiplication" element={<Multiplication />} />
          <Route path="/concepts/number-line" element={<NumberLine />} />
          <Route path="/concepts/pi" element={<Pi />} />
          <Route path="/concepts/pythagorean" element={<Pythagorean />} />
          <Route path="/concepts/shapes" element={<Shapes />} />

          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}
