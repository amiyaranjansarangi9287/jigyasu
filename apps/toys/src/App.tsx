import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedToys from './components/FeaturedToys';
import ToyGallery from './components/ToyGallery';
import WeeklyChallenge from './components/WeeklyChallenge';
import Testimonials from './components/Testimonials';
import HowItWorks from './components/HowItWorks';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ToyModal from './components/ToyModal';
import BuildMode from './components/BuildMode';
import FavoritesPanel from './components/FavoritesPanel';
import Workshop from './components/Workshop';
import SettingsPanel from './components/SettingsPanel';
import AchievementToast from './components/AchievementToast';
import { useFavorites } from './hooks/useFavorites';
import { useBuildStatus } from './hooks/useBuildStatus';
import { useAchievements } from './hooks/useAchievements';
import { useTheme } from './hooks/useTheme';
import { useSoundEffects } from './hooks/useSoundEffects';
import type { Toy } from './data/toys';
import { trackEvent } from '@jigyasu/storage';
import { toys } from './data/toys';

export default function App() {
  useEffect(() => {
    trackEvent('page_view', { app: 'toys', page: 'home' });
  }, []);

  const [selectedToy, setSelectedToy] = useState<Toy | null>(null);
  const [buildingToy, setBuildingToy] = useState<Toy | null>(null);
  const [favPanelOpen, setFavPanelOpen] = useState(false);
  const [workshopOpen, setWorkshopOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { getStatus, allProgress } = useBuildStatus();
  const { newlyUnlocked, dismissNewlyUnlocked, unlock, isUnlocked } = useAchievements();
  const { theme, setTheme } = useTheme();
  const { enabled: soundEnabled, toggleEnabled: toggleSound, playAchievement } = useSoundEffects();

  const featuredRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  // Count completed builds
  const completedBuildCount = useMemo(() => {
    return Object.values(allProgress).filter((p) => p.completedAt).length;
  }, [allProgress]);

  // Check for achievements
  useEffect(() => {
    // First build
    if (completedBuildCount >= 1 && !isUnlocked('first-build')) {
      unlock('first-build');
      playAchievement();
    }
    // Triple threat
    if (completedBuildCount >= 3 && !isUnlocked('triple-threat')) {
      unlock('triple-threat');
      playAchievement();
    }
    // Halfway there
    if (completedBuildCount >= 12 && !isUnlocked('halfway-there')) {
      unlock('halfway-there');
      playAchievement();
    }
    // Master builder
    if (completedBuildCount >= toys.length && !isUnlocked('master-builder')) {
      unlock('master-builder');
      playAchievement();
    }
    // Collector
    if (favorites.length >= 5 && !isUnlocked('collector')) {
      unlock('collector');
      playAchievement();
    }
    // Time-based achievements
    const totalTime = Object.values(allProgress).reduce((sum, p) => sum + (p.elapsedSeconds || 0), 0);
    if (totalTime >= 7200 && !isUnlocked('marathon')) { // 2 hours
      unlock('marathon');
      playAchievement();
    }
    // Check difficulty achievements
    const completedToys = toys.filter((t) => getStatus(t.id) === 'completed');
    if (completedToys.some((t) => t.difficulty === 'Easy') && !isUnlocked('easy-mode')) {
      unlock('easy-mode');
      playAchievement();
    }
    if (completedToys.some((t) => t.difficulty === 'Medium') && !isUnlocked('medium-mode')) {
      unlock('medium-mode');
      playAchievement();
    }
    if (completedToys.some((t) => t.difficulty === 'Hard') && !isUnlocked('hard-mode')) {
      unlock('hard-mode');
      playAchievement();
    }
  }, [completedBuildCount, favorites.length, allProgress, getStatus, isUnlocked, unlock, playAchievement]);

  // Check time-based achievements
  useEffect(() => {
    const hour = new Date().getHours();
    if (buildingToy) {
      if (hour >= 22 || hour < 5) {
        if (!isUnlocked('night-owl')) {
          unlock('night-owl');
          playAchievement();
        }
      }
      if (hour >= 5 && hour < 7) {
        if (!isUnlocked('early-bird')) {
          unlock('early-bird');
          playAchievement();
        }
      }
    }
  }, [buildingToy, isUnlocked, unlock, playAchievement]);

  const scrollTo = useCallback((section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      featured: featuredRef,
      gallery: galleryRef,
      testimonials: testimonialsRef,
      'how-it-works': howItWorksRef,
    };
    const ref = refs[section];
    if (ref?.current) {
      const offset = 64;
      const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const handleStartBuild = useCallback((toy: Toy) => {
    setSelectedToy(null);
    setWorkshopOpen(false);
    setBuildingToy(toy);
    trackEvent('build_start', { app: 'toys', toyId: toy.id });
  }, []);

  const handleCloseBuild = useCallback(() => {
    setBuildingToy(null);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Achievement Toast */}
      {newlyUnlocked && (
        <AchievementToast
          achievement={newlyUnlocked}
          onDismiss={dismissNewlyUnlocked}
        />
      )}

      {/* Build Mode — full-screen overlay when active */}
      {buildingToy && (
        <BuildMode
          toy={buildingToy}
          onClose={handleCloseBuild}
        />
      )}

      {/* Workshop */}
      <Workshop
        isOpen={workshopOpen}
        onClose={() => setWorkshopOpen(false)}
        onSelectToy={setSelectedToy}
        onStartBuild={handleStartBuild}
      />

      {/* Settings */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        soundEnabled={soundEnabled}
        onSoundToggle={toggleSound}
      />

      {/* Main site (hidden when build mode is open) */}
      {!buildingToy && !workshopOpen && (
        <>
          <Navbar
            onScrollTo={scrollTo}
            favoriteCount={favorites.length}
            onToggleFavPanel={() => setFavPanelOpen(!favPanelOpen)}
            onOpenWorkshop={() => setWorkshopOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
            buildCount={completedBuildCount}
          />

          <Hero onScrollTo={scrollTo} />

          <div ref={featuredRef}>
            <FeaturedToys
              onSelectToy={setSelectedToy}
              onStartBuild={handleStartBuild}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          </div>

          <WeeklyChallenge onStartBuild={handleStartBuild} />

          <div ref={galleryRef}>
            <ToyGallery
              onSelectToy={setSelectedToy}
              onStartBuild={handleStartBuild}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          </div>

          <div ref={testimonialsRef}>
            <Testimonials />
          </div>

          <div ref={howItWorksRef}>
            <HowItWorks />
          </div>

          <Newsletter />

          <Footer onScrollTo={scrollTo} />

          {/* Toy Detail Modal */}
          {selectedToy && (
            <ToyModal
              toy={selectedToy}
              onClose={() => setSelectedToy(null)}
              isFavorite={isFavorite(selectedToy.id)}
              onToggleFavorite={() => toggleFavorite(selectedToy.id)}
              onSelectToy={setSelectedToy}
              onStartBuild={handleStartBuild}
            />
          )}

          {/* Favorites Panel */}
          <FavoritesPanel
            isOpen={favPanelOpen}
            onClose={() => setFavPanelOpen(false)}
            favorites={favorites}
            onRemoveFavorite={toggleFavorite}
            onSelectToy={setSelectedToy}
          />
        </>
      )}
    </div>
  );
}
