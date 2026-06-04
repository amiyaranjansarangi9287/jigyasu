// CampCraft - Main Application

import { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity } from './data/activities.en';
import { useLocalizedActivities } from '../hooks/useLocalizedData';
import { AgeTier, PillarId } from './data/categories';
import {
  useAgeFilter,
  useActivityStatus,
  useFavorites,
  useAchievements,
  useCampWeekStatus,
  useTheme,
  useSoundEffects,
  useAchievementEngine
} from './hooks';

// Lazy loaded modals
import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
const ActivityModal = lazy(() => import('./components/ActivityModal'));
const SettingsModal = lazy(() => import('./components/SettingsModal'));
const WorkshopPanel = lazy(() => import('./components/WorkshopPanel'));
const FavoritesPanel = lazy(() => import('./components/FavoritesPanel'));

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AgeSelector from './components/AgeSelector';
import PillarShowcase from './components/PillarShowcase';
import CampWeeksPreview from './components/CampWeeksPreview';
import ActivityGallery from './components/ActivityGallery';
import ActivityMode from './components/ActivityMode';
import CampWeekModal from './components/CampWeekModal';
import ToddlerZone from './components/ToddlerZone';
import Footer from './components/Footer';

export default function App() {
  const { t } = useTranslation();
  // State
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // URL-derived state replacing local boolean flags
  const workshopOpen = location.pathname.includes('/workshop');
  const settingsOpen = location.pathname.includes('/settings');
  const favoritesOpen = location.pathname.includes('/favorites');
  
  const activityMatch = location.pathname.match(/\/activity\/([^/]+)/);
  const { activities } = useLocalizedActivities();
  const selectedActivity = activityMatch ? activities.find(a => a.id === activityMatch[1]) || null : null;

  const setWorkshopOpen = useCallback((open: boolean) => {
    navigate(open ? '/execute/workshop' : '/execute');
  }, [navigate]);

  const setSettingsOpen = useCallback((open: boolean) => {
    navigate(open ? '/execute/settings' : '/execute');
  }, [navigate]);

  const setFavoritesOpen = useCallback((open: boolean) => {
    navigate(open ? '/execute/favorites' : '/execute');
  }, [navigate]);

  const setSelectedActivity = useCallback((activity: Activity | null) => {
    navigate(activity ? `/execute/activity/${activity.id}` : '/execute');
  }, [navigate]);
  const [selectedCampWeek, setSelectedCampWeek] = useState<string | null>(null);
  const [activePillarFilter, setActivePillarFilter] = useState<PillarId | null>(null);

  // Hooks
  const { selectedAge, setSelectedAge } = useAgeFilter();
  const { getStatus, getCompletedCount, getCompletedByPillar, getTotalTime } = useActivityStatus();
  const { favorites, toggleFavorite, isFavorite, count: favoritesCount } = useFavorites();
  const { toastAchievement, dismissToast, getUnlockedAchievements, getLockedAchievements, getProgress: getAchievementProgress } = useAchievements();
  const { getStatus: getWeekStatus } = useCampWeekStatus();
  const { theme, setTheme } = useTheme();
  const { enabled: soundEnabled, toggle: toggleSound, playClick, playCheck, playUncheck, playSuccess } = useSoundEffects();

  // Refs for scroll navigation
  const heroRef = useRef<HTMLDivElement>(null);
  const ageRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const campWeeksRef = useRef<HTMLDivElement>(null);
  const activitiesRef = useRef<HTMLDivElement>(null);

  // Achievement checking (extracted to custom hook)
  useAchievementEngine();

  // Navigation handler
  const handleNavigate = useCallback((section: string) => {
    playClick();
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      hero: heroRef,
      age: ageRef,
      pillars: pillarsRef,
      featured: featuredRef,
      'camp-weeks': campWeeksRef,
      activities: activitiesRef
    };

    if (section.startsWith('pillar-')) {
      const pillarId = section.replace('pillar-', '') as PillarId;
      setActivePillarFilter(pillarId === 'all' as unknown as PillarId ? null : pillarId);
      activitiesRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const ref = refs[section];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [playClick]);

  const handleSelectActivity = useCallback((activity: Activity) => {
    setSelectedActivity(activity);
  }, [setSelectedActivity]);
  const handleStartActivity = useCallback((activity: Activity) => {
    if (activity.url) {
      window.location.href = activity.url;
      return;
    }
    setSelectedActivity(null);
    setActiveActivity(activity);
    // Navigate to the activity URL to ensure proper routing
    navigate(`/execute/activity/${activity.id}`);
  }, [setSelectedActivity, navigate]);

  const handleCloseActivity = useCallback(() => {
    setActiveActivity(null);
  }, []);

  const handleActivityComplete = useCallback(() => {
    // Achievement checking will happen in useEffect
  }, []);

  // Age selection handler
  const handleSelectAge = useCallback((age: AgeTier) => {
    setSelectedAge(age);
    setShowAgeModal(false);
    playClick();
  }, [setSelectedAge, playClick]);

  // Exit toddler zone
  const handleExitToddlerZone = useCallback(() => {
    setSelectedAge(null);
    setShowAgeModal(true);
  }, [setSelectedAge]);

  // If in activity mode, show full-screen activity
  if (activeActivity) {
    return (
      <ActivityMode
        activity={activeActivity}
        onClose={handleCloseActivity}
        onComplete={handleActivityComplete}
        playSound={{ playCheck, playUncheck, playSuccess }}
      />
    );
  }

  // If toddler zone selected (ages 3-5), show special UI
  if (selectedAge === '3-5') {
    return (
      <>
        <ToddlerZone
          onSelectActivity={handleSelectActivity}
          onStartActivity={handleStartActivity}
          onExitToddlerZone={handleExitToddlerZone}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          getStatus={getStatus}
        />
        
        {/* Activity Modal for Toddler Zone */}
        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedActivity(null)} />
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 animate-modal-in">
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center">
                <div className="text-6xl mb-4">
                  {selectedActivity.pillar === 'toybox' ? '🧸' :
                   selectedActivity.pillar === 'sciencelab' ? '🔬' :
                   selectedActivity.pillar === 'artstudio' ? '🎨' : '🌿'}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {selectedActivity.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  {selectedActivity.description}
                </p>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-lg font-medium">{t('kidscamp.app.easy', 'Easy')}</span>
                  <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-lg">
                    ⏱️ {selectedActivity.timeToMake}
                  </span>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 mb-6">
                  <p className="text-purple-700 dark:text-purple-300 text-lg">👨‍👩‍👧 {t('kidscamp.app.ask_grownup', 'Ask a grown-up to help you with this activity!')}</p>
                </div>

                <button
                  onClick={() => handleStartActivity(selectedActivity)}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {t('kidscamp.app.lets_make_it', "Let's Make It!")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievement Toast */}
        {toastAchievement && (
          <div className="fixed bottom-6 right-6 z-50 animate-achievement-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-pink-400 p-4 flex items-center gap-4 max-w-sm">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-3xl animate-bounce-slow">
                {toastAchievement.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-pink-500 font-medium uppercase">{t('kidscamp.app.new_badge', 'Yay! New Badge!')}</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{t(`kidscamp.achievements.${toastAchievement.id}.name`, toastAchievement.name)}</p>
              </div>
              <button onClick={dismissToast} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenWorkshop={() => setWorkshopOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenFavorites={() => setFavoritesOpen(true)}
        favoritesCount={favoritesCount}
        completedCount={getCompletedCount()}
        selectedAge={selectedAge}
        onAgeClick={() => setShowAgeModal(true)}

      />

      {/* Hero Section */}
      <div ref={heroRef}>
        <Hero
          onGetStarted={() => ageRef.current?.scrollIntoView({ behavior: 'smooth' })}
          onExploreCampWeeks={() => campWeeksRef.current?.scrollIntoView({ behavior: 'smooth' })}
          totalActivities={activities.length}
          totalPillars={4}
        />
      </div>

      {/* Age Selector Section */}
      <div ref={ageRef}>
        <AgeSelector
          selectedAge={selectedAge}
          onSelectAge={handleSelectAge}
          variant="full"
        />
      </div>

      {/* Pillar Showcase */}
      <div ref={pillarsRef}>
        <PillarShowcase
          onSelectPillar={(pillarId) => handleNavigate(`pillar-${pillarId}`)}
          selectedAge={selectedAge}
        />
      </div>


      {/* Camp Weeks Preview */}
      <div ref={campWeeksRef}>
        <CampWeeksPreview
          onSelectWeek={(weekId) => setSelectedCampWeek(weekId)}
          getWeekStatus={getWeekStatus}
        />
      </div>

      {/* Full Activity Gallery */}
      <div ref={activitiesRef}>
        <ActivityGallery
          key={`${activePillarFilter ?? 'all'}-${selectedAge ?? 'all'}`}
          onSelectActivity={handleSelectActivity}
          onStartActivity={handleStartActivity}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          getStatus={getStatus}
          initialPillar={activePillarFilter}
          initialAge={selectedAge}
        />
      </div>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Age Selection Modal */}
      {showAgeModal && (
        <AgeSelector
          selectedAge={selectedAge}
          onSelectAge={handleSelectAge}
          variant="modal"
          onClose={() => setShowAgeModal(false)}
        />
      )}

      {/* Activity Modal */}
      {selectedActivity && (
        <Suspense fallback={null}>
          <ActivityModal
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            handleStartActivity={handleStartActivity}
            getStatus={getStatus}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            playClick={playClick}
          />
        </Suspense>
      )}

      {/* Workshop Panel */}
      {workshopOpen && (
        <Suspense fallback={null}>
          <WorkshopPanel
            setWorkshopOpen={setWorkshopOpen}
            getCompletedCount={getCompletedCount}
            getTotalTime={getTotalTime}
            getCompletedByPillar={getCompletedByPillar}
            getAchievementProgress={getAchievementProgress}
            getUnlockedAchievements={getUnlockedAchievements}
            getLockedAchievements={getLockedAchievements}
          />
        </Suspense>
      )}

      {/* Settings Panel */}
      {settingsOpen && (
        <Suspense fallback={null}>
          <SettingsModal
            theme={theme}
            setTheme={setTheme}
            soundEnabled={soundEnabled}
            toggleSound={toggleSound}
            setSettingsOpen={setSettingsOpen}
          />
        </Suspense>
      )}

      {/* Favorites Panel */}
      {favoritesOpen && (
        <Suspense fallback={null}>
          <FavoritesPanel
            favorites={favorites}
            favoritesCount={favoritesCount}
            handleSelectActivity={handleSelectActivity}
            setFavoritesOpen={setFavoritesOpen}
          />
        </Suspense>
      )}

      {/* Camp Week Modal */}
      {selectedCampWeek && (
        <CampWeekModal
          weekId={selectedCampWeek}
          onClose={() => setSelectedCampWeek(null)}
          onStartActivity={(activity) => {
            setSelectedCampWeek(null);
            handleStartActivity(activity);
          }}
          getActivityStatus={getStatus}
        />
      )}

      {/* Achievement Toast */}
      {toastAchievement && (
        <div className="fixed bottom-6 right-6 z-50 animate-achievement-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-orange-400 p-4 flex items-center gap-4 max-w-sm">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-2xl animate-bounce-slow">
              {toastAchievement.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm text-orange-500 font-medium uppercase">{t('kidscamp.app.achievement_unlocked', 'Achievement Unlocked!')}</p>
              <p className="font-bold text-gray-900 dark:text-white">{t(`kidscamp.achievements.${toastAchievement.id}.name`, toastAchievement.name)}</p>
              <p className="text-sm text-gray-500">{t(`kidscamp.achievements.${toastAchievement.id}.description`, toastAchievement.description)}</p>
            </div>
            <button
              onClick={dismissToast}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
