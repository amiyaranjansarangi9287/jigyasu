// CampCraft - Main Application

import { useState, useRef, useCallback, useEffect } from 'react';
import { Activity, activities } from './data/activities';
import { trackEvent } from '@jigyasu/storage';
import { AgeTier, PillarId } from './data/categories';
import {
  useAgeFilter,
  useActivityStatus,
  useFavorites,
  useAchievements,
  useCampWeekStatus,
  useTheme,
  useSoundEffects
} from './hooks';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AgeSelector from './components/AgeSelector';
import PillarShowcase from './components/PillarShowcase';
import FeaturedActivities from './components/FeaturedActivities';
import CampWeeksPreview from './components/CampWeeksPreview';
import ActivityGallery from './components/ActivityGallery';
import ActivityMode from './components/ActivityMode';
import CampWeekModal from './components/CampWeekModal';
import ToddlerZone from './components/ToddlerZone';
import Footer from './components/Footer';

export default function App() {
  useEffect(() => {
    trackEvent('page_view', { app: 'camp', page: 'home' });
  }, []);

  // State
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [workshopOpen, setWorkshopOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [selectedCampWeek, setSelectedCampWeek] = useState<string | null>(null);
  const [activePillarFilter, setActivePillarFilter] = useState<PillarId | null>(null);

  // Hooks
  const { selectedAge, setSelectedAge } = useAgeFilter();
  const { getStatus, getCompletedCount, getCompletedByPillar, getTotalTime } = useActivityStatus();
  const { favorites, toggleFavorite, isFavorite, count: favoritesCount } = useFavorites();
  const { toastAchievement, dismissToast, unlock, isUnlocked, getUnlockedAchievements, getLockedAchievements, getProgress: getAchievementProgress } = useAchievements();
  const { getStatus: getWeekStatus, getCompletedWeeksCount } = useCampWeekStatus();
  const { theme, setTheme } = useTheme();
  const { enabled: soundEnabled, toggle: toggleSound, playClick, playCheck, playUncheck, playSuccess, playAchievement } = useSoundEffects();

  // Refs for scroll navigation
  const heroRef = useRef<HTMLDivElement>(null);
  const ageRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const campWeeksRef = useRef<HTMLDivElement>(null);
  const activitiesRef = useRef<HTMLDivElement>(null);

  // Achievement checking
  useEffect(() => {
    const completedCount = getCompletedCount();
    const totalTime = getTotalTime();

    // Milestone achievements
    if (completedCount >= 1 && !isUnlocked('first-activity')) {
      unlock('first-activity');
      playAchievement();
    }
    if (completedCount >= 5 && !isUnlocked('getting-started')) {
      unlock('getting-started');
      playAchievement();
    }
    if (completedCount >= 10 && !isUnlocked('double-digits')) {
      unlock('double-digits');
      playAchievement();
    }
    if (completedCount >= 25 && !isUnlocked('quarter-century')) {
      unlock('quarter-century');
      playAchievement();
    }
    if (completedCount >= 50 && !isUnlocked('super-camper')) {
      unlock('super-camper');
      playAchievement();
    }
    if (completedCount >= 60 && !isUnlocked('camp-legend')) {
      unlock('camp-legend');
      playAchievement();
    }

    // Pillar achievements
    const toyboxCount = getCompletedByPillar('toybox');
    const sciencelabCount = getCompletedByPillar('sciencelab');
    const artstudioCount = getCompletedByPillar('artstudio');
    const outdoorquestCount = getCompletedByPillar('outdoorquest');

    if (toyboxCount >= 1 && !isUnlocked('toybox-starter')) {
      unlock('toybox-starter');
      playAchievement();
    }
    if (toyboxCount >= 10 && !isUnlocked('toybox-master')) {
      unlock('toybox-master');
      playAchievement();
    }
    if (sciencelabCount >= 1 && !isUnlocked('sciencelab-starter')) {
      unlock('sciencelab-starter');
      playAchievement();
    }
    if (sciencelabCount >= 10 && !isUnlocked('sciencelab-master')) {
      unlock('sciencelab-master');
      playAchievement();
    }
    if (artstudioCount >= 1 && !isUnlocked('artstudio-starter')) {
      unlock('artstudio-starter');
      playAchievement();
    }
    if (artstudioCount >= 10 && !isUnlocked('artstudio-master')) {
      unlock('artstudio-master');
      playAchievement();
    }
    if (outdoorquestCount >= 1 && !isUnlocked('outdoorquest-starter')) {
      unlock('outdoorquest-starter');
      playAchievement();
    }
    if (outdoorquestCount >= 10 && !isUnlocked('outdoorquest-master')) {
      unlock('outdoorquest-master');
      playAchievement();
    }

    // Renaissance camper
    if (toyboxCount >= 1 && sciencelabCount >= 1 && artstudioCount >= 1 && outdoorquestCount >= 1 && !isUnlocked('renaissance-camper')) {
      unlock('renaissance-camper');
      playAchievement();
    }

    // Favorites achievement
    if (favoritesCount >= 10 && !isUnlocked('collector')) {
      unlock('collector');
      playAchievement();
    }

    // Marathon maker (5 hours = 18000 seconds)
    if (totalTime >= 18000 && !isUnlocked('marathon-maker')) {
      unlock('marathon-maker');
      playAchievement();
    }

    // Camp week achievements
    const completedWeeks = getCompletedWeeksCount();
    if (completedWeeks >= 1 && !isUnlocked('first-camp-week')) {
      unlock('first-camp-week');
      playAchievement();
    }
    if (completedWeeks >= 4 && !isUnlocked('summer-champion')) {
      unlock('summer-champion');
      playAchievement();
    }
  }, [getCompletedCount, getTotalTime, getCompletedByPillar, favoritesCount, getCompletedWeeksCount, isUnlocked, unlock, playAchievement]);

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

  // Activity handlers
  const handleSelectActivity = useCallback((activity: Activity) => {
    setSelectedActivity(activity);
  }, []);

  const handleStartActivity = useCallback((activity: Activity) => {
    setSelectedActivity(null);
    setActiveActivity(activity);
    trackEvent('activity_start', { app: 'camp', activityId: activity.id, pillar: activity.pillar });
  }, []);

  const handleCloseActivity = useCallback(() => {
    setActiveActivity(null);
  }, []);

  const handleActivityComplete = useCallback(() => {
    if (activeActivity) {
      trackEvent('activity_complete', { app: 'camp', activityId: activeActivity.id, pillar: activeActivity.pillar });
    }
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
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full p-6 animate-modal-in">
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
                  <span className="px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-lg font-medium">
                    Easy
                  </span>
                  <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-lg">
                    ⏱️ {selectedActivity.timeToMake}
                  </span>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 mb-6">
                  <p className="text-purple-700 dark:text-purple-300 text-lg">
                    👨‍👩‍👧 Ask a grown-up to help you with this activity!
                  </p>
                </div>

                <button
                  onClick={() => handleStartActivity(selectedActivity)}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all"
                >
                  🎨 Let's Make It!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievement Toast */}
        {toastAchievement && (
          <div className="fixed bottom-6 right-6 z-50 animate-achievement-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-pink-400 p-4 flex items-center gap-4 max-w-sm">
              <div className="w-16 min-h-16 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-3xl animate-bounce-slow">
                {toastAchievement.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs text-pink-500 font-medium uppercase">Yay! New Badge!</p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{toastAchievement.name}</p>
              </div>
              <button onClick={dismissToast} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" aria-label="Action button">
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
    <div className="min-h-screen">
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

      {/* Featured Activities */}
      <div ref={featuredRef}>
        <FeaturedActivities
          onSelectActivity={handleSelectActivity}
          onStartActivity={handleStartActivity}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          getStatus={getStatus}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedActivity(null)}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-in">
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 z-10"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="relative h-56 overflow-hidden rounded-t-3xl">
              <img
                src={selectedActivity.image}
                alt={selectedActivity.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* Status Badge */}
              {getStatus(selectedActivity.id) === 'completed' && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500 text-white text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </span>
              )}
              {getStatus(selectedActivity.id) === 'in-progress' && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-medium">
                  In Progress
                </span>
              )}

              {/* Title overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {selectedActivity.name}
                </h2>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <span>★ {selectedActivity.rating}</span>
                  <span>•</span>
                  <span>{selectedActivity.reviewCount} reviews</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`badge ${
                  selectedActivity.pillar === 'toybox' ? 'badge-toybox' :
                  selectedActivity.pillar === 'sciencelab' ? 'badge-sciencelab' :
                  selectedActivity.pillar === 'artstudio' ? 'badge-artstudio' : 'badge-outdoorquest'
                }`}>
                  {selectedActivity.pillar === 'toybox' ? '🧸' :
                   selectedActivity.pillar === 'sciencelab' ? '🔬' :
                   selectedActivity.pillar === 'artstudio' ? '🎨' : '🌿'}
                  {' '}{selectedActivity.pillar.charAt(0).toUpperCase() + selectedActivity.pillar.slice(1)}
                </span>
                <span className={`badge ${
                  selectedActivity.difficulty === 'Easy' ? 'badge-easy' :
                  selectedActivity.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'
                }`}>
                  {selectedActivity.difficulty}
                </span>
                <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  ⏱️ {selectedActivity.timeToMake}
                </span>
                <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  👤 Ages {selectedActivity.ageRange}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {selectedActivity.description}
              </p>

              {/* Materials Preview */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>📦</span> Materials Needed
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedActivity.materials.slice(0, 6).map((material, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
                      {material.name}
                      {material.optional && <span className="text-gray-400 ml-1">(opt)</span>}
                    </span>
                  ))}
                  {selectedActivity.materials.length > 6 && (
                    <span className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-500">
                      +{selectedActivity.materials.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              {/* Steps Preview */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>📋</span> {selectedActivity.steps.length} Steps
                </h4>
                <div className="space-y-2">
                  {selectedActivity.steps.slice(0, 3).map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">
                        {i + 1}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{step.title}</span>
                      <span className="text-xs text-gray-400">{step.duration}</span>
                    </div>
                  ))}
                  {selectedActivity.steps.length > 3 && (
                    <p className="text-sm text-gray-500 ml-9">
                      +{selectedActivity.steps.length - 3} more steps...
                    </p>
                  )}
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>🧠</span> What You'll Learn
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedActivity.learningOutcomes.map((outcome, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-green-100 dark:bg-green-900/30 text-sm text-green-700 dark:text-green-300">
                      ✓ {outcome}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cross-pillar connections */}
              {selectedActivity.crossPillar && selectedActivity.crossPillar.length > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                    <span>🔗</span> Cross-Pillar Connection
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    This activity connects with other pillars! Complete related activities to unlock the Connector achievement.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleStartActivity(selectedActivity)}
                  className="flex-1 btn btn-primary text-lg py-4"
                >
                  {getStatus(selectedActivity.id) === 'completed' ? '🔄 Build Again' :
                   getStatus(selectedActivity.id) === 'in-progress' ? '▶ Continue' :
                   '🚀 Start Activity'}
                </button>
                <button
                  onClick={() => {
                    toggleFavorite(selectedActivity.id);
                    playClick();
                  }}
                  className={`btn px-4 ${
                    isFavorite(selectedActivity.id)
                      ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 border-2 border-pink-300'
                      : 'btn-secondary'
                  }`}
                >
                  {isFavorite(selectedActivity.id) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workshop Panel */}
      {workshopOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setWorkshopOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl animate-slide-in-mobile overflow-y-auto">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Progress</h2>
              <button
                onClick={() => setWorkshopOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {getCompletedCount()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.floor(getTotalTime() / 60)}m
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Time</div>
                </div>
              </div>

              {/* Pillar Progress */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Pillar Progress</h3>
                <div className="space-y-3">
                  {[
                    { id: 'toybox', name: 'ToyBox', icon: '🧸', total: 24 },
                    { id: 'sciencelab', name: 'ScienceLab', icon: '🔬', total: 12 },
                    { id: 'artstudio', name: 'ArtStudio', icon: '🎨', total: 12 },
                    { id: 'outdoorquest', name: 'OutdoorQuest', icon: '🌿', total: 12 }
                  ].map((pillar) => {
                    const completed = getCompletedByPillar(pillar.id);
                    const percentage = Math.round((completed / pillar.total) * 100);
                    return (
                      <div key={pillar.id} className="flex items-center gap-3">
                        <span className="text-2xl">{pillar.icon}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-900 dark:text-white">{pillar.name}</span>
                            <span className="text-gray-500">{completed}/{pillar.total}</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-400 to-pink-500 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Achievements */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  Achievements ({getAchievementProgress().unlocked}/{getAchievementProgress().total})
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {getUnlockedAchievements().slice(0, 8).map((achievement) => (
                    <div
                      key={achievement.id}
                      className="aspect-square rounded-xl bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 flex items-center justify-center text-2xl"
                      title={achievement.name}
                    >
                      {achievement.icon}
                    </div>
                  ))}
                  {getLockedAchievements().slice(0, Math.max(0, 8 - getUnlockedAchievements().length)).map((achievement) => (
                    <div
                      key={achievement.id}
                      className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl grayscale opacity-30"
                      title={`Locked: ${achievement.name}`}
                    >
                      {achievement.icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSettingsOpen(false)}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-6 animate-modal-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Theme */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Theme</h4>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                      theme === t
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '💻'} {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Sound Effects</h4>
                  <p className="text-sm text-gray-500">Play sounds on actions</p>
                </div>
                <button
                  onClick={toggleSound}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    soundEnabled ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                 aria-label="Action button">
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${
                      soundEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* App Info */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                CampCraft v1.0 • Made with ❤️ for creative families
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Panel */}
      {favoritesOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setFavoritesOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl animate-slide-in-mobile">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Favorites ({favoritesCount})
              </h2>
              <button
                onClick={() => setFavoritesOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">💝</div>
                  <p className="text-gray-600 dark:text-gray-300">No favorites yet!</p>
                  <p className="text-sm text-gray-500">Tap the heart icon on any activity to save it here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {favorites.map((id) => {
                    const activity = activities.find(a => a.id === id);
                    if (!activity) return null;
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          handleSelectActivity(activity);
                          setFavoritesOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <span className="text-2xl">
                          {activity.pillar === 'toybox' ? '🧸' :
                           activity.pillar === 'sciencelab' ? '🔬' :
                           activity.pillar === 'artstudio' ? '🎨' : '🌿'}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{activity.name}</p>
                          <p className="text-sm text-gray-500">{activity.difficulty} • {activity.timeToMake}</p>
                        </div>
                        {getStatus(activity.id) === 'completed' && (
                          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
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
            <div className="w-14 min-h-14 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-2xl animate-bounce-slow">
              {toastAchievement.icon}
            </div>
            <div className="flex-1">
              <p className="text-xs text-orange-500 font-medium uppercase">Achievement Unlocked!</p>
              <p className="font-bold text-gray-900 dark:text-white">{toastAchievement.name}</p>
              <p className="text-sm text-gray-500">{toastAchievement.description}</p>
            </div>
            <button
              onClick={dismissToast}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
             aria-label="Action button">
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
