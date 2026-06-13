import { useState, lazy, Suspense } from 'react';
import { AudioProvider } from './context/AudioContext';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import ErrorBoundary from './components/ErrorBoundary';
import SkipLink from './components/ui/SkipLink';
import { PageLoader } from './components/ui/LoadingSpinner';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import CompletionCelebration from './components/CompletionCelebration';
import { AchievementPopup, ProfilePage } from './components/gamification';
import Certificate from './components/gamification/Certificate';
import GamesHub from './components/games/GamesHub';
import { concepts } from './data/concepts';
import { useTranslation } from 'react-i18next';

// Lazy load concept modules for better performance
const NeuralNetworks = lazy(() => import('./components/concepts/NeuralNetworks'));
const LLM = lazy(() => import('./components/concepts/LLM'));
const Transformers = lazy(() => import('./components/concepts/Transformers'));
const RAG = lazy(() => import('./components/concepts/RAG'));
const Embeddings = lazy(() => import('./components/concepts/Embeddings'));
const ComputerVision = lazy(() => import('./components/concepts/ComputerVision'));
const PromptEngineering = lazy(() => import('./components/concepts/PromptEngineering'));
const AIEthics = lazy(() => import('./components/concepts/AIEthics'));
const ReinforcementLearning = lazy(() => import('./components/concepts/ReinforcementLearning'));
const GenerativeAI = lazy(() => import('./components/concepts/GenerativeAI'));
const AISafety = lazy(() => import('./components/concepts/AISafety'));

type View = 'home' | 'learning' | 'completed' | 'profile' | 'certificate' | 'games';

function AIWorldContent() {
  const { t } = useTranslation();
  const [view, setView] = useState<View>('home');
  const [currentConcept, setCurrentConcept] = useState<string | null>(null);

  const {
    completedConcepts,
    completeConcept,
    visitConcept,
    recentBadge,
    clearRecentBadge,
  } = useProgress();

  const handleSelectConcept = (conceptId: string) => {
    setCurrentConcept(conceptId);
    setView('learning');
    visitConcept(conceptId);
  };

  const handleConceptComplete = () => {
    if (currentConcept) {
      completeConcept(currentConcept);
    }
    setView('completed');
  };

  const handleBackToHome = () => {
    setView('home');
    setCurrentConcept(null);
  };

  const handleOpenProfile = () => {
    setView('profile');
  };

  const handleNextConcept = () => {
    if (!currentConcept) return;

    const currentIndex = concepts.findIndex(c =>c.id === currentConcept);
    const nextIndex = currentIndex + 1;

    if (nextIndex< concepts.length) {
      const nextConceptId = concepts[nextIndex].id;
      setCurrentConcept(nextConceptId);
      setView('learning');
      visitConcept(nextConceptId);
    } else {
      handleBackToHome();
    }
  };

  const getCurrentConceptTitle = () => {
    return concepts.find(c => c.id === currentConcept)?.title || '';
  };

  const hasNextConcept = () => {
    if (!currentConcept) return false;
    const currentIndex = concepts.findIndex(c =>c.id === currentConcept);
    return currentIndex< concepts.length - 1;
  };

  const renderConceptComponent = () => {
    const props = { onComplete: handleConceptComplete };

    switch (currentConcept) {
      case 'neural-networks':
        return <NeuralNetworks {...props} />;
      case 'llm':
        return <LLM {...props} />;
      case 'transformers':
        return <Transformers {...props} />;
      case 'rag':
        return <RAG {...props} />;
      case 'embeddings':
        return <Embeddings {...props} />;
      case 'computer-vision':
        return <ComputerVision {...props} />;
      case 'prompt-engineering':
        return <PromptEngineering {...props} />;
      case 'ai-ethics':
        return <AIEthics {...props} />;
      case 'reinforcement-learning':
        return <ReinforcementLearning {...props} />;
      case 'generative-ai':
        return <GenerativeAI {...props} />;
      case 'ai-safety':
        return <AISafety {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SkipLink />

      {/* Achievement Popup */}
      <AchievementPopup badge={recentBadge} onClose={clearRecentBadge} />

      {view !== 'completed' && view !== 'profile' && view !== 'certificate' && (
        <Header
          onHome={handleBackToHome}
          onProfile={handleOpenProfile}
          currentConcept={view === 'learning' ? getCurrentConceptTitle() : undefined}
        />
      )}

      <main id="main-content">
        {view === 'home' && (
          <LandingPage
            onSelectConcept={handleSelectConcept}
            completedConcepts={completedConcepts}
            onGames={() => setView('games')}
          />
        )}

        {view === 'learning' && currentConcept && (
          <Suspense fallback={<PageLoader message="Loading your adventure..." />}>
            <ErrorBoundary>
              {renderConceptComponent()}
            </ErrorBoundary>
          </Suspense>
        )}

        {view === 'completed' && currentConcept && (
          <CompletionCelebration
            conceptTitle={getCurrentConceptTitle()}
            onBackToHome={handleBackToHome}
            onNextConcept={handleNextConcept}
            hasNextConcept={hasNextConcept()}
          />
        )}

        {view === 'profile' && (
          <ProfilePage onClose={handleBackToHome} onCertificate={() => setView('certificate')} />
        )}

        {view === 'certificate' && (
          <Certificate onClose={handleBackToHome} />
        )}

        {view === 'games' && (
          <GamesHub onBack={handleBackToHome} />
        )}
      </main>
    </div>
  );
}

export default function AIWorld() {
  const { t } = useTranslation();
  return (
    <ErrorBoundary>
      <AudioProvider>
        <ProgressProvider>
          <AIWorldContent />
        </ProgressProvider>
      </AudioProvider>
    </ErrorBoundary>
  );
}
