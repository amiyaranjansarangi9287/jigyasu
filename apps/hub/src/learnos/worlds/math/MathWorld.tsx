// src/worlds/math/MathWorld.tsx
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingScreen } from '@/shared/ui';

const MathApp = lazy(() => import('./components/MathApp'));

export default function MathWorld() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="*" element={<MathApp />} />
      </Routes>
    </Suspense>
  );
}
