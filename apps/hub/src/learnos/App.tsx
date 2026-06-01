// src/App.tsx
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { KidFriendlyNotFound } from '../components/KidFriendlyNotFound';
import { LoadingScreen } from './shared/ui/LoadingScreen';
import { OfflineIndicator } from './shared/ui/OfflineIndicator';
import CrisisResources from '../components/CrisisResources';
import SafetyReportButton from '../components/SafetyReportButton';
import { ROUTES } from './constants/routes';
import { registerAllModules } from './core/modules/registerAllModules';
import { moduleRegistry } from './core/ModuleRegistry';
// Note: i18n is imported in main.tsx before App renders

registerAllModules();

// Enable Wonder-First modules for mission-aligned learning experience
moduleRegistry.setFeatureFlag('wonder-first', true);

// Lazy load all pages
const FamilyHome = lazy(() => import('./family/FamilyHome'));

const TinyWorld = lazy(() => import('./worlds/tiny'));
const EarlyWorld = lazy(() => import('./worlds/early'));
const LabWorld = lazy(() => import('./worlds/lab'));
const DiscoveryWorld = lazy(() => import('./worlds/discovery'));
const AcademyWorld = lazy(() => import('./worlds/academy'));
const ExplorerWorld = lazy(() => import('./worlds/explorer'));
const BiologyWorld = lazy(() => import('./worlds/biology/BiologyWorld'));
const MathWorld = lazy(() => import('./worlds/math/MathWorld'));
const PhysicsWorld = lazy(() => import('./worlds/physics/PhysicsWorld'));

// Crosscutting features
const DailyWarmUp = lazy(() => import('./crosscutting/DailyWarmUp'));
const MistakeMuseum = lazy(() => import('./crosscutting/MistakeMuseum'));
const TeachMeMode = lazy(() => import('./crosscutting/TeachMeMode'));
const TimeCapsule = lazy(() => import('./crosscutting/TimeCapsule'));
const ConceptGossip = lazy(() => import('./crosscutting/ConceptGossip'));
const WonderGarden = lazy(() => import('./crosscutting/WonderGarden'));
const AboutPage = lazy(() => import('./crosscutting/AboutPage'));

/** Child-safe recovery UI shown when a world crashes — isolates fault to that world only */
function WorldRecovery({ worldName }: { worldName: string }) {
  return (
    <main className="min-h-screen grid place-items-center bg-orange-50 p-6 text-center">
      <section className="max-w-md">
        <div className="text-6xl mb-4">🌟</div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">
          Oops! {worldName} took a little nap.
        </h1>
        <p className="text-slate-600 mb-6">
          No worries — your progress is safe. Try going back home and coming back!
        </p>
        <a
          href="/"
          className="inline-block bg-orange-400 text-white font-bold px-6 py-3 rounded-2xl hover:bg-orange-500 transition-colors"
        >
          🏠 Go Home
        </a>
      </section>
    </main>
  );
}

/** Wraps a world in its own ErrorBoundary + Suspense so a crash stays isolated */
function WorldRoute({ element, worldName }: { element: React.ReactNode; worldName: string }) {
  return (
    <ErrorBoundary fallback={<WorldRecovery worldName={worldName} />}>
      <Suspense fallback={<LoadingScreen message={`Opening ${worldName}…`} />}>
        {element}
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <OfflineIndicator />
      <CrisisResources />
      <SafetyReportButton />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Home */}
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.FAMILY_HOME} replace />} />
          <Route path={ROUTES.FAMILY_HOME} element={<FamilyHome />} />

          {/* World routes — each isolated in its own ErrorBoundary */}
          <Route path={`${ROUTES.TINY}/*`}      element={<WorldRoute element={<TinyWorld />}      worldName="Tiny World" />} />
          <Route path={`${ROUTES.EARLY}/*`}     element={<WorldRoute element={<EarlyWorld />}     worldName="Early World" />} />
          <Route path={`${ROUTES.LAB}/*`}       element={<WorldRoute element={<LabWorld />}       worldName="Lab World" />} />
          <Route path={`${ROUTES.DISCOVERY}/*`} element={<WorldRoute element={<DiscoveryWorld />} worldName="Discovery World" />} />
          <Route path={`${ROUTES.ACADEMY}/*`}   element={<WorldRoute element={<AcademyWorld />}   worldName="Academy World" />} />
          <Route path={`${ROUTES.EXPLORER}/*`}  element={<WorldRoute element={<ExplorerWorld />}  worldName="Explorer World" />} />
          <Route path="/biology/*"              element={<WorldRoute element={<BiologyWorld />}   worldName="Biology World" />} />
          <Route path="/math/*"                 element={<WorldRoute element={<MathWorld />}      worldName="Math Kingdom" />} />
          <Route path="/physics/*"              element={<WorldRoute element={<PhysicsWorld />}   worldName="Physics World" />} />

          {/* Crosscutting features */}
          <Route path={ROUTES.DAILY_WARMUP}   element={<DailyWarmUp />} />
          <Route path={ROUTES.MISTAKE_MUSEUM} element={<MistakeMuseum />} />
          <Route path={ROUTES.TEACH_ME}       element={<TeachMeMode />} />
          <Route path={ROUTES.TIME_CAPSULE}   element={<TimeCapsule />} />
          <Route path={ROUTES.CONCEPT_GOSSIP} element={<ConceptGossip />} />
          <Route path="/wonder-garden"        element={<WonderGarden />} />
          <Route path={ROUTES.ABOUT}          element={<AboutPage />} />

          {/* Catch all */}
          <Route path="*" element={<KidFriendlyNotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
