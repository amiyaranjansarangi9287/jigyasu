import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@jigyasu/storage';
import { useLearnerStore } from './learnos/store/learnerStore';
import TopNav from './components/TopNav';
import { ErrorBoundary } from './components/ErrorBoundary';
import OnboardingWizard from './components/OnboardingWizard';
import { Mascot } from './components/Mascot';
import GlobalNav from './components/GlobalNav';
import ProfilePage from './components/ProfilePage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ParentDashboard from './components/ParentDashboard';
import AboutPage from './components/AboutPage';
import SharedPhoneMode from './components/SharedPhoneMode';
import MasteryIndicator, { GardenProgress } from './components/MasteryIndicator';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ImpactDashboard from './components/ImpactDashboard';
import { useAgeTheme } from './hooks/useAgeTheme';
import WelcomeSection from './components/WelcomeSection';
import RecentActivity from './components/RecentActivity';
import NavigationCards from './components/NavigationCards';

const JigyasuApp = lazy(() => import('./learnos/App'));
const KidsCampApp = lazy(() => import('./kidscamp/App'));

function LandingPage() {
  const navigate = useNavigate();
  const { profile, saveProfile } = useUserProfile();
  const { t, i18n } = useTranslation();
  const { fontClass } = useAgeTheme();
  const getLastModule = useLearnerStore((state) => state.getLastModule);
  const moduleProgress = useLearnerStore((state) => state.moduleProgress);
  const [showSharedPhoneMode, setShowSharedPhoneMode] = useState(false);

  const lastModule = getLastModule();

  return (
    <div className={`min-h-[calc(100vh-72px)] bg-slate-50 flex flex-col ${fontClass} relative`}>
      {!profile && (
        <OnboardingWizard
          onComplete={(name, avatar, lang, ageTier) => {
            saveProfile({ name, avatar, language: lang, ageTier });
            i18n.changeLanguage(lang);
          }}
        />
      )}

      <main className="flex-1 flex flex-col w-full h-full relative overflow-hidden">
        {profile && (
          <>
            <WelcomeSection profile={profile} />

            <RecentActivity moduleProgress={moduleProgress} />
          </>
        )}

        <NavigationCards />
      </main>
    </div>
  );
}

import LoadingCharacter from './components/LoadingCharacter';

function RouteLoading({ label }: { label: string }) {
  const { t } = useTranslation();
  return (
    <main className="flex-1 grid place-items-center bg-sky-50 px-6 text-center">
      <section className="max-w-sm flex flex-col items-center">
        <LoadingCharacter message={t('getting_adventure_ready', 'Getting your adventure ready...')} />
        <p className="mt-4 text-lg font-black text-slate-800">{label}</p>
      </section>
    </main>
  );
}

import { useSettingsStore } from './learnos/store';
import { motion, AnimatePresence } from 'framer-motion';

function SwipeableRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const ROUTES = ['/', '/home', '/execute', '/profile'];
  const currentIndex = ROUTES.indexOf(location.pathname === '/' ? '/' : ROUTES.find(r => location.pathname.startsWith(r) && r !== '/') || '/home');
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    // Save last visited learning route
    const path = location.pathname;
    if (path !== '/' && !path.startsWith('/profile') && !path.startsWith('/parents') && !path.startsWith('/privacy') && !path.startsWith('/terms')) {
      try {
        localStorage.setItem('lastVisitedRoute', path);
      } catch (error) {
        console.warn('Failed to save last visited route:', error);
      }
    }
  }, [location.pathname]);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only capture swipes from edges (left or right 50px)
    const touchX = e.touches[0].clientX;
    if (touchX < 50 || touchX > window.innerWidth - 50) {
      setTouchStart(touchX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchX = e.changedTouches[0].clientX;
    const diff = touchStart - touchX;
    const swipeThreshold = 100;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && currentIndex < ROUTES.length - 1) {
        navigate(ROUTES[currentIndex + 1]);
      } else if (diff < 0 && currentIndex > 0) {
        navigate(ROUTES[currentIndex - 1]);
      }
    }
    setTouchStart(null);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="flex-1 flex flex-col w-full h-full"
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<ErrorBoundary><Suspense fallback={<RouteLoading label="Loading..." />}><LandingPage /></Suspense></ErrorBoundary>} />
          <Route path="/profile" element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
          <Route path="/about" element={<ErrorBoundary><AboutPage /></ErrorBoundary>} />
          <Route path="/privacy" element={<ErrorBoundary><PrivacyPolicy /></ErrorBoundary>} />
          <Route path="/terms" element={<ErrorBoundary><TermsOfService /></ErrorBoundary>} />
          <Route path="/parents" element={<ErrorBoundary><ParentDashboard /></ErrorBoundary>} />
          <Route path="/execute" element={<ErrorBoundary><Suspense fallback={<RouteLoading label="Opening Maker Space" />}><KidsCampApp /></Suspense></ErrorBoundary>} />
          <Route path="/execute/*" element={<ErrorBoundary><Suspense fallback={<RouteLoading label="Opening Maker Space" />}><KidsCampApp /></Suspense></ErrorBoundary>} />
          <Route path="*" element={<ErrorBoundary><Suspense fallback={<RouteLoading label="Opening Learning Paths" />}><JigyasuApp /></Suspense></ErrorBoundary>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { highContrast, dyslexiaFont } = useSettingsStore();

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (dyslexiaFont) {
      document.documentElement.classList.add('dyslexia-font');
    } else {
      document.documentElement.classList.remove('dyslexia-font');
    }
  }, [highContrast, dyslexiaFont]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <TopNav />
        <GlobalNav />
        <AnalyticsDashboard />
        <ImpactDashboard />
        <div id="main-content" className="min-h-screen md:pl-24 pb-[84px] md:pb-0 flex flex-col pt-[72px] overflow-hidden w-full max-w-[100vw]">
          <SwipeableRoutes />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
