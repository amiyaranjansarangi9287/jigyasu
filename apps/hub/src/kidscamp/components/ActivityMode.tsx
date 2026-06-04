// CampCraft - Activity Mode (Full Build Experience)

import { useState, useEffect, useRef } from 'react';
import { Activity } from '../data/activities.en';
import { pillars } from '../data/categories';
import { useTranslation } from 'react-i18next';
import { useActivityProgress } from '../hooks/useActivityProgress';

interface ActivityModeProps {
  activity: Activity;
  onClose: () => void;
  onComplete: () => void;
  playSound?: {
    playCheck: () => void;
    playUncheck: () => void;
    playSuccess: () => void;
  };
}

type Phase = 'materials' | 'building' | 'complete';

interface ConfettiPiece {
  left: string;
  backgroundColor: string;
  animationDelay: string;
  animationDuration: string;
}

const CONFETTI_COLORS = ['#FF6B35', '#4ECDC4', '#FFD93D', '#FF6B9D', '#6BCB77'];

function createConfettiPieces(): ConfettiPiece[] {
  return Array.from({ length: 50 }, () => ({
    left: `${Math.random() * 100}%`,
    backgroundColor: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${2 + Math.random() * 2}s`,
  }));
}

export default function ActivityMode({
  activity,
  onClose,
  onComplete,
  playSound
}: ActivityModeProps) {
  const { t } = useTranslation();
  const {
    progress,
    startActivity,
    toggleMaterial,
    completeStep,
    uncompleteStep,
    updateElapsedTime,
    completeActivity,
    resetProgress
  } = useActivityProgress(activity.id);

  // Determine initial phase based on saved progress
  const getInitialPhase = (): Phase => {
    if (progress.completedAt) return 'complete';
    if (progress.completedSteps.length > 0) return 'building';
    if (progress.materialsChecked.length === activity.materials.length && progress.materialsChecked.length > 0) {
      return 'building';
    }
    return 'materials';
  };

  const initialPhase = getInitialPhase();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [activeStep, setActiveStep] = useState(() => {
    // Find the first uncompleted step
    for (let i = 0; i < activity.steps.length; i++) {
      if (!progress.completedSteps.includes(i)) {
        return i;
      }
    }
    return activity.steps.length - 1;
  });

  const [timerRunning, setTimerRunning] = useState(() => initialPhase === 'building' && !progress.completedAt);
  const [elapsed, setElapsed] = useState(progress.elapsedSeconds);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [stepFeedback, setStepFeedback] = useState<boolean>(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pillar = pillars.find(p => p.id === activity.pillar);

  // Start activity on mount
  useEffect(() => {
    startActivity();
  }, [startActivity]);

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsed(prev => {
          const newValue = prev + 1;
          updateElapsedTime(newValue);
          return newValue;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerRunning, updateElapsedTime]);

  // Format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle material toggle
  const handleMaterialToggle = (index: number) => {
    toggleMaterial(index);
    if (!progress.materialsChecked.includes(index)) {
      playSound?.playCheck();
    } else {
      playSound?.playUncheck();
    }
  };

  // Handle step completion
  const handleStepComplete = (index: number) => {
    if (progress.completedSteps.includes(index)) {
      uncompleteStep(index);
      playSound?.playUncheck();
    } else {
      completeStep(index);
      playSound?.playCheck();
      
      setStepFeedback(true);
      setTimeout(() => setStepFeedback(false), 1200);

      // Check if all steps completed
      if (progress.completedSteps.length + 1 === activity.steps.length) {
        setPhase('complete');
        setConfettiPieces(createConfettiPieces());
        setShowConfetti(true);
        setTimerRunning(false);
        completeActivity();
        onComplete();
        playSound?.playSuccess();
      } else {
        // Auto-advance to next uncompleted step
        for (let i = 0; i < activity.steps.length; i++) {
          if (!progress.completedSteps.includes(i) && i !== index) {
            setActiveStep(i);
            break;
          }
        }
      }
    }
  };

  // Start building phase
  const handleStartBuilding = () => {
    setPhase('building');
    setTimerRunning(true);
  };

  // Skip materials
  const handleSkipMaterials = () => {
    // Mark all materials as checked
    activity.materials.forEach((_, index) => {
      if (!progress.materialsChecked.includes(index)) {
        toggleMaterial(index);
      }
    });
    handleStartBuilding();
  };

  // Reset activity
  const handleReset = () => {
    resetProgress();
    setPhase('materials');
    setActiveStep(0);
    setElapsed(0);
    setTimerRunning(false);
    setShowResetConfirm(false);
    setConfettiPieces([]);
    setShowConfetti(false);
  };

  // Handle exit with confirmation if in progress
  const handleExit = () => {
    if (phase === 'building' && progress.completedSteps.length > 0 && !progress.completedAt) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  const allMaterialsChecked = progress.materialsChecked.length === activity.materials.length;
  const completionPercentage = Math.round((progress.completedSteps.length / activity.steps.length) * 100);

  return (
    <div className="fixed inset-0 z-[70] bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col pt-[72px]">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {confettiPieces.map((piece, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={piece}
            />
          ))}
        </div>
      )}

      {/* Immediate Visual Feedback Overlay */}
      {stepFeedback && !showConfetti && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[90]">
          <div className="bg-green-500 text-white rounded-full p-6 shadow-2xl shadow-green-500/50 flex flex-col items-center justify-center animate-bounce-slow transform transition-all duration-300 scale-110">
            <span className="text-6xl">✨</span>
            <span className="font-bold text-xl mt-2">{t('kidscamp.activity_mode.great_job', 'Great Job!')}</span>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="sticky top-0 z-[80] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm px-4 py-3 safe-area-top">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleExit}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">{t('kidscamp.activity_mode.back', 'Back')}</span>
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-xl">{pillar?.icon}</span>
              <h1 className="font-bold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[250px] md:max-w-none">
                {activity.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2">
              <div className={`font-mono text-base sm:text-lg font-medium ${timerRunning ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {formatTime(elapsed)}
              </div>
              {phase === 'building' && (
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className={`p-2 rounded-full transition-colors ${
                    timerRunning
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                  }`}
                  title={timerRunning ? t('kidscamp.activity_mode.pause_timer', 'Pause timer') : t('kidscamp.activity_mode.resume_timer', 'Resume timer')}
                >
                  {timerRunning ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {/* Progress Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {progress.completedSteps.length}/{activity.steps.length}
              </span>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={t('kidscamp.activity_mode.reset_activity', 'Reset activity')}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {phase === 'building' && (
          <div className="max-w-5xl mx-auto mt-3">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-sm text-gray-500">
              <span>{completionPercentage}{t('kidscamp.activity_mode.complete', '% complete')}</span>
              <span>{activity.steps.length - progress.completedSteps.length} {t('kidscamp.activity_mode.steps_remaining', 'steps remaining')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* MATERIALS PHASE */}
        {phase === 'materials' && (
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full px-4 py-2 mb-4">
                <span>📦</span>
                <span className="font-medium">{t('kidscamp.activity_mode.step1', 'Step 1: Gather Materials')}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('kidscamp.activity_mode.before_begin', 'Before You Begin')}</h2>
              <p className="text-gray-600 dark:text-gray-300">{t('kidscamp.activity_mode.check_off', "Check off each item as you gather them. Don't worry if you're missing something - tap \"Skip for now\" to start anyway!")}</p>
            </div>

            {/* Materials Checklist */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
              <div className="space-y-2">
                {activity.materials.map((material, index) => (
                  <button
                    key={index}
                    onClick={() => handleMaterialToggle(index)}
                    className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all text-left ${
                      progress.materialsChecked.includes(index)
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        progress.materialsChecked.includes(index)
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 dark:border-gray-500'
                      }`}
                    >
                      {progress.materialsChecked.includes(index) && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-medium block truncate ${
                        progress.materialsChecked.includes(index)
                          ? 'text-green-700 dark:text-green-300 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {material.name}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {material.quantity && (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {material.quantity}
                          </span>
                        )}
                        {material.optional && (
                          <span className="text-sm px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300">{t('kidscamp.activity_mode.optional', 'Optional')}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Progress indicator */}
              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{progress.materialsChecked.length} of {activity.materials.length} {t('kidscamp.activity_mode.items', 'items')}</span>
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${(progress.materialsChecked.length / activity.materials.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Safety Notes */}
            {activity.safetyNotes.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 sm:p-6 mb-6 border border-amber-200 dark:border-amber-800">
                <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                  <span>⚠️</span> {t('kidscamp.activity_mode.safety_notes', 'Safety Notes')}
                </h4>
                <ul className="space-y-2">
                  {activity.safetyNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2 text-amber-700 dark:text-amber-300 text-sm">
                      <span className="mt-0.5">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sticky bottom-4">
              <button
                onClick={handleStartBuilding}
                disabled={!allMaterialsChecked}
                className={`flex-1 btn text-lg py-4 ${
                  allMaterialsChecked
                    ? 'btn-primary'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {allMaterialsChecked ? t('kidscamp.activity_mode.lets_build', "🚀 Let's Build!") : `${t('kidscamp.activity_mode.check', 'Check')} ${activity.materials.length - progress.materialsChecked.length} ${t('kidscamp.activity_mode.more_items', 'more items')}`}
              </button>
              <button
                onClick={handleSkipMaterials}
                className="btn btn-secondary sm:w-auto"
              >
                Skip for now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* BUILDING PHASE */}
        {phase === 'building' && (
          <div className="flex flex-col lg:flex-row h-full">
            {/* Steps Sidebar - Collapsible on mobile */}
            <div className="lg:w-72 flex-shrink-0 bg-white dark:bg-gray-800 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">{t('kidscamp.activity_mode.steps', 'Steps')}</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {progress.completedSteps.length}/{activity.steps.length}
                  </span>
                </div>
                
                {/* Mobile: Horizontal scroll, Desktop: Vertical list */}
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-scrollbar">
                  {activity.steps.map((step, index) => {
                    const isCompleted = progress.completedSteps.includes(index);
                    const isActive = activeStep === index;

                    return (
                      <button
                        key={index}
                        onClick={() => setActiveStep(index)}
                        className={`flex-shrink-0 lg:flex-shrink flex items-center gap-3 p-3 rounded-xl text-left transition-all min-w-[200px] lg:min-w-0 lg:w-full ${
                          isActive
                            ? 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-400'
                            : isCompleted
                            ? 'bg-green-50 dark:bg-green-900/20 border-2 border-transparent'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-2 border-transparent'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isActive
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                          }`}
                        >
                          {isCompleted ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate text-sm ${
                            isCompleted
                              ? 'text-green-700 dark:text-green-300'
                              : isActive
                              ? 'text-orange-700 dark:text-orange-300'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {step.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {step.duration}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Step Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="max-w-2xl mx-auto">
                {/* Step Header */}
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {activeStep + 1}
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {t('kidscamp.activity_mode.step', 'Step')} {activeStep + 1} {t('kidscamp.activity_mode.of', 'of')} {activity.steps.length}
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {activity.steps[activeStep].title}
                    </h2>
                  </div>
                </div>

                {/* Time Estimate */}
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-6 font-medium">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span> {t('kidscamp.activity_mode.estimated_time', 'Estimated time:')} {activity.steps[activeStep].duration}</span>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
                    {activity.steps[activeStep].description}
                  </p>
                </div>

                {/* Tip */}
                {activity.steps[activeStep].tip && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">💡</span>
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">{t('kidscamp.activity_mode.pro_tip', 'Pro Tip')}</p>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        {activity.steps[activeStep].tip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Parent Help Indicator */}
                {activity.steps[activeStep].parentHelp && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">👨‍👩‍👧</span>
                    <div>
                      <p className="font-medium text-purple-800 dark:text-purple-200 mb-1">{t('kidscamp.activity_mode.parent_help', 'Parent Help Needed')}</p>
                      <p className="text-purple-700 dark:text-purple-300 text-sm">
                        This step may require adult assistance for safety or complexity.
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 sticky bottom-4 bg-gray-50 dark:bg-gray-900 py-4 -mx-4 px-4 sm:static sm:bg-transparent sm:py-0 sm:mx-0 sm:px-0">
                  <button
                    onClick={() => handleStepComplete(activeStep)}
                    className={`flex-1 btn text-lg py-4 flex items-center justify-center gap-2 ${
                      progress.completedSteps.includes(activeStep)
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'btn-primary'
                    }`}
                  >
                    {progress.completedSteps.includes(activeStep) ? (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t('kidscamp.activity_mode.completed_undo', 'Completed! (tap to undo)')}
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t('kidscamp.activity_mode.mark_done', 'Mark as Done')}
                      </>
                    )}
                  </button>

                  {activeStep < activity.steps.length - 1 && !progress.completedSteps.includes(activeStep) && (
                    <button
                      onClick={() => setActiveStep(activeStep + 1)}
                      className="btn btn-secondary"
                    >
                      {t('kidscamp.activity_mode.skip_step', 'Skip Step')}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      activeStep === 0
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('kidscamp.activity_mode.previous', 'Previous')}
                  </button>
                  <button
                    onClick={() => setActiveStep(Math.min(activity.steps.length - 1, activeStep + 1))}
                    disabled={activeStep === activity.steps.length - 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      activeStep === activity.steps.length - 1
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {t('kidscamp.activity_mode.next', 'Next')}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPLETE PHASE */}
        {phase === 'complete' && (
          <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 text-center">
            <div className="mb-8">
              <div className="text-7xl sm:text-8xl mb-6 animate-bounce-slow">🎉</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('kidscamp.activity_mode.amazing_work', 'Amazing Work!')}</h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
                {t('kidscamp.activity_mode.you_completed', 'You completed')} <span className="font-bold text-orange-500">{activity.name}</span>
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="text-2xl sm:text-3xl mb-2">⏱️</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTime(elapsed)}
                </div>
                <div className="text-sm sm:text-sm text-gray-500 dark:text-gray-400">{t('kidscamp.activity_mode.total_time', 'Total Time')}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="text-2xl sm:text-3xl mb-2">✅</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {activity.steps.length}
                </div>
                <div className="text-sm sm:text-sm text-gray-500 dark:text-gray-400">{t('kidscamp.activity_mode.steps_done', 'Steps Done')}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="text-2xl sm:text-3xl mb-2">{pillar?.icon}</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {pillar?.name}
                </div>
                <div className="text-sm sm:text-sm text-gray-500 dark:text-gray-400">{t('kidscamp.activity_mode.pillar', 'Pillar')}</div>
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 sm:p-6 mb-8 text-left">
              <h4 className="font-bold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                <span>🧠</span> {t('kidscamp.activity_mode.skills', 'Skills You Practiced')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {activity.learningOutcomes.map((outcome, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 text-sm">
                    ✓ {outcome}
                  </span>
                ))}
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 sm:p-6 mb-8 text-left">
              <h4 className="font-bold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2">
                <span>🚀</span> {t('kidscamp.activity_mode.whats_next', "What's Next?")}
              </h4>
              <p className="text-orange-700 dark:text-orange-300 text-sm">
                Check your progress in the Workshop to see your achievements, or explore more activities in the same pillar!
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReset}
                className="flex-1 btn btn-secondary text-lg py-4"
              >
                {t('kidscamp.activity_mode.build_again', '🔄 Build Again')}
              </button>
              <button
                onClick={onClose}
                className="flex-1 btn btn-primary text-lg py-4"
              >
                {t('kidscamp.activity_mode.done_back', '✨ Done — Back to Activities')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowResetConfirm(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-modal-in">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('kidscamp.activity_mode.reset_progress', 'Reset Progress?')}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{t('kidscamp.activity_mode.reset_desc', 'This will clear all your progress for this activity. You\'ll start from the beginning.')}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 btn btn-secondary"
                >{t('kidscamp.activity_mode.cancel', 'Cancel')}</button>
                <button
                  onClick={handleReset}
                  className="flex-1 btn bg-red-500 hover:bg-red-600 text-white"
                >{t('kidscamp.activity_mode.reset', 'Reset')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowExitConfirm(false)} />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-modal-in">
            <div className="text-center">
              <div className="text-5xl mb-4">💾</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('kidscamp.activity_mode.save_exit', 'Save & Exit?')}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{t('kidscamp.activity_mode.save_exit_desc', 'Your progress is automatically saved! You can continue this activity anytime from where you left off.')}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 btn btn-secondary"
                >{t('kidscamp.activity_mode.keep_building', 'Keep Building')}</button>
                <button
                  onClick={onClose}
                  className="flex-1 btn btn-primary"
                >{t('kidscamp.activity_mode.save_exit_btn', 'Save & Exit')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
