// src/worlds/math/MathWorld.tsx
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingScreen } from '@/shared/ui';
import { useTranslation } from 'react-i18next';

const MathApp = lazy(() => import('./components/MathApp'));

export default function MathWorld() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="*" element={<MathApp />} />
      </Routes>
    </Suspense>
  );
}
