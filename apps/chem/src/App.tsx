import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@jigyasu/ui';
import Home from './pages/Home';

import AcidsBases from './pages/concepts/AcidsBases';
import Atoms from './pages/concepts/Atoms';
import ChemistryReactions from './pages/concepts/ChemistryReactions';
import PeriodicTable from './pages/concepts/PeriodicTable';
import StatesOfMatter from './pages/concepts/StatesOfMatter';


export default function App() {
  return (
    <Router basename="/chem">
      <Layout>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-2xl font-bold text-gray-500">Loading Module...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
          <Route path="/concepts/acids-bases" element={<AcidsBases />} />
          <Route path="/concepts/atoms" element={<Atoms />} />
          <Route path="/concepts/chemistry-reactions" element={<ChemistryReactions />} />
          <Route path="/concepts/periodic-table" element={<PeriodicTable />} />
          <Route path="/concepts/states-of-matter" element={<StatesOfMatter />} />

          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}
